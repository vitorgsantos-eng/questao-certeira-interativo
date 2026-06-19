import fs from 'fs'
import path from 'path'
import {
  serializeSession,
  deserializeSession,
  timingSafeEqualStrings,
} from '../src/lib/auth-lite/session'
import {
  buildProfessorPayload,
  serializeProfessorSession,
  deserializeProfessorSession,
} from '../src/lib/auth-lite/professor-session'
import type { StudentSession } from '../src/types'

// Set a mock session secret for testing
process.env.SESSION_SECRET = 'super-secret-key-for-testing-purposes-32-chars'

async function runSessionSigningTests() {
  console.log('=== RUNNING SESSION HMAC SIGNING & MOBILE RESPONSIVENESS TESTS ===\n')

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

  // 1. Session Serialisation & Verification
  console.log('--- Tier 1: Session Signing and Verification ---')
  const mockSession: StudentSession = {
    studentId: 'stud-123',
    revisionId: 'rev-456',
    revisionSlug: 'revisao-triangulos',
    displayName: 'Carlos Silva',
    grade: '9º Ano',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour in the future
  }

  const secret = process.env.SESSION_SECRET!
  const cookieValue = serializeSession(mockSession, secret)

  assert(
    cookieValue.includes('.'),
    'Serialized cookie value contains signature separator'
  )

  const decoded = deserializeSession(cookieValue, secret)
  assert(decoded !== null, 'Valid signed cookie is parsed successfully')
  assert(
    decoded?.studentId === mockSession.studentId,
    'Decoded session preserves student id'
  )

  // 2. Forgery Rejection
  console.log('\n--- Tier 2: Forgery Rejection ---')
  const parts = cookieValue.split('.')
  const payload = parts[0]
  const signature = parts[1]

  // Scenario A: Forged Signature
  const forgedCookie = `${payload}.forgedsignature12345`
  const resultForged = deserializeSession(forgedCookie, secret)
  assert(resultForged === null, 'Forged signature is successfully rejected')

  // Scenario B: Modified payload with valid signature of another payload
  const modifiedSession = { ...mockSession, studentId: 'stud-666' }
  const modifiedPayload = Buffer.from(JSON.stringify(modifiedSession)).toString('base64')
  const modifiedCookie = `${modifiedPayload}.${signature}`
  const resultModified = deserializeSession(modifiedCookie, secret)
  assert(
    resultModified === null,
    'Modified payload with mismatched signature is rejected'
  )

  // Scenario C: Session signed with a different secret
  const wrongSecret = 'another-completely-different-secret-key-32-chars'
  const wrongSecretCookie = serializeSession(mockSession, wrongSecret)
  const resultWrongSecret = deserializeSession(wrongSecretCookie, secret)
  assert(
    resultWrongSecret === null,
    'Cookie signed with different secret is rejected'
  )

  // 3. Timing Attack Resilience
  console.log('\n--- Tier 3: Timing Attack Resilience ---')
  // We compare different length strings to make sure timingSafeEqualStrings returns false safely
  const matchEqual = timingSafeEqualStrings('signature-abc-123', 'signature-abc-123')
  assert(matchEqual === true, 'timingSafeEqualStrings returns true for identical strings')

  const matchDifferentLength = timingSafeEqualStrings('signature-abc-123', 'short')
  assert(
    matchDifferentLength === false,
    'timingSafeEqualStrings returns false for different length strings'
  )

  const matchSameLengthDiffChar = timingSafeEqualStrings(
    'signature-abc-123',
    'signature-abc-124'
  )
  assert(
    matchSameLengthDiffChar === false,
    'timingSafeEqualStrings returns false for same length but different characters'
  )

  // 4. Mobile Responsiveness Invariants
  console.log('\n--- Tier 4: Mobile Responsiveness Invariants (Static Analysis) ---')

  // Invariant A: inputMode="decimal" on NumericQuestion inputs
  const numericQuestionPath = path.resolve(
    __dirname,
    '../src/components/quiz/NumericQuestion.tsx'
  )
  if (fs.existsSync(numericQuestionPath)) {
    const content = fs.readFileSync(numericQuestionPath, 'utf8')
    assert(
      content.includes('inputMode="decimal"'),
      'NumericQuestion.tsx contains inputMode="decimal" for mobile numeric keyboard'
    )
  } else {
    console.error(`[WARN] NumericQuestion.tsx not found at ${numericQuestionPath}`)
    failed++
  }

  // Invariant B: visual layout flex-col/sm:flex-row attributes in components
  // Let's inspect components for responsive flex container classes
  const componentsDir = path.resolve(__dirname, '../src/components')
  let foundFlexColSmFlexRow = false

  function scanDir(dir: string) {
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const fullPath = path.join(dir, file)
      if (fs.statSync(fullPath).isDirectory()) {
        scanDir(fullPath)
      } else if (file.endsWith('.tsx')) {
        const content = fs.readFileSync(fullPath, 'utf8')
        if (
          content.includes('flex-col') &&
          (content.includes('sm:flex-row') || content.includes('md:flex-row'))
        ) {
          foundFlexColSmFlexRow = true
          console.log(`Found responsive flex layout in: ${path.relative(componentsDir, fullPath)}`)
        }
      }
    }
  }

  scanDir(componentsDir)
  assert(
    foundFlexColSmFlexRow,
    'Visual layouts feature responsive flex-col and sm/md:flex-row attributes'
  )

  // Invariant C: truncations on session display names (Header.tsx)
  const headerPath = path.resolve(__dirname, '../src/components/layout/Header.tsx')
  if (fs.existsSync(headerPath)) {
    const content = fs.readFileSync(headerPath, 'utf8')
    assert(
      content.includes('truncate') && content.includes('max-w-['),
      'Header.tsx truncates student display name on mobile screen sizes'
    )
  } else {
    console.error(`[WARN] Header.tsx not found at ${headerPath}`)
    failed++
  }

  // 5. Professor Session Signing
  console.log('\n--- Tier 5: Professor Session Signing ---')
  const professorSecret = process.env.SESSION_SECRET!

  const professorPayload = buildProfessorPayload()
  const professorCookie = serializeProfessorSession(professorPayload, professorSecret)

  assert(
    professorCookie.includes('.'),
    'Professor cookie contains signature separator'
  )

  const decodedProfessor = deserializeProfessorSession(professorCookie, professorSecret)
  assert(decodedProfessor !== null, 'Valid signed professor cookie is accepted')
  assert(decodedProfessor?.role === 'professor', 'Professor cookie has correct role')

  // Forgery: wrong signature
  const [profPayload] = professorCookie.split('.')
  const forgedProfCookie = `${profPayload}.forgedsignature99999`
  assert(
    deserializeProfessorSession(forgedProfCookie, professorSecret) === null,
    'Forged professor cookie signature is rejected'
  )

  // Forgery: different secret
  const wrongSecretProfCookie = serializeProfessorSession(professorPayload, 'wrong-secret-different-from-real')
  assert(
    deserializeProfessorSession(wrongSecretProfCookie, professorSecret) === null,
    'Professor cookie signed with wrong secret is rejected'
  )

  // Expired professor cookie
  const expiredPayload = {
    role: 'professor' as const,
    issuedAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
    expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
  }
  const expiredProfCookie = serializeProfessorSession(expiredPayload, professorSecret)
  assert(
    deserializeProfessorSession(expiredProfCookie, professorSecret) === null,
    'Expired professor cookie is rejected'
  )

  // Literal "authenticated" must NOT be accepted
  assert(
    deserializeProfessorSession('authenticated', professorSecret) === null,
    'Legacy literal "authenticated" value is rejected'
  )

  console.log(`\n=== RESULTS: ${passed} Passed, ${failed} Failed ===`)
  if (failed > 0) {
    process.exit(1)
  } else {
    process.exit(0)
  }
}

runSessionSigningTests().catch((err) => {
  console.error('Test execution failed:', err)
  process.exit(1)
})
