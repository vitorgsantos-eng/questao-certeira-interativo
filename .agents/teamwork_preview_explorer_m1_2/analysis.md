# Analysis Report: Access Code Validation Rate Limiting (R2)

## 1. Problem Statement
The access code validation endpoint (`/api/auth/validate-code/route.ts`) is currently unprotected against brute-force attacks. Anyone can perform an infinite number of code validation requests to guess active access codes, potentially compromising the student revision sessions. Since active codes are matched via a bcrypt comparison in a loop, excessive attempts also consume significant CPU resources.

To mitigate this, we need to implement a simple, zero-cost, in-memory rate limiting system that:
- Identifies clients by their IP address.
- Limits validation attempts to **5 attempts per minute**.
- Blocks excess requests with an HTTP `429 Too Many Requests` status code.
- Responds with user-friendly messages and appropriate rate limit headers.

---

## 2. Safe Client IP Extraction
In Next.js App Router API Routes, we receive a standard `Request` object. There are three common ways to retrieve the client IP:
1. `request.headers.get('x-forwarded-for')`
2. `request.headers.get('x-real-ip')`
3. Casting `request` to `NextRequest` and accessing `request.ip` (which works automatically on Vercel).

### Security Concerns (Spoofing)
- **The Spoofing Risk**: If the application is exposed directly to the internet or behind a reverse proxy that does not sanitize request headers, an attacker can send a custom `X-Forwarded-For` header (e.g. `X-Forwarded-For: 8.8.8.8`). If the application blindly reads the first IP from `x-forwarded-for`, the attacker can rotate this header on every request to completely bypass the rate limiter or, worse, rate-limit other legitimate users.
- **Vercel Hosting**: If hosted on Vercel, Vercel's edge network automatically overwrites/sanitizes `x-forwarded-for` and sets `x-real-ip` to the actual client IP, making these headers trustable.
- **Custom VPS Hosting**: If self-hosted behind Nginx, Caddy, or Cloudflare, the reverse proxy must be configured to overwrite `X-Forwarded-For` with the actual connection IP before forwarding the request to the Next.js server.

### Recommended Helper Implementation
We recommend implementing a helper function `getClientIp(request: Request)` that safely retrieves the client IP by inspecting headers in a prioritized order:
```typescript
function getClientIp(request: Request): string {
  const xForwardedFor = request.headers.get('x-forwarded-for')
  if (xForwardedFor) {
    // x-forwarded-for can be a comma-separated list; the leftmost IP is the client
    const clientIp = xForwardedFor.split(',')[0].trim()
    if (clientIp) return clientIp
  }
  
  const xRealIp = request.headers.get('x-real-ip')
  if (xRealIp) return xRealIp.trim()
  
  // Cast in case NextRequest is used
  const nextRequestIp = (request as { ip?: string }).ip
  if (nextRequestIp) return nextRequestIp

  return '127.0.0.1' // fallback for local development
}
```

---

## 3. In-Memory Rate Limiting Design
An in-memory `Map` is used to track client attempts. Since we are operating under a zero-cost constraint and avoiding external database/cache calls (e.g. Redis), this is the optimal approach for the MVP.

### Memory Leak Protection
To prevent the `Map` from growing infinitely when under bot attacks, we introduce two safety mechanisms:
1. **Lazy Pruning**: When the map exceeds a threshold size (e.g. `10,000` entries), we iterate through all keys and delete expired entries.
2. **Hard Clear**: If lazy pruning fails to bring the map size under the threshold (which could happen under massive simultaneous attacks within the 1-minute window), we clear the map entirely to prevent Out-Of-Memory (OOM) errors.

### Reset Behavior
- If an attempt succeeds, the IP's rate limit entry is cleared immediately to allow a legitimate student who made typos to have their limit reset.
- If the attempt fails, the attempt count is incremented.
- Once the count exceeds 5, the user is blocked until the reset timestamp is reached.

---

## 4. Proposed Code Changes
Below is the proposed implementation patch for `src/app/api/auth/validate-code/route.ts`.

### Diff Patch Proposal
```diff
===================================================================
--- src/app/api/auth/validate-code/route.ts
+++ src/app/api/auth/validate-code/route.ts
@@ -10,12 +10,61 @@
 })
 
+// Simple In-Memory Rate Limiter config
+const WINDOW_MS = 60 * 1000 // 1 minute
+const MAX_ATTEMPTS = 5
+const MAX_MAP_SIZE = 10000 // Memory leak protection
+
+interface RateLimitData {
+  attempts: number
+  resetTime: number
+}
+
+const rateLimitMap = new Map<string, RateLimitData>()
+
+function getClientIp(request: Request): string {
+  const xForwardedFor = request.headers.get('x-forwarded-for')
+  if (xForwardedFor) {
+    const clientIp = xForwardedFor.split(',')[0].trim()
+    if (clientIp) return clientIp
+  }
+  const xRealIp = request.headers.get('x-real-ip')
+  if (xRealIp) return xRealIp.trim()
+  return '127.0.0.1'
+}
+
+function cleanExpiredEntries() {
+  const now = Date.now()
+  for (const [ip, data] of rateLimitMap.entries()) {
+    if (now > data.resetTime) {
+      rateLimitMap.delete(ip)
+    }
+  }
+}
+
 export async function POST(request: Request) {
+  // 1. Rate Limiting Check
+  const ip = getClientIp(request)
+  const now = Date.now()
+
+  if (rateLimitMap.size > MAX_MAP_SIZE) {
+    cleanExpiredEntries()
+    if (rateLimitMap.size > MAX_MAP_SIZE) {
+      rateLimitMap.clear()
+    }
+  }
+
+  const limitData = rateLimitMap.get(ip)
+
+  if (limitData && now < limitData.resetTime) {
+    if (limitData.attempts >= MAX_ATTEMPTS) {
+      const secondsRemaining = Math.ceil((limitData.resetTime - now) / 1000)
+      return NextResponse.json(
+        { message: `Muitas tentativas. Por favor, tente novamente em ${secondsRemaining} segundos.` },
+        {
+          status: 429,
+          headers: {
+            'Retry-After': String(secondsRemaining),
+            'X-RateLimit-Limit': String(MAX_ATTEMPTS),
+            'X-RateLimit-Remaining': '0',
+            'X-RateLimit-Reset': String(Math.ceil(limitData.resetTime / 1000)),
+          },
+        }
+      )
+    }
+    limitData.attempts += 1
+  } else {
+    rateLimitMap.set(ip, {
+      attempts: 1,
+      resetTime: now + WINDOW_MS,
+    })
+  }
+
   if (!hasSupabaseServiceConfig()) {
     return NextResponse.json(
       { message: 'Ambiente ainda não configurado para validar códigos.' },
       { status: 503 }
     )
   }
@@ -116,5 +165,8 @@
     })
   )
 
+  // Validation succeeded; clean up rate limit for this IP
+  rateLimitMap.delete(ip)
+
   return NextResponse.json({ ok: true })
 }
```
