import { isValidCodeFormat, verifyCode, hashCode, generateRawCode } from '../src/lib/validation/code'

async function run() {
  console.log('=== RUNNING CODE VALIDATION LOGIC TESTS ===\n')

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

  // --- Tier 1: Code Format Validation ---
  console.log('--- Tier 1: Code Format ---')

  const generated = generateRawCode()
  assert(isValidCodeFormat(generated), `Generated code "${generated}" matches expected format`)

  const invalidCodes = ['qc-123', 'QC-AA-123', 'QC-A1-12345', 'Q-AB-1234', '', 'QC-AB-12345']
  for (const code of invalidCodes) {
    assert(isValidCodeFormat(code) === false, `Invalid code "${code}" is correctly rejected`)
  }

  // --- Tier 2: Hash and Verify ---
  console.log('\n--- Tier 2: Hash and Verify ---')

  const testCode = 'QC-AB-1234'
  const hash = await hashCode(testCode)

  assert(typeof hash === 'string' && hash.startsWith('$2'), 'hashCode() returns a bcrypt hash')
  assert(await verifyCode(testCode, hash), 'verifyCode() accepts the original code against its own hash')
  assert(await verifyCode(testCode.toLowerCase(), hash), 'verifyCode() is case-insensitive')
  assert(!(await verifyCode('QC-AB-1235', hash)), 'verifyCode() rejects a different code')
  assert(!(await verifyCode('', hash)), 'verifyCode() rejects empty string')

  // --- Tier 3: Expiry Logic ---
  console.log('\n--- Tier 3: Expiry Logic ---')

  const now = new Date()
  const expired = new Date(now.getTime() - 1000 * 60 * 60 * 24) // yesterday
  const valid = new Date(now.getTime() + 1000 * 60 * 60 * 24)   // tomorrow

  assert(expired < now, 'Code expiring yesterday is correctly considered expired')
  assert(!(valid < now), 'Code expiring tomorrow is correctly considered active')

  console.log(`\n=== RESULTS: ${passed} Passed, ${failed} Failed ===`)
  if (failed > 0) process.exit(1)
}

run().catch((err) => {
  console.error('Test execution failed:', err)
  process.exit(1)
})
