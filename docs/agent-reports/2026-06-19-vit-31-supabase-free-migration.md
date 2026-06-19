# VIT-31 — Supabase Free e Migration Inicial

**Data:** 2026-06-19
**Branch:** master (tarefa operacional — sem alteração de código de produto)
**Responsável:** agente

---

## 1. Objetivo

Verificar e preparar o ambiente Supabase Free remoto para receber a revisão piloto (VIT-32) e, mais tarde, códigos de acesso controlados.

---

## 2. O que foi inspecionado

### 2.1 Migrations em repositório

| Arquivo | Propósito | Estado |
|---------|-----------|--------|
| `supabase/migrations/001_initial_schema.sql` | Schema completo: 10 tabelas + RLS base + policies | Presente ✓ |
| `supabase/migrations/002_rls_restrict_student_data.sql` | Remove policies anon de `mission_progress`, `revision_progress`, `attempts` | Presente ✓ |
| `supabase/migrations/003_rls_restrict_questions.sql` | Remove policies anon de `questions` e `question_options` | Presente ✓ |
| `supabase/migrations/004_add_diagram_block_type.sql` | Adiciona `'diagram'` ao CHECK constraint de `content_blocks.type` | **Criado nesta VIT** |

### 2.2 Coerência do schema

- 10 tabelas definidas: `students`, `revisions`, `access_codes`, `missions`, `content_blocks`, `questions`, `question_options`, `attempts`, `mission_progress`, `revision_progress`
- RLS habilitado em todas as tabelas na migration 001
- Políticas `service_role` (acesso total) em todas as tabelas ✓
- Políticas `anon` para leitura de conteúdo pedagógico público (`revisions` ativas, `missions`, `content_blocks`) ✓
- Dados sensíveis de avaliação e alunos sem acesso anon (migrations 002/003) ✓

### 2.3 Problema identificado: constraint faltante para `diagram`

A VIT-51 adicionou o tipo de bloco `diagram` em `src/types/index.ts` e `scripts/validate-content.ts`, mas a migration 001 tem:

```sql
type TEXT NOT NULL CHECK (type IN (
  'intro', 'concept', 'visual_explanation', 'worked_example', 'hint', 'summary'
))
```

Sem `'diagram'`, qualquer tentativa de `import-revision` com blocos `diagram` falha com erro `23514` (constraint violation). A migration 004 foi criada para corrigir isso.

### 2.4 Variáveis de ambiente (.env.local)

- `.env.local` presente ✓
- `.env.local` em `.gitignore` ✓ (verificado via `git check-ignore`)
- Chaves configuradas (sem expor valores):
  - `NEXT_PUBLIC_SUPABASE_URL` — presente ✓
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — presente (equivalente ao ANON_KEY; código em `server.ts` já trata ambos os nomes) ✓
  - `SUPABASE_SERVICE_ROLE_KEY` — presente ✓
  - `PROFESSOR_ACCESS_CODE` — presente ✓
  - `SESSION_SECRET` — presente ✓

Nenhum valor sensível foi impresso, registrado ou transmitido.

### 2.5 Scripts relevantes

| Script | Função | Dependência de DB |
|--------|--------|-------------------|
| `scripts/import-revision.ts` | Importa JSON de revisão via service role | Sim — VIT-32 |
| `scripts/generate-access-codes.ts` | Gera codes com bcrypt, insere hash no DB | Sim — pós VIT-32 |
| `scripts/check-db-tables.ts` | Verifica existência das 10 tabelas e contagem | Sim — disponível agora |

---

## 3. Estado do banco remoto

Executado `npx tsx scripts/check-db-tables.ts` — conecta via service role, não expõe dados sensíveis:

| Tabela | Resultado |
|--------|-----------|
| students | ✓ Existe |
| revisions | ✓ Existe |
| access_codes | ✓ Existe |
| missions | ✓ Existe |
| content_blocks | ✓ Existe |
| questions | ✓ Existe |
| question_options | ✓ Existe |
| attempts | ✓ Existe |
| mission_progress | ✓ Existe |
| revision_progress | ✓ Existe |

**Conclusão:** Migrations 001–003 já foram aplicadas no projeto Supabase Free. Todas as 10 tabelas respondem corretamente via service role.

---

## 4. Migration 004 — ação necessária pelo proprietário

A migration 004 está pronta no repositório mas ainda **não foi aplicada ao banco remoto** (o banco foi criado antes da VIT-51). O proprietário deve executá-la manualmente:

### Passos

1. Acesse [supabase.com](https://supabase.com) → seu projeto → **SQL Editor**
2. Cole e execute o conteúdo de `supabase/migrations/004_add_diagram_block_type.sql`:

```sql
ALTER TABLE content_blocks
  DROP CONSTRAINT IF EXISTS content_blocks_type_check;

ALTER TABLE content_blocks
  ADD CONSTRAINT content_blocks_type_check
  CHECK (type IN (
    'intro', 'concept', 'visual_explanation', 'worked_example',
    'hint', 'summary', 'diagram'
  ));
```

3. Para confirmar, execute no SQL Editor:

```sql
SELECT pg_get_constraintdef(oid) AS def
FROM   pg_constraint
WHERE  conrelid = 'content_blocks'::regclass
  AND  contype  = 'c';
```

O resultado deve conter `'diagram'` na lista.

---

## 5. RLS/Policies — estado esperado após migrations 001–003

| Tabela | RLS | service_role | anon SELECT |
|--------|-----|-------------|-------------|
| revisions | ✓ ativo | ✓ full | apenas `status = 'active'` |
| missions | ✓ ativo | ✓ full | ✓ (conteúdo público) |
| content_blocks | ✓ ativo | ✓ full | ✓ (conteúdo público) |
| questions | ✓ ativo | ✓ full | ✗ (removido em 003) |
| question_options | ✓ ativo | ✓ full | ✗ (removido em 003) |
| students | ✓ ativo | ✓ full | ✗ |
| access_codes | ✓ ativo | ✓ full | ✗ |
| attempts | ✓ ativo | ✓ full | ✗ (removido em 002) |
| mission_progress | ✓ ativo | ✓ full | ✗ (removido em 002) |
| revision_progress | ✓ ativo | ✓ full | ✗ (removido em 002) |

---

## 6. Checks locais

| Teste | Resultado |
|-------|-----------|
| `npm run lint` | ✓ (1 warning pré-existente em `server.ts`) |
| `npm run type-check` | ✓ |
| `npm run build` | ✓ |
| `npm run validate-content:ci` | ✓ 0 erros |
| `npm test` | ✓ 47/47 |

---

## 7. Confirmações de segurança

- ✓ Nenhum secret foi impresso, registrado ou transmitido neste relatório
- ✓ Nenhum secret foi commitado (`.env.local` está em `.gitignore`)
- ✓ Nenhum deploy foi realizado
- ✓ Nenhuma revisão foi importada (VIT-32 é o próximo passo)
- ✓ Nenhum código de aluno foi gerado
- ✓ Nenhum dado real de aluno foi criado
- ✓ Plano gratuito — sem serviço pago adicionado
- ✓ VIT-32 não foi executada nem marcada como concluída

---

## 8. Próximos passos (fora do escopo desta VIT)

1. Executar migration 004 no Supabase SQL Editor (ação do proprietário)
2. Confirmar o resultado com `pg_get_constraintdef` (acima)
3. Executar VIT-32: `npm run import-revision content/revisions/revisao-9ano-triangulos-sistemas.json`
4. Verificar revisão importada com `npm run check-db-tables`
