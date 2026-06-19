# Relatório de Execução — Limpeza + VIT-20/21/22

**Data:** 2026-06-19 (atualizado)  
**Agente:** Claude Sonnet 4.6  
**Branch:** `wip/agente-seguranca-supabase`  
**PR:** #1 — fix(security): VIT-20/21/22 — RLS, sessão assinada, rate limiting

---

## 1. Escopo

- Limpeza do repositório (branches, PRs)
- VIT-20: RLS/policies — restringir leitura pública de dados sensíveis (duas rodadas)
- VIT-21: Sessão/cookies assinados — aluno e professor (segunda rodada corrigiu professor)
- VIT-22: Rate limiting na validação de código (validado com script específico)

---

## 2. Estado Inicial (rodada 1)

- Branch: `wip/agente-seguranca-supabase` (mesmo commit que `master` e `origin/master`)
- Alterações não commitadas em 11 arquivos
- Nenhum PR aberto; 2 branches locais no mesmo commit
- `.env.local` corretamente ignorado pelo `.gitignore`

---

## 3. Limpeza do Repositório

**Resultado:** repositório já estava limpo.

- PRs analisados: 0 (sem PRs abertos)
- PRs mergeados: 0
- PRs fechados: 0
- Branches excluídas: 0
- Branches preservadas: `master`, `wip/agente-seguranca-supabase`

---

## 4. VIT-22 — Rate Limiting (validado)

**Status:** ✅ Implementado e testado.

### Módulo

`src/lib/auth-lite/rate-limit.ts` — criado para extrair helpers do route.ts.

Resolve erro de tipo do Next.js (route files não podem exportar funções que não sejam handlers HTTP).

### Comportamento

- 5 tentativas máximas por IP
- Bloqueio por 15 minutos após exceder limite
- Cabeçalho `Retry-After` na resposta 429
- Limpeza do record em sucesso
- Isolamento por IP
- Nenhum código bruto é logado
- Erro de código inválido não revela se o código existe

### Resultado do teste

```
npx tsx scripts/test-rate-limiting.ts
=== RESULTS: 13 Passed, 0 Failed ===
```

Cobertura:
- Test 1: Lockout após 5 tentativas → 429
- Test 2: Cabeçalho Retry-After presente
- Test 3: Isolamento por IP
- Test 4: Record limpo após sucesso

### Correções durante validação

1. Hash bcrypt de 'VALID-CODE' no mock de teste estava errado (fabricado). Substituído pelo hash real gerado localmente.
2. Mock de `access_codes` em `server.ts` não tinha `update()`. Adicionado `updateChain` para cobrir `supabase.from('access_codes').update(...).eq(...)`.
3. `setSession()` em `session.ts` chamava `cookies()` do Next.js fora de contexto de request. Adicionado guard `if (process.env.NODE_ENV === 'test') return` (padrão já existente em `server.ts`).

---

## 5. VIT-21 — Sessão Assinada

**Status:** ✅ Completo (aluno e professor).

### Aluno (`qci_session`) — implementado na rodada 1

`src/lib/auth-lite/session.ts`:
- `sign(payload, secret)`: HMAC-SHA256 via `crypto.createHmac`
- `verify(payload, signature, secret)`: comparação via `timingSafeEqual`
- `serializeSession(session, secret)`: `base64(JSON).HMAC`
- `deserializeSession(cookieValue, secret)`: verifica assinatura antes de parsear
- Cookie `qci_session` com `httpOnly: true`, `secure: true` em produção, `sameSite: 'lax'`
- Rejeita cookies expirados, adulterados ou com assinatura inválida

### Professor (`qci_professor`) — CORRIGIDO na rodada 2

**Problema identificado:** `api/professor/auth/route.ts` setava `qci_professor = 'authenticated'` (literal). `professor/page.tsx` comparava `teacherSession !== 'authenticated'` (literal). Cookie adulterado passaria a verificação simplesmente contendo a string.

**Correção:**

`src/lib/auth-lite/professor-session.ts` — criado:
- `buildProfessorPayload()`: cria `{ role, issuedAt, expiresAt }` com validade de 8h
- `serializeProfessorSession(payload, secret)`: `base64(JSON).HMAC`
- `deserializeProfessorSession(cookieValue, secret)`: verifica assinatura, role e expiração

`src/app/api/professor/auth/route.ts` — atualizado:
- Usa `serializeProfessorSession()` em vez de literal `'authenticated'`

`src/app/professor/page.tsx` — atualizado:
- Usa `deserializeProfessorSession()` em vez de `teacherSession !== 'authenticated'`

### Resultado do teste de sessão

```
npx tsx scripts/test-session-signing.ts
=== RESULTS: 19 Passed, 0 Failed ===
```

Cobertura nova (Tier 5):
- Cookie professor válido é aceito
- Cookie com assinatura forjada é rejeitado
- Cookie assinado com secret errado é rejeitado
- Cookie expirado é rejeitado
- Valor literal `"authenticated"` é rejeitado

---

## 6. VIT-20 — RLS/Policies

**Status:** ✅ Completo (duas migrações incrementais).

### O que a rodada 1 cobriu (migration 002)

Removeu policies anon que expunham dados de alunos:
- `mission_progress` — progresso de todos os alunos estava acessível via anon key
- `revision_progress` — idem
- `attempts` — tentativas de todos os alunos expostas

### O que faltava (identificado na rodada 2)

`SECURITY.md` declara: "Questões, opções e feedbacks só são retornados após validação de sessão."

Mas as policies da migration 001 tinham:
```sql
CREATE POLICY "Public read questions" ON questions FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read question_options" ON question_options FOR SELECT TO anon USING (TRUE);
```

Isso contradiz a política documentada: `question_options` contém `is_correct`, `feedback` e `error_category`.

### Migration 003 (criada nesta rodada)

`supabase/migrations/003_rls_restrict_questions.sql`:
```sql
DROP POLICY IF EXISTS "Public read questions" ON questions;
DROP POLICY IF EXISTS "Public read question_options" ON question_options;
```

### Decisão sobre content_blocks e missions

**Mantidos como anon-readable** (decisão de MVP documentada):
- `content_blocks`: conteúdo pedagógico textual sem respostas ou dados de avaliação
- `missions`: metadados de missão (título, slug, ordem) — nenhum dado sensível

Justificativa registrada no comentário da migration 003 e em SECURITY.md.

### Pages migradas para createServiceClient()

Todas as pages que acessam dados protegidos agora usam `createServiceClient()` após verificar sessão:

| Arquivo | Antes | Agora |
|---|---|---|
| `revisao/[revisionSlug]/page.tsx` | `createClient()` | `createServiceClient()` |
| `revisao/[revisionSlug]/relatorio/page.tsx` | `createClient()` | `createServiceClient()` |
| `revisao/[revisionSlug]/missao/[missionSlug]/page.tsx` | `createClient()` | `createServiceClient()` |
| `revisao/[revisionSlug]/diagnostico/page.tsx` | `createClient()` | `createServiceClient()` |
| `revisao/[revisionSlug]/simulado/page.tsx` | `createClient()` | `createServiceClient()` |

Pages que continuam com `createClient()` (dados realmente públicos):
- `acessar/[revisionSlug]/page.tsx` — só lê `revisions` com status=active

### Bug fix descoberto (rodada 1)

`validate-code/route.ts`: `student.displayName` (undefined) → `student.display_name` (coluna real do banco).

---

## 7. Arquivos Alterados

| Arquivo | Tipo |
|---|---|
| `supabase/migrations/002_rls_restrict_student_data.sql` | Criado (rodada 1) |
| `supabase/migrations/003_rls_restrict_questions.sql` | Criado (rodada 2) |
| `src/lib/auth-lite/rate-limit.ts` | Criado |
| `src/lib/auth-lite/professor-session.ts` | Criado |
| `src/lib/auth-lite/session.ts` | Modificado (guard teste + signing) |
| `src/lib/supabase/server.ts` | Modificado (tipos + mock atualizado) |
| `src/app/api/auth/validate-code/route.ts` | Refatorado + bug fix |
| `src/app/api/professor/auth/route.ts` | Corrigido (assinatura professor) |
| `src/app/professor/page.tsx` | Corrigido (verificação assinatura) |
| `src/app/revisao/[revisionSlug]/page.tsx` | createServiceClient() |
| `src/app/revisao/[revisionSlug]/relatorio/page.tsx` | createServiceClient() |
| `src/app/revisao/[revisionSlug]/missao/[missionSlug]/page.tsx` | createServiceClient() |
| `src/app/revisao/[revisionSlug]/diagnostico/page.tsx` | createServiceClient() |
| `src/app/revisao/[revisionSlug]/simulado/page.tsx` | createServiceClient() |
| `scripts/test-session-signing.ts` | Tier 5 adicionado (professor) |
| `scripts/test-rate-limiting.ts` | Import atualizado + NODE_ENV fix |
| `SECURITY.md` | Atualizado para refletir política real |

---

## 8. Testes Executados

| Teste | Resultado |
|---|---|
| `npm run lint` | ✅ PASSOU (1 warning não-bloqueante) |
| `npm run type-check` | ✅ PASSOU |
| `npm run build` | ✅ PASSOU |
| `npx tsx scripts/test-session-signing.ts` | ✅ 19/19 PASSOU |
| `npx tsx scripts/test-rate-limiting.ts` | ✅ 13/13 PASSOU |

---

## 9. Migration no Supabase DEV

**Status:** ⏳ PENDENTE — aplicar manualmente.

CLI Supabase não está vinculado ao projeto (sem `SUPABASE_ACCESS_TOKEN` e sem `supabase/config.toml`). Não foi possível aplicar via `supabase db push`.

**SQL a executar no Supabase Dashboard (SQL Editor):**

**Migration 002 — dados de alunos:**
```sql
DROP POLICY IF EXISTS "Public read mission_progress" ON mission_progress;
DROP POLICY IF EXISTS "Public read revision_progress" ON revision_progress;
DROP POLICY IF EXISTS "Public read attempts" ON attempts;
```

**Migration 003 — questões:**
```sql
DROP POLICY IF EXISTS "Public read questions" ON questions;
DROP POLICY IF EXISTS "Public read question_options" ON question_options;
```

---

## 10. Issues Linear Cobertas

| Issue | Status |
|---|---|
| VIT-20 — RLS/policies | ✅ Completo (migrations 002 + 003) |
| VIT-21 — Sessão/cookies assinados | ✅ Completo (aluno + professor) |
| VIT-22 — Rate limiting validação | ✅ Completo + testado (13/13) |

---

## 11. Pendências Humanas

1. **Aplicar migrations no Supabase:** Executar SQL das migrations 002 e 003 no painel do Supabase (SQL Editor > seção §9 deste relatório).

2. **Confirmar SESSION_SECRET em produção:** Variável `SESSION_SECRET` deve ter ≥32 chars aleatórios. Sem ela, o fallback `'dev-secret-default-key-for-development'` é usado — inaceitável em produção.

3. **Vincular CLI Supabase:** Para próximas rodadas, executar `supabase login` e `supabase link --project-ref vejvgrwdgyknazouviww` para permitir `supabase db push`.

4. **Decidir sobre `.agents/`:** Diretório não rastreado. Adicionar ao `.gitignore` ou commitar com propósito definido.

5. **Revisar PR #1 antes do merge:** Confirmar que migration foi aplicada, testar fluxo do professor manualmente.

---

## 12. Confirmações de Segurança

- ✅ `.env.local` não foi commitado
- ✅ Nenhum secret foi impresso ou versionado
- ✅ Nenhum dado real de aluno foi usado
- ✅ Nenhum código real de acesso foi versionado
- ✅ Nenhum serviço pago foi adicionado
- ✅ Nenhum deploy foi feito
- ✅ Nenhum force push foi feito
- ✅ Nenhum merge foi feito
- ✅ IA não foi adicionada ao runtime do app
