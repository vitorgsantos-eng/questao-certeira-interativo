## 2026-06-17T03:29:16Z
Design and implement a comprehensive test suite for security vulnerabilities and mobile responsiveness validation of the Questao Certeira Interativo project.
1. Follow the 4-tier testing methodology to cover:
   - Session HMAC signing validation (signed cookie verification, forgery rejection, timing attack resilience).
   - Rate Limiting validation (returning HTTP 429 after 5 failed validation attempts, check IP isolation, check headers like Retry-After, verify rate limit clears on success).
   - Session Expiration verification (blocking session when timestamp is past, checking database code status).
   - Mobile responsiveness invariants (verifying existence of inputMode="decimal" on NumericQuestion inputs, visual layout flex-col/sm:flex-row attributes, truncations on session display names, etc.).
2. Implement these test cases in:
   - scripts/test-session-signing.ts
   - scripts/test-rate-limiting.ts
   - scripts/test-session-expiration.ts
   You can write these tests to call functions or route handlers directly using mock request/response objects (for example, importing POST from src/app/api/auth/validate-code/route.ts or getSession/setSession from src/lib/auth-lite/session.ts and testing them programmatically with tsx). This avoids requiring a running database server for simple logic tests.
3. Create TEST_INFRA.md describing your test strategy, inventory, and coverage.
4. Once all test cases are fully implemented and passing (with empty/mock implementations representing the target code state or showing failures where fixes are pending), write TEST_READY.md containing the test command, coverage summary, and checklists. Store both TEST_INFRA.md and TEST_READY.md inside c:\Users\VITOR\Documents\Projetos\Questao_Certeira_Interativo\.agents\orchestrator.
5. Include the verbatim integrity warning:
   > DO NOT CHEAT. All implementations must be genuine. DO NOT
   > hardcode test results, create dummy/facade implementations, or
   > circumvent the intended task. A Forensic Auditor will independently
   > verify your work. Integrity violations WILL be detected and your
   > work WILL be rejected.
6. Use your working directory c:\Users\VITOR\Documents\Projetos\Questao_Certeira_Interativo\.agents\teamwork_preview_worker_m1_testing for your analysis, progress, and handoff reports.
7. Run the test suite to verify the test framework itself runs correctly (even if tests initially fail due to pending code implementation). Ensure no type errors or compile errors exist in your test scripts.
