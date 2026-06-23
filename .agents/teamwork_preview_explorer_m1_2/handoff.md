# Handoff Report: Protection against brute force (Rate Limiting) in `/api/auth/validate-code/route.ts`

## 1. Observation
- The file `/src/app/api/auth/validate-code/route.ts` contains the logic for validating student access codes:
  ```typescript
  export async function POST(request: Request) {
    if (!hasSupabaseServiceConfig()) {
      return NextResponse.json(
        { message: 'Ambiente ainda não configurado para validar códigos.' },
        { status: 503 }
      )
    }
  ```
  It compares access codes via bcrypt `verifyCode` loop:
  ```typescript
  // Find matching code via hash comparison
  let matchedCode: (typeof codes)[0] | null = null
  for (const c of codes) {
    const match = await verifyCode(code, c.code_hash)
    if (match) {
      matchedCode = c
      break
    }
  }
  ```
  There is currently no rate limiting logic present in this file.
- The `SECURITY.md` file highlights this security gap as a known technical debt on lines 63-64:
  ```markdown
  - Rate limiting nas rotas de validação de código não está implementado. Para produção, adicionar limite de tentativas por IP.
  ```
- The frontend component `src/components/access/AccessForm.tsx` handles error responses from this route on lines 39-40:
  ```typescript
  if (!res.ok) {
    setError(data.message ?? 'Código inválido. Verifique e tente novamente.')
  ```
  This guarantees that returning any non-ok status code (like `429`) with a `{ message: "..." }` body will render the error message directly on the screen.

---

## 2. Logic Chain
1. Since the validation route does not check the frequency of incoming requests, a bot or user can repeatedly call `/api/auth/validate-code` with guessed codes without restriction.
2. Because checking the code involves a loop of bcrypt comparisons (`verifyCode(code, c.code_hash)`), a brute-force attack would result in excessive CPU consumption on the database/server.
3. To mitigate this risk, a rate-limiting check should be executed at the very beginning of the `POST` handler, preceding any database query.
4. Using an in-memory `Map` with IP addresses as keys and attempt counts + reset times as values allows zero-cost, dependency-free tracking of client validation attempts.
5. In Next.js, the client IP can be retrieved from headers like `x-forwarded-for` and `x-real-ip`. Sanitizing `x-forwarded-for` by taking only the first element (leftmost) is the standard method to retrieve the client IP.
6. A safety limit of 5 attempts per minute prevents fast scanning/guessing of codes. Returning `NextResponse.json({ message: "..." }, { status: 429, headers: ... })` appropriately signals client-side rate limit enforcement.
7. To prevent memory leaks, lazy pruning of expired entries and a hard limit on map size are needed.

---

## 3. Caveats
- **Serverless Environments**: Because this solution uses an in-memory `Map`, the rate limit state is local to each server process. On platforms like Vercel with multiple serverless functions running concurrently, requests might be routed to different server instances, and the limit will be tracked per instance (and reset on cold starts). For an MVP under a strict zero-cost constraint, this is an accepted limitation compared to the complexity and cost of external caching (e.g. Redis).
- **IP Spoofing**: If the host is not configured to sanitize headers, an attacker can supply custom headers (e.g. `X-Forwarded-For: spoofed-ip`) to bypass the limit. When deploying, the administrator must ensure that the load balancer or hosting provider (e.g. Vercel, Nginx) overrides/sanitizes these headers.

---

## 4. Conclusion
We recommend introducing a zero-cost in-memory rate limiter directly in `src/app/api/auth/validate-code/route.ts` with:
- Limit: 5 attempts per minute.
- IP extraction from `x-forwarded-for` (first entry) and `x-real-ip` headers.
- Return status `429` with standard headers (`Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`) and a localized error message.
- Memory leak protection via lazy pruning and clearing the map if it exceeds 10,000 active entries.
- Clear the IP's rate limit entry on successful code validation to immediately restore access.

---

## 5. Verification Method
After applying the recommended changes, the following steps can be used to verify rate limiting:

1. **Verify Rate Limiting Block**:
   Send 6 consecutive invalid validation requests using `curl` or PowerShell:
   - Bash:
     ```bash
     for i in {1..6}; do curl -i -X POST -H "Content-Type: application/json" -d '{"code":"QC-XX-XXXX", "revisionSlug":"matematica-6"}' http://localhost:3000/api/auth/validate-code; echo ""; done
     ```
   - PowerShell:
     ```powershell
     for ($i=1; $i -le 6; $i++) { Invoke-RestMethod -Uri "http://localhost:3000/api/auth/validate-code" -Method Post -Body '{"code":"QC-XX-XXXX","revisionSlug":"matematica-6"}' -ContentType "application/json" }
     ```
   - **Expected Result**: The first 5 requests will return status `401` or `404` (validation failed). The 6th request will immediately return status `429 Too Many Requests` with the JSON payload:
     `{"message":"Muitas tentativas. Por favor, tente novamente em X segundos."}`
     and headers:
     `Retry-After: <seconds_remaining>`
     `X-RateLimit-Limit: 5`
     `X-RateLimit-Remaining: 0`

2. **Verify Reset Window**:
   Wait 60 seconds after being blocked, and execute a request again.
   - **Expected Result**: The request should succeed or return `401` instead of `429`.

3. **Verify IP Isolation (Spoofing Check / Proxy Simulation)**:
   Simulate requests from different IPs:
   ```bash
   curl -i -H "X-Forwarded-For: 1.1.1.1" -X POST -H "Content-Type: application/json" -d '{"code":"QC-XX-XXXX", "revisionSlug":"matematica-6"}' http://localhost:3000/api/auth/validate-code
   curl -i -H "X-Forwarded-For: 2.2.2.2" -X POST -H "Content-Type: application/json" -d '{"code":"QC-XX-XXXX", "revisionSlug":"matematica-6"}' http://localhost:3000/api/auth/validate-code
   ```
   - **Expected Result**: Each IP must have its own pool of 5 attempts before being rate limited.
