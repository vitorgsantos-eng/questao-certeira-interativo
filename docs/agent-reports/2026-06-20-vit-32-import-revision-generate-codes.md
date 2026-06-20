# VIT-32 — Importar Revisão Piloto e Gerar Códigos Controlados

**Data:** 2026-06-19 (concluído)
**Branch:** master (tarefa operacional)

---

## 1. Preparação

| Verificação | Resultado |
|-------------|-----------|
| `.env.local` gitignored | ✓ `.gitignore:13` |
| `data/students.local.json` gitignored | ✓ `.gitignore:26` |
| Banco remoto — 10 tabelas presentes | ✓ |
| Constraint `content_blocks.type` aceita `diagram` | ✓ (migration 004) |

---

## 2. Etapa 1 — Validação do conteúdo

Executado `npm run validate-content:ci`:

```
✓ 4 missions found
✓ 9 blocks — Mission 1: Semelhança de Triângulos
✓ 9 blocks — Mission 2: Relações Métricas no Triângulo Retângulo
✓ 9 blocks — Mission 3: Trigonometria no Triângulo Retângulo
✓ 8 blocks — Mission 4: Sistemas com Equações do 2º Grau
Result: 0 error(s), 0 warning(s)
✓ Content is valid. Ready to import.
```

---

## 3. Etapa 2 — Importação da revisão

Executado `npm run import-revision content/revisions/revisao-9ano-triangulos-sistemas.json`:

```
Importing: Revisão Interativa — Triângulos e Sistemas
✓ Mission semelhanca-triangulos imported
✓ Mission relacoes-metricas-triangulo-retangulo imported
✓ Mission trigonometria-triangulo-retangulo imported
✓ Mission sistemas-equacoes-2-grau imported
Import complete!
```

### Estado do banco pós-importação

| Dado | Quantidade | Observação |
|------|-----------|------------|
| Revisões | 1 | `revisao-9ano-triangulos-sistemas`, status `active` |
| Missões importadas | 4 | Todas as 4 missões |
| Blocos de conteúdo | 35 | Subiu de 26 (pré-VIT-50/51) para 35 |
| Blocos `diagram` | 4 | Um por missão (M1–M4), constraint OK |
| Questões | 20 | 5 por missão |
| Opções de questão | 68 | Todas as questões múltipla escolha |

---

## 4. Etapa 3 — Arquivo de alunos fictícios

`data/students.local.json` já existia com 1 aluno fictício de teste ("Aluno Teste Visual", turma de teste). Confirmado gitignored. Nenhum aluno real utilizado.

---

## 5. Etapa 4 — Geração de códigos

Executado dry-run (`npm run test:generate-codes`) com `students.sample.json` → validação de formato OK.

Executado `npm run generate-codes` com `data/students.local.json`:

| Dado | Resultado |
|------|-----------|
| Alunos no arquivo | 1 (fictício) |
| Códigos gerados | 1 |
| Validade | 15 dias (expira 2026-07-04) |
| Códigos em texto puro no banco | Não — apenas hash bcrypt |
| Código bruto exposto em relatório/PR/chat | Não |

---

## 6. Etapa 5 — Sanity check de acesso

Dev server iniciado em `http://localhost:3002` (porta 3000 em uso).

| Teste | Resultado |
|-------|-----------|
| `GET /acessar/revisao-9ano-triangulos-sistemas` | ✓ 200 |
| `POST /api/auth/validate-code` — código inválido | ✓ 400 (rejeitado) |
| `POST /api/auth/validate-code` — código válido | ✓ 200, `ok: true` |
| `GET /revisao/...` sem sessão | ✓ 307 redirect (protegido) |
| `GET /revisao/.../missao/semelhanca-triangulos` sem sessão | ✓ 307 redirect (protegido) |

Nenhum erro 500/404 no fluxo principal.

---

## 7. Checks finais

| Teste | Resultado |
|-------|-----------|
| `npm run lint` | ✓ (1 warning pré-existente em `server.ts`) |
| `npm run type-check` | ✓ |
| `npm run build` | ✓ |
| `npm run validate-content:ci` | ✓ 0 erros |
| `npm test` | ✓ 47/47 |
| `npx tsx scripts/check-db-tables.ts` | ✓ 10/10 tabelas + constraint `diagram` OK |

---

## 8. Confirmações de segurança

- ✓ Nenhum secret exposto (service role key, anon key, URL completa)
- ✓ `.env.local` não commitado
- ✓ `data/students.local.json` não commitado
- ✓ Código bruto não registrado em relatório, PR, chat ou GitHub
- ✓ Somente hash bcrypt armazenado no banco
- ✓ Nenhum dado real de aluno utilizado (aluno fictício de teste)
- ✓ Sem deploy
- ✓ Sem serviço pago adicionado

---

## 9. Pendências para VIT-33

- Testar fluxo completo com sessão ativa (login → revisão → missão → questões → resultado)
- Verificar renderização dos blocos `diagram` no navegador após login
- Verificar renderização KaTeX nas questões
- Verificar relatório do professor (`/professor/relatorio`)
- Confirmar que `attempts` são registrados corretamente ao responder questões
