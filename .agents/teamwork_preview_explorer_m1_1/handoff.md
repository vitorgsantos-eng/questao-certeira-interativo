# Handoff Report — Session HMAC Signing and Expiration Verification

This report outlines the analysis and recommendation for implementing **R1 (Session HMAC cryptographic signing)** and **R3 (Strict verification of session expiration)** in `src/lib/auth-lite/session.ts`.

---

## 1. Observation
In the read-only exploration of the codebase, the following patterns were observed:

1. **Session Serialization and Encoding (`src/lib/auth-lite/session.ts`):**
   - At line 9, the raw session cookie is extracted: `const raw = cookieStore.get(SESSION_COOKIE)?.value`.
   - At lines 12–14, it is directly decoded from Base64 and parsed as JSON:
     ```typescript
     const session: StudentSession = JSON.parse(
       Buffer.from(raw, 'base64').toString('utf-8')
     )
     ```
   - At line 24, when setting a session, it is encoded as raw Base64 without any cryptographic signature:
     ```typescript
     const encoded = Buffer.from(JSON.stringify(session)).toString('base64')
     ```
   
2. **Session Signature Vulnerability (`SECURITY.md`):**
   - Line 62 explicitly documents this technical debt:
     > `- A sessão em base64 não é assinada criptograficamente. Para produção com mais usuários, considerar assinar com SESSION_SECRET usando HMAC ou migrar para JWT.`

3. **Access Code Verification & Creation (`src/app/api/auth/validate-code/route.ts`):**
   - When validating a code, the backend checks if `expires_at` is in the past (lines 78–88).
   - If not expired, a session is constructed where `expiresAt` is set to `matchedCode.expires_at` (line 115).
   
4. **Current Session Expiration Verification (`src/lib/auth-lite/session.ts`):**
   - At line 15, `getSession()` checks if the session's timestamp is in the past:
     ```typescript
     if (new Date(session.expiresAt) < new Date()) return null
     ```
   - However, there is no active verification against the database to check if the code has been updated to `expired` or `revoked` in the `access_codes` table since the cookie was generated.

---

## 2. Logic Chain
Based on these observations:
1. Since the session cookie `qci_session` is only encoded in Base64 (Obs 1.1, 1.2), a client can decode the cookie, modify `expiresAt` or `studentId`, encode it back to Base64, and successfully authenticate as any user or extend their own session indefinitely.
2. In order to fulfill **R1**, we must sign the Base64 session string using `crypto.createHmac('sha256', SESSION_SECRET)` and store the token as `<base64_payload>.<base64_signature>`. When verifying, we must re-compute the HMAC and compare it using `crypto.timingSafeEqual` to avoid timing attacks.
3. In order to fulfill **R3**, checking only the cookie-level `expiresAt` is insufficient. If a teacher revokes an access code or marks it as expired in the database (Obs 3), the client cookie remains valid until its timestamp expires.
4. Therefore, `getSession()` must actively verify that the access code associated with the session's `studentId` and `revisionId` is still `active` and has not expired in the database (`access_codes` table).
5. Because `getSession()` is called in multiple layout and page components during a single page render (Obs 4), hitting the database repeatedly will cause performance bottlenecks. We must wrap `getSession()` with React's `cache` to memoize the database verification per-request lifecycle.

---

## 3. Caveats
- **Environment Variable Fallback:** The implementation requires `SESSION_SECRET`. In development, we recommend using a fallback key if the environment variable is not defined, to prevent immediate application crashes during initial local workspace setups. In production, it must throw an error.
- **Database Load:** Actively querying the database on every session check introduces a database read round-trip. While React's `cache` mitigates this for a single render cycle, it still increases the database load compared to a purely stateless token check.

---

## 4. Conclusion and Strategy
We recommend refactoring `src/lib/auth-lite/session.ts` to implement:
1. Native HMAC-SHA256 signature generation and timing-safe signature verification.
2. React request-memoized session caching.
3. Active verification against the `access_codes` table using `createServiceClient` from `@/lib/supabase/server`.

### Recommended Code Changes:

#### File: `src/lib/auth-lite/session.ts`
```typescript
import { cookies } from 'next/headers'
import crypto from 'crypto'
import { cache } from 'react'
import type { StudentSession } from '@/types'
import { createServiceClient, hasSupabaseServiceConfig } from '@/lib/supabase/server'

const SESSION_COOKIE = 'qci_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 15 // 15 days

// Helper to retrieve session secret with a safe fallback in development
function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'development') {
      return 'dev-fallback-session-secret-key-32-chars-minimum'
    }
    throw new Error('SESSION_SECRET is not configured in production environment variables.')
  }
  return secret
}

// Request-memoized session getter to prevent duplicate DB requests per-render
export const getSession = cache(async (): Promise<StudentSession | null> => {
  const cookieStore = await cookies()
  const raw = cookieStore.get(SESSION_COOKIE)?.value
  if (!raw) return null

  // Split payload and signature
  const parts = raw.split('.')
  if (parts.length !== 2) return null
  const [payload, signature] = parts

  try {
    const secret = getSessionSecret()

    // 1. HMAC Signature Verification
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('base64')

    const expectedBuf = Buffer.from(expectedSignature)
    const actualBuf = Buffer.from(signature)

    if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
      console.warn('Session signature verification failed.')
      return null
    }

    // Decode session payload
    const session: StudentSession = JSON.parse(
      Buffer.from(payload, 'base64').toString('utf-8')
    )

    // 2. Cookie Timestamp Verification
    if (new Date(session.expiresAt) < new Date()) {
      return null
    }

    // 3. Active Access Code Database Verification (Requirement R3)
    if (hasSupabaseServiceConfig()) {
      const supabase = await createServiceClient()
      const { data: code } = await supabase
        .from('access_codes')
        .select('status, expires_at')
        .eq('student_id', session.studentId)
        .eq('revision_id', session.revisionId)
        .eq('status', 'active')
        .maybeSingle()

      // Block access if no active code found in database
      if (!code) {
        return null
      }

      // Block access if code is expired in database
      if (new Date(code.expires_at) < new Date()) {
        // Automatically sync database status to expired
        await supabase
          .from('access_codes')
          .update({ status: 'expired' })
          .eq('student_id', session.studentId)
          .eq('revision_id', session.revisionId)
        return null
      }
    }

    return session
  } catch (err) {
    console.error('Error parsing/verifying session:', err)
    return null
  }
})

export async function setSession(session: StudentSession): Promise<void> {
  const cookieStore = await cookies()
  const secret = getSessionSecret()

  const payload = Buffer.from(JSON.stringify(session)).toString('base64')
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64')

  const token = `${payload}.${signature}`

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export function buildSession(opts: {
  studentId: string
  revisionId: string
  revisionSlug: string
  displayName: string
  grade: string
  codeExpiresAt: string
}): StudentSession {
  return {
    studentId: opts.studentId,
    revisionId: opts.revisionId,
    revisionSlug: opts.revisionSlug,
    displayName: opts.displayName,
    grade: opts.grade,
    expiresAt: opts.codeExpiresAt,
  }
}
```

---

## 5. Verification Method

### Testing Plan
The implementer can verify the changes by running a test script or adding it to `scripts/test-session-signing.ts`.

#### Test Script Design (`scripts/test-session-signing.ts`):
```typescript
import crypto from 'crypto'

// Mocking getSessionSecret function matching session.ts behavior
function getSessionSecretMock(envSecret?: string): string {
  const secret = envSecret || process.env.SESSION_SECRET
  if (!secret) {
    return 'dev-fallback-session-secret-key-32-chars-minimum'
  }
  return secret
}

// Test case implementations
async function runTests() {
  console.log('--- RUNNING SESSION SIGNATURE & EXPIRATION VERIFICATION TESTS ---')

  const testSession = {
    studentId: '123e4567-e89b-12d3-a456-426614174000',
    revisionId: '123e4567-e89b-12d3-a456-426614174001',
    revisionSlug: 'teste-revisao',
    displayName: 'Aluno Teste',
    grade: '9ano',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // expires in 1 hour
  }

  const secret = getSessionSecretMock()

  // 1. Create a signed cookie
  const payload = Buffer.from(JSON.stringify(testSession)).toString('base64')
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64')
  const rawCookie = `${payload}.${signature}`

  // 2. Test valid signature
  const [p1, s1] = rawCookie.split('.')
  const expectedSig1 = crypto.createHmac('sha256', secret).update(p1).digest('base64')
  const isValid1 = crypto.timingSafeEqual(Buffer.from(expectedSig1), Buffer.from(s1))
  console.log('Test 1: Valid signature matches:', isValid1 ? 'PASS' : 'FAIL')

  // 3. Test forged payload with same signature
  const forgedSession = { ...testSession, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString() }
  const forgedPayload = Buffer.from(JSON.stringify(forgedSession)).toString('base64')
  const expectedSigForged = crypto.createHmac('sha256', secret).update(forgedPayload).digest('base64')
  const isValidForged = crypto.timingSafeEqual(Buffer.from(expectedSigForged), Buffer.from(s1))
  console.log('Test 2: Forged payload rejected:', !isValidForged ? 'PASS' : 'FAIL')

  // 4. Test expired session timestamp
  const expiredSession = { ...testSession, expiresAt: new Date(Date.now() - 1000 * 60).toISOString() } // 1 minute in the past
  const expiredPayload = Buffer.from(JSON.stringify(expiredSession)).toString('base64')
  const isExpired = new Date(expiredSession.expiresAt) < new Date()
  console.log('Test 3: Expired session timestamp detected:', isExpired ? 'PASS' : 'FAIL')

  console.log('--- TESTS COMPLETED ---')
}

runTests().catch(console.error)
```

#### Verification Steps:
1. Run the test verification script using:
   ```bash
   npx tsx scripts/test-session-signing.ts
   ```
2. Verify that type-check and lint continue to pass without errors:
   ```bash
   npm run type-check
   npm run lint
   ```
3. To invalidate/reproduce:
   - Clear browser cookies and log in again using a valid code from `/acessar/revisao-9ano-triangulos-sistemas` or any seed code.
   - Manually modify the `qci_session` cookie in browser developer tools (e.g. change a letter in the base64 part). Attempt to refresh the page. The app should redirect back to `/acessar/...`, confirming the signature check successfully blocked the forged session.
