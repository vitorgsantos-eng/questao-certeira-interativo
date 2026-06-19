# Relatório de Execução — VIT-20/21/22

**Data:** 2026-06-19 (rodada 4 — lockfile consistency)  
**Agente:** Claude Sonnet 4.6  
**Branch:** `wip/agente-seguranca-supabase`  
**PR:** [#1 — fix(security): VIT-20/21/22](https://github.com/vitorgsantos-eng/questao-certeira-interativo/pull/1)

---

## 1. Escopo do PR

| Issue | Descrição | Status |
|---|---|---|
| VIT-20 | RLS/policies — restringir dados sensíveis via Supabase | ✅ Completo |
| VIT-21 | Sessão/cookies assinados — aluno e professor | ✅ Completo |
| VIT-22 | Rate limiting na validação de código | ✅ Completo |

---

## 2. Lockfile Consistency (rodada 4)

### Problema

`package.json` estava com `@supabase/ssr ^0.5.2` e `@supabase/supabase-js ^2.108.2` enquanto `package-lock.json` mantinha `^0.5.1` e `^2.45.4`. O bump foi adicionado em rodada anterior mas o lock não foi regenerado, deixando os dois arquivos divergentes — `npm ci` falharia em CI.

### Decisão

O bump **não é necessário** para VIT-20/21/22: toda a lógica de segurança usa `crypto` nativo (Node.js) e `bcryptjs`. Revertido `package.json` para as versões do lockfile (`^0.5.1` / `^2.45.4`).

### Validação

- `npm ci` executado sem erros
- `npm run lint` ✅, `npm run type-check` ✅, `npm run build` ✅
- `test-session-signing.ts` **20/20** ✅
- `test-rate-limiting.ts` **13/13** ✅

---

## 4. Limpeza de Escopo (rodada 3)

### Alterações UI removidas do PR de segurança

O commit `feat(ui): mobile responsiveness and component improvements` continha mudanças sem relação com VIT-20/21/22:
- `src/components/layout/Header.tsx`
- `src/components/mission/MissionCard.tsx`
- `src/components/mission/MissionMap.tsx`
- `src/components/quiz/MultipleChoiceQuestion.tsx`
- `src/components/quiz/NumericQuestion.tsx`
- `src/components/reports/StudentReport.tsx`

**Ação:** revertido via `git revert 0fbd4ba` (sem force push). Trabalho preservado em `wip/preserved-ui-mobile-polish`.

**Bumps de dependência** (`@supabase/ssr ^0.5.2`, `@supabase/supabase-js ^2.108.2`) que estavam no mesmo commit foram re-adicionados separadamente — são relevantes para o PR de segurança.

### Testes de UI removidos de `test-session-signing.ts`

Tier 4 (Mobile Responsiveness Invariants) foi removido do script de sessão — verificações de `inputMode="decimal"`, `flex-col sm:flex-row` e truncamento do Header não pertencem ao escopo de segurança.

Script agora foca apenas em assinatura de sessão (aluno e professor).

---

## 5. VIT-21 — Sessão Assinada

### Aluno (`qci_session`)

`src/lib/auth-lite/session.ts`:
- `sign()`: HMAC-SHA256 via `crypto.createHmac`
- `verify()`: comparação via `timingSafeEqual` (resistente a timing attacks)
- `serializeSession()`: `base64(JSON).HMAC`
- `deserializeSession()`: verifica assinatura antes de parsear; rejeita expirados
- Cookie `qci_session` com `httpOnly`, `secure` em produção, `sameSite: lax`

### Professor (`qci_professor`)

`src/lib/auth-lite/professor-session.ts`:
- Payload: `{ role: 'professor', issuedAt, expiresAt }` com validade de 8h
- `serializeProfessorSession()`: `base64(JSON).HMAC`
- `deserializeProfessorSession()`: verifica assinatura, role e expiração
- Cookie adulterado, expirado ou com literal `"authenticated"` é rejeitado

`src/app/api/professor/auth/route.ts` — usa `serializeProfessorSession()`  
`src/app/professor/page.tsx` — usa `deserializeProfessorSession()`

### SESSION_SECRET endurecido (rodada 3)

`getSecret()` em `session.ts` foi endurecido:
- **Produção:** exige `SESSION_SECRET` definida e com ≥32 caracteres. Caso contrário, lança erro controlado imediatamente. Nenhum fallback em produção.
- **Dev/test:** usa secret fornecida (se ≥32 chars) ou fallback documentado como DEV-only.
- Nunca imprime o valor do secret.

```ts
// produção sem SESSION_SECRET → throw Error
// produção com secret < 32 chars → throw Error
// dev/test → fallback seguro
```

---

## 6. VIT-20 — RLS/Policies

### O que está protegido (anon key sem acesso)

| Tabela | Antes | Depois |
|---|---|---|
| `students` | sem policy anon | sem policy anon |
| `access_codes` | sem policy anon | sem policy anon |
| `attempts` | `USING (TRUE)` | ❌ removida |
| `mission_progress` | `USING (TRUE)` | ❌ removida |
| `revision_progress` | `USING (TRUE)` | ❌ removida |
| `questions` | `USING (TRUE)` | ❌ removida |
| `question_options` | `USING (TRUE)` | ❌ removida |

### O que permanece acessível via anon (decisão de MVP)

| Tabela | Justificativa |
|---|---|
| `revisions` | `USING (status = 'active')` — necessário para página `/acessar/` sem sessão |
| `missions` | conteúdo pedagógico público (títulos, slugs, ordem) — sem dados de avaliação |
| `content_blocks` | texto pedagógico — sem respostas, feedbacks ou dados de alunos |

### Migrations (idempotentes)

**`supabase/migrations/002_rls_restrict_student_data.sql`**
```sql
DROP POLICY IF EXISTS "Public read mission_progress" ON mission_progress;
DROP POLICY IF EXISTS "Public read revision_progress" ON revision_progress;
DROP POLICY IF EXISTS "Public read attempts" ON attempts;
```

**`supabase/migrations/003_rls_restrict_questions.sql`**
```sql
DROP POLICY IF EXISTS "Public read questions" ON questions;
DROP POLICY IF EXISTS "Public read question_options" ON question_options;
```

### Pages migradas para `createServiceClient()`

Todas as pages que acessam dados protegidos verificam sessão antes de qualquer query:

| Arquivo | Dados acessados |
|---|---|
| `revisao/[revisionSlug]/page.tsx` | missions, mission_progress, attempts |
| `revisao/[revisionSlug]/relatorio/page.tsx` | missions, mission_progress, attempts |
| `revisao/[revisionSlug]/missao/[missionSlug]/page.tsx` | missions, content_blocks, **questions**, **question_options** |
| `revisao/[revisionSlug]/diagnostico/page.tsx` | missions, **questions**, **question_options** |
| `revisao/[revisionSlug]/simulado/page.tsx` | missions, **questions**, **question_options** |

Negrito = tabelas que agora exigem service_role (policy anon removida).

Page que permanece com `createClient()`: `acessar/[revisionSlug]/page.tsx` — lê apenas `revisions` (policy anon mantida para status=active).

---

## 7. VIT-22 — Rate Limiting

`src/lib/auth-lite/rate-limit.ts` — módulo extraído do route.ts:
- 5 tentativas máximas por IP
- Bloqueio de 15 minutos após exceder limite
- Cabeçalho `Retry-After` na resposta 429
- Record limpo em sucesso (login bem-sucedido)
- Isolamento por IP
- Nenhum código bruto logado
- Erro não revela se código existe

---

## 8. Testes

| Teste | Resultado (rodada 4) |
|---|---|
| `npm ci` | ✅ PASSOU (lock + manifesto consistentes) |
| `npm run lint` | ✅ PASSOU (1 warning não-bloqueante) |
| `npm run type-check` | ✅ PASSOU |
| `npm run build` | ✅ PASSOU |
| `npx tsx scripts/test-session-signing.ts` | ✅ **20/20** |
| `npx tsx scripts/test-rate-limiting.ts` | ✅ **13/13** |

### Cobertura de `test-session-signing.ts`

- Tier 0: `SESSION_SECRET` em produção (ausente → throw, curto → throw, válido → OK)
- Tier 1: serialização e verificação de sessão de aluno
- Tier 2: rejeição de cookie forjado (assinatura errada, payload modificado, secret errado)
- Tier 3: resistência a timing attacks
- Tier 4: sessão de professor (válida, forjada, secret errado, expirada, literal rejeitado)

### Cobertura de `test-rate-limiting.ts`

- Test 1: lockout após 5 tentativas (→ 429)
- Test 2: cabeçalho `Retry-After` presente
- Test 3: isolamento por IP (IP B não bloqueado quando IP A está)
- Test 4: record limpo após sucesso

---

## 9. Arquivos no PR de Segurança

| Arquivo | Mudança |
|---|---|
| `supabase/migrations/002_rls_restrict_student_data.sql` | Criado |
| `supabase/migrations/003_rls_restrict_questions.sql` | Criado |
| `src/lib/auth-lite/rate-limit.ts` | Criado |
| `src/lib/auth-lite/professor-session.ts` | Criado |
| `src/lib/auth-lite/session.ts` | getSecret() endurecido + signing + guard teste |
| `src/lib/supabase/server.ts` | Tipos explícitos + mock atualizado |
| `src/app/api/auth/validate-code/route.ts` | Importa rate-limit; bug fix display_name |
| `src/app/api/professor/auth/route.ts` | Cookie professor assinado |
| `src/app/professor/page.tsx` | Verifica assinatura do professor |
| `src/app/revisao/[revisionSlug]/page.tsx` | `createServiceClient()` |
| `src/app/revisao/[revisionSlug]/relatorio/page.tsx` | `createServiceClient()` |
| `src/app/revisao/[revisionSlug]/missao/[missionSlug]/page.tsx` | `createServiceClient()` |
| `src/app/revisao/[revisionSlug]/diagnostico/page.tsx` | `createServiceClient()` |
| `src/app/revisao/[revisionSlug]/simulado/page.tsx` | `createServiceClient()` |
| `SECURITY.md` | Atualizado |
| `scripts/test-session-signing.ts` | Tier 0 + 4 adicionados, Tier UI removido |
| `scripts/test-rate-limiting.ts` | Import atualizado, NODE_ENV fix |
| `package.json` | Revertido para `^0.5.1` / `^2.45.4` (consistente com lock) |
| `docs/agent-reports/...` | Relatório |

**Fora do PR (preservados em `wip/preserved-ui-mobile-polish`):**
- `src/components/layout/Header.tsx`
- `src/components/mission/MissionCard.tsx`
- `src/components/mission/MissionMap.tsx`
- `src/components/quiz/MultipleChoiceQuestion.tsx`
- `src/components/quiz/NumericQuestion.tsx`
- `src/components/reports/StudentReport.tsx`

---

## 10. Status das Migrations no Supabase

**CLI Supabase:** não configurado nesta rodada (sem `supabase/config.toml`, sem `SUPABASE_ACCESS_TOKEN`). Esta ausência **não bloqueia o PR** — configuração do CLI é melhoria operacional futura.

**Caminho aceito para MVP/DEV:** aplicação manual via Supabase Dashboard > SQL Editor.

**SQL para executar (copiar e colar no SQL Editor):**

```sql
-- Migration 002
DROP POLICY IF EXISTS "Public read mission_progress" ON mission_progress;
DROP POLICY IF EXISTS "Public read revision_progress" ON revision_progress;
DROP POLICY IF EXISTS "Public read attempts" ON attempts;

-- Migration 003
DROP POLICY IF EXISTS "Public read questions" ON questions;
DROP POLICY IF EXISTS "Public read question_options" ON question_options;
```

Ambas as migrations são **idempotentes** (`DROP POLICY IF EXISTS`): podem ser executadas mais de uma vez sem erro.

---

## 11. Pendências Humanas

1. **Aplicar migrations no Supabase Dashboard > SQL Editor** (ver §8)
2. **Confirmar `SESSION_SECRET` em produção** com ≥32 caracteres aleatórios — sem isso, o app lança erro ao iniciar em produção (comportamento intencional)
3. **Revisar PR #1 e fazer merge** após:
   - migrations aplicadas,
   - fluxo do professor testado manualmente,
   - `SESSION_SECRET` configurado em produção
4. **Branch `wip/preserved-ui-mobile-polish`** aguarda PR separado para as melhorias de UI/mobile
5. **Diretório `.agents/`** não rastreado — adicionar ao `.gitignore` ou commitar

---

## 12. Confirmações de Segurança

- ✅ `.env.local` não foi commitado
- ✅ Nenhum secret foi impresso ou versionado
- ✅ Nenhum dado real de aluno foi usado
- ✅ Nenhum código real de acesso foi versionado
- ✅ Nenhum serviço pago foi adicionado
- ✅ Nenhuma IA foi adicionada ao runtime do app
- ✅ Nenhum deploy foi feito
- ✅ Nenhum merge foi feito
- ✅ Nenhum force push foi feito
- ✅ Supabase CLI não foi configurado (decisão operacional, não bloqueio)
