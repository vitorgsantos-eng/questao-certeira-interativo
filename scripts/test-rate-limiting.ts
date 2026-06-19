import Module from 'module'

// 1. Setup next/headers mock BEFORE importing route handler
const cookieStoreState = new Map<string, string>()
const mockCookieStore = {
  get: (name: string) => {
    const val = cookieStoreState.get(name)
    return val ? { value: val } : undefined
  },
  set: (name: string, value: string, options?: any) => {
    cookieStoreState.set(name, value)
  },
  delete: (name: string) => {
    cookieStoreState.delete(name)
  },
  getAll: () => [],
}

const originalRequire = Module.prototype.require
Module.prototype.require = function (id) {
  if (id === 'next/headers') {
    return {
      cookies: async () => mockCookieStore,
    }
  }
  return originalRequire.apply(this, arguments as any)
}

// Set environment variables for testing
;(process.env as Record<string, string>).NODE_ENV = 'test'
process.env.SESSION_SECRET = 'test-secret-at-least-32-chars-long-here-123'

import { POST } from '../src/app/api/auth/validate-code/route'
import { rateLimitMap } from '../src/lib/auth-lite/rate-limit'

async function runRateLimitingTests() {
  console.log('=== RUNNING RATE LIMITING TESTS ===\n')

  let passed = 0
  let failed = 0

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`[PASS] ${message}`)
      passed++
    } else {
      console.error(`[FAIL] ${message}`)
      failed++
    }
  }

  // Clear any existing rate limit records
  rateLimitMap.clear()

  // helper to make a mock request
  async function makeRequest(ip: string, code: string) {
    const req = new Request('http://localhost/api/auth/validate-code', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': ip,
      },
      body: JSON.stringify({
        code,
        revisionSlug: 'revisao-triangulos',
      }),
    })
    return await POST(req)
  }

  // Test 1: Returning HTTP 429 after 5 failed validation attempts
  console.log('--- Test 1: Rate Limiting Lockout ---')
  const ipA = '192.168.1.1'

  // First 5 attempts should fail with 401 (Invalid code) since code is incorrect
  for (let i = 1; i <= 5; i++) {
    const res = await makeRequest(ipA, 'WRONG-CODE')
    assert(res.status === 401, `Attempt ${i} fails with 401 Unauthorized`)
  }

  // 6th attempt should return 429 Too Many Requests
  const resBlocked = await makeRequest(ipA, 'WRONG-CODE')
  assert(resBlocked.status === 429, '6th attempt returns HTTP 429 Too Many Requests')

  // Test 2: Check headers like Retry-After
  console.log('\n--- Test 2: Retry-After Header ---')
  const retryAfterHeader = resBlocked.headers.get('Retry-After')
  assert(retryAfterHeader !== null, 'Retry-After header is present on 429 response')
  if (retryAfterHeader) {
    const seconds = parseInt(retryAfterHeader, 10)
    assert(seconds > 0 && seconds <= 900, `Retry-After value is a valid duration: ${seconds} seconds`)
  }

  // Test 3: Check IP isolation
  console.log('\n--- Test 3: IP Isolation ---')
  const ipB = '192.168.1.2'
  // IP B has not failed, so its request should return 401 instead of 429 even though IP A is blocked
  const resIpB = await makeRequest(ipB, 'WRONG-CODE')
  assert(resIpB.status === 401, 'IP B is not blocked (IP isolation is active)')

  // Test 4: Verify rate limit clears on success
  console.log('\n--- Test 4: Rate Limit Cleared on Success ---')
  const ipC = '192.168.1.3'

  // 3 failed attempts
  for (let i = 1; i <= 3; i++) {
    await makeRequest(ipC, 'WRONG-CODE')
  }
  const recordBefore = rateLimitMap.get(ipC)
  assert(recordBefore !== undefined && recordBefore.attempts === 3, 'IP C has 3 registered failures')

  // 1 successful attempt
  // VALID-CODE is defined in our mock supabase client to succeed
  const resSuccess = await makeRequest(ipC, 'VALID-CODE')
  assert(resSuccess.status === 200, 'IP C performs a successful code validation')

  // Verify record is cleared
  const recordAfter = rateLimitMap.get(ipC)
  assert(recordAfter === undefined, 'Rate limit record for IP C is cleared on success')

  // Verify that subsequent failures start from 1, not 4
  await makeRequest(ipC, 'WRONG-CODE')
  const recordNew = rateLimitMap.get(ipC)
  assert(recordNew !== undefined && recordNew.attempts === 1, 'IP C attempts reset to 1 after success')

  console.log(`\n=== RESULTS: ${passed} Passed, ${failed} Failed ===`)
  if (failed > 0) {
    process.exit(1)
  } else {
    process.exit(0)
  }
}

runRateLimitingTests().catch((err) => {
  console.error('Test execution failed:', err)
  process.exit(1)
})
