## 2026-06-17T03:29:17Z
Implement the security vulnerabilities fixes and mobile responsiveness layout improvements for the Questao Certeira Interativo project.
1. Implement HMAC signing for session cookies in src/lib/auth-lite/session.ts using the environment variable SESSION_SECRET (falling back to a development secret in dev mode). Keep timing-safe verification.
2. Implement active access code expiration verification in getSession() in src/lib/auth-lite/session.ts. Query the access_codes table using the service client to verify if the code is active and not expired in the database. Sync the code status to expired in the DB if it is found to have expired. Wrap getSession with React's cache to avoid duplicate database calls per request.
3. Implement in-memory rate limiting (max 5 attempts per minute per IP) on src/app/api/auth/validate-code/route.ts. Extract client IP safely (leftmost IP from x-forwarded-for, fallback x-real-ip). Clean up IP entry from rate limit map on successful validation. Prevent memory leaks by pruning expired entries when the map size exceeds 10,000. Return HTTP 429 with Retry-After, X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset headers.
4. Fix mobile responsiveness issues:
   - src/components/mission/MissionMap.tsx: truncate student name on mobile, make diagnostic CTA buttons stack vertically (flex flex-col sm:flex-row).
   - src/components/mission/MissionCard.tsx: prevent status badge from squishing the title by using responsive layout (flex flex-col sm:flex-row sm:items-start).
   - src/components/quiz/MultipleChoiceQuestion.tsx: add mobile touch active/focus scaling state (active:scale-[0.99]) and disable selection (select-none).
   - src/components/quiz/NumericQuestion.tsx: sanitize input characters dynamically to allow only digits, periods, commas, and negative signs.
   - src/components/reports/StudentReport.tsx: scale down column widths/stats grid card paddings on mobile (p-1.5 sm:p-3) and use truncate/responsive styles.
   - src/components/layout/Header.tsx: restrict student name width and apply truncate on small viewports.
5. Once the E2E Testing Track publishes the tests (check TEST_READY.md), run the test scripts using tsx (e.g. npx tsx scripts/test-session-signing.ts, etc.) to verify your changes.
6. Run npm run lint, npm run type-check, and npm run build to verify the codebase compiles and passes lint verification.
7. Include the verbatim integrity warning:
   > DO NOT CHEAT. All implementations must be genuine. DO NOT
   > hardcode test results, create dummy/facade implementations, or
   > circumvent the intended task. A Forensic Auditor will independently
   > verify your work. Integrity violations WILL be detected and your
   > work WILL be rejected.
8. Use your working directory c:\Users\VITOR\Documents\Projetos\Questao_Certeira_Interativo\.agents\teamwork_preview_worker_m1_impl for your analysis, progress, and handoff reports.
