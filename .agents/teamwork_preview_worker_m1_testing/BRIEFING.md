# BRIEFING — 2026-06-17T00:32:00-03:00

## Mission
Design and implement a comprehensive security and mobile responsiveness test suite.

## 🔒 My Identity
- Archetype: implementer, qa, specialist
- Roles: implementer, qa, specialist
- Working directory: c:\Users\VITOR\Documents\Projetos\Questao_Certeira_Interativo\.agents\teamwork_preview_worker_m1_testing
- Original parent: bfd8f895-9089-4451-9eb7-c6093c90d0e1
- Milestone: Security and Mobile Responsiveness Validation

## 🔒 Key Constraints
- Network: CODE_ONLY mode (no internet/external web APIs).
- Verbatim Integrity warning must be included in TEST_INFRA.md and TEST_READY.md.
- Run tests without a running DB server if possible via direct route/handler calls and mocking.
- Store TEST_INFRA.md and TEST_READY.md inside the orchestrator folder `.agents/orchestrator`.
- Keep briefing under ~100 lines.

## Current Parent
- Conversation ID: bfd8f895-9089-4451-9eb7-c6093c90d0e1
- Updated: not yet

## Task Summary
- **What to build**: Comprehensive test suite in `scripts/test-session-signing.ts`, `scripts/test-rate-limiting.ts`, `scripts/test-session-expiration.ts`.
- **Success criteria**: Tests must compile, run, and pass. `TEST_INFRA.md` and `TEST_READY.md` created in `.agents/orchestrator`.
- **Interface contracts**: API routes in `src/app/api/auth/validate-code/route.ts` and helper functions in `src/lib/auth-lite/session.ts`.

## Key Decisions Made
- Use `tsx` to run the typescript test scripts.
- Use mock request/response objects to test functions programmatically.

## Artifact Index
- `scripts/test-session-signing.ts` — Tests session HMAC signing, forgery, and timing attack resistance.
- `scripts/test-rate-limiting.ts` — Tests 5 failed validate-code attempts, IP isolation, and success clearing.
- `scripts/test-session-expiration.ts` — Tests expired timestamps and database code status.
- `c:\Users\VITOR\Documents\Projetos\Questao_Certeira_Interativo\.agents\orchestrator\TEST_INFRA.md` — Test infrastructure documentation.
- `c:\Users\VITOR\Documents\Projetos\Questao_Certeira_Interativo\.agents\orchestrator\TEST_READY.md` — Test execution and summary dashboard.

## Change Tracker
- **Files modified**: none yet
- **Build status**: TBD
- **Pending issues**: none

## Quality Status
- **Build/test result**: TBD
- **Lint status**: TBD
- **Tests added/modified**: TBD

## Loaded Skills
- None
