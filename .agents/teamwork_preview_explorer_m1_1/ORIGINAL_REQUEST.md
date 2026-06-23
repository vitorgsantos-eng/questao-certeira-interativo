## 2026-06-17T03:22:32Z
Analyze the codebase and recommend a concrete strategy to implement:
1. R1: Session HMAC cryptographic signing in `src/lib/auth-lite/session.ts` using the environment variable `SESSION_SECRET` (or a JWT/HMAC token layout). Ensure that sessions encoded in base64 cannot be forged on the client side.
2. R3: Strict verification of session expiration in `src/lib/auth-lite/session.ts` (or getSession) so that it actively checks if the access code has expired or if the session timestamp is in the past, blocking access to content.
Review `src/lib/auth-lite/session.ts` and pages using it. Provide a detailed report of recommended code changes in your handoff. Do NOT modify any code files yourself; you are read-only.
Write your analysis and handoff files under c:\Users\VITOR\Documents\Projetos\Questao_Certeira_Interativo\.agents\teamwork_preview_explorer_m1_1.
