# Project: Questao Certeira Interativo - Mobile & Security

## Architecture
- **Auth Lite**: `src/lib/auth-lite/session.ts` manages Base64 session encoding/decoding. We will add HMAC signing using `SESSION_SECRET`.
- **API Auth**: `src/app/api/auth/validate-code/route.ts` handles access code validation. We will implement in-memory rate limiting.
- **Components**:
  - `src/components/mission/MissionMap.tsx`: Needs to be legible on mobile.
  - `src/components/quiz/MultipleChoiceQuestion.tsx`: Touch target and layout adjustments for mobile.
  - `src/components/quiz/NumericQuestion.tsx`: Input field needs `inputMode="decimal"`.
  - `src/components/reports/StudentReport.tsx` / `src/app/revisao/[revisionSlug]/relatorio/page.tsx`: Layout responsive adjustments.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Test Track | Develop E2E and Unit Test Suite for security requirements and mobile layout indicators | None | IN_PROGRESS |
| 2 | Security Remediation | Session signature verification, IP rate limiter, session expiration check | 1 | IN_PROGRESS |
| 3 | Mobile Responsiveness | Mission Map visibility, touch targets, decimal inputmode, responsive reports | 1 | IN_PROGRESS |
| 4 | Integration & Audit | E2E test verification, lint checks, type check, and forensic audit | 2, 3 | PLANNED |

## Interface Contracts
### Session Management
- `getSession()`: Reads cookie `qci_session`. Decodes, verifies signature, verifies expiration. Returns `StudentSession | null`.
- `setSession(session)`: Signs session using HMAC-SHA256 and `SESSION_SECRET`, serializes, and sets `qci_session` cookie.

### Rate Limiting (In-Memory Map)
- Keys: Client IP (determined via headers)
- Values: `{ count: number, resetTime: number }`
- Limit: 5 attempts per 60 seconds (returns 429 upon breach).

## Code Layout
- Test Suite: `/scripts/test-validation-logic.ts` or similar, or a custom test file. We should check what tests exist in the project or if we should add new ones.
