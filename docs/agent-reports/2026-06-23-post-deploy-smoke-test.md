# Relatório Pós-Deploy — Smoke Test Controlado

**Data:** 2026-06-23  
**Executor:** agente autônomo local (Claude Sonnet 4.6)  
**Referência:** `bloco_pos_deploy_smoke_goal_atualizado.md`

---

## 1. Contexto

Bloco de estabilização pós-deploy do Questão Certeira Interativo. Objetivo: validar que o motor funciona em ambiente real com Supabase remoto, Vercel em produção, revisões importadas, códigos controlados e smoke test completo.

---

## 2. Branch e commit testados

- **Branch:** `master`
- **Commit:** `09b096e` — `feat(motor): Bloco 5 — Motor Questão Certeira reutilizável (#13)`
- **PR mergeado:** #13

---

## 3. URL pública do deploy

- **Canonical:** https://questao-certeira-interativo.vercel.app
- **HTTP status verificado:** 200 OK, HTTPS ativo, servidor Vercel

---

## 4. Supabase

- **Project ref:** `vejvgrwdgyknazouviww`
- **URL:** `https://vejvgrwdgyknazouviww.supabase.co`

---

## 5. Variáveis de ambiente verificadas

| Variável | Status |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | present (local) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | present (local) |
| `SUPABASE_SERVICE_ROLE_KEY` | present (local + Vercel após intervenção manual) |
| `PROFESSOR_ACCESS_CODE` | present (local + Vercel após intervenção manual) |
| `SESSION_SECRET` | present (local + Vercel após intervenção manual) |

`.env.local` permanece ignorado pelo Git (`git check-ignore` confirmado).

**Pendência identificada:** `SUPABASE_SERVICE_ROLE_KEY`, `SESSION_SECRET` e `PROFESSOR_ACCESS_CODE` não estavam presentes no ambiente Vercel inicialmente — adicionados manualmente pelo proprietário com redeploy durante a execução deste bloco.

---

## 6. Revisões importadas

| Revisão | Slug | Missões | Questões | Opções |
|---|---|---|---|---|
| Revisão Interativa — Triângulos e Sistemas | `revisao-9ano-triangulos-sistemas` | 4 | 20 | 80 |
| Revisão Smoke — Motor Reutilizável | `revisao-smoke-motor` | 1 | 5 | 3+ |

**Totais no banco:** 2 revisões, 5 missões, 39 blocos, 25 questões, 83 opções.

**Bug corrigido durante import:** `import-revision.ts` e `generate-access-codes.ts` não carregavam `.env.local` automaticamente. Corrigido adicionando `loadEnvLocal()` — padrão já usado em `check-db-tables.ts`.

---

## 7. Códigos controlados gerados

- 1 código para `revisao-9ano-triangulos-sistemas` — aluno fictício "Aluno Teste Visual"
- 1 código para `revisao-smoke-motor` — aluno fictício "Aluno Smoke Motor"
- Códigos exibidos apenas no terminal local (não versionados)
- Banco armazena apenas hash bcrypt
- Nenhum aluno real utilizado

---

## 8. Resultados dos comandos locais

| Comando | Resultado |
|---|---|
| `npm ci` | ✓ sucesso |
| `npm run lint` | ✓ sucesso (1 warning não-bloqueante: `_table` unused var) |
| `npm run type-check` | ✓ sucesso |
| `npm run build` | ✓ sucesso |
| `npm run validate-content:all` | ✓ 0 erros, 2 arquivos válidos |
| `npm test` | ✓ 13 passed, 0 failed |

---

## 9. Resultados do smoke test

### 9.1 Homepage
- ✓ Abre sem erro
- ✓ Identidade visual correta
- ✓ Revisões listadas com badge de subject/grade após importação
- ✓ Em mobile (390px): revisões listadas com "Matemática · 9º ano" e "Smoke · Teste"

### 9.2 Acesso por código
- ✓ Código válido (`revisao-9ano`): redireciona corretamente para mapa de missões
- ✓ Código inválido: retorna 401 com mensagem amigável "Código inválido. Verifique e tente novamente."
- ✓ Cross-revision (código smoke no slug 9ano): retorna 401 — isolamento correto
- ✓ Código smoke válido (`revisao-smoke-motor`): redireciona corretamente

### 9.3 Fluxo aluno — missão completa
- ✓ Acesso ao mapa de missões
- ✓ Abertura de missão com blocos didáticos (conceito, exemplo resolvido, diagrama SVG)
- ✓ Resposta a questões de múltipla escolha (feedback imediato por opção)
- ✓ Resposta a questão numérica (valor 54, feedback "Correto!")
- ✓ Conclusão da missão: 80% (4/5 corretas)
- ✓ Tentativas persistidas: `/api/attempts` retornou 200 (4 chamadas)
- ✓ Progresso atualizado: mapa mostra 25%, missão "Concluída 80%"
- ✓ Revisão de erros exibida na tela de conclusão

### 9.4 Relatório do aluno
- ✓ `/revisao/.../relatorio` abre corretamente
- ✓ Exibe média geral 80%, 1 missão concluída, pontos a reforçar
- ✓ Progresso por missão listado corretamente

### 9.5 Simulado
- ✓ Página de simulado abre (12 questões mistas)
- ✓ Questões de múltipla escolha funcionam normalmente
- ✓ Tentativas persistidas via `/api/attempts` (200)
- ⚠️ Bug encontrado e corrigido: questões `numeric` no simulado não renderizavam input — botão "Confirmar" ficava desabilitado. `SimuladoFinal.tsx` corrigido com suporte a `NumericQuestion`. Fix pendente de deploy (PR #14).

### 9.6 Painel professor
- ✓ Login com `PROFESSOR_ACCESS_CODE` funciona
- ✓ Exibe 6 estudantes, 6 códigos ativos, 5 missões concluídas
- ✓ Exibe 2 revisões ativas
- ✓ Progresso por aluno visível (missões, %, última atividade, validade do código)
- ✓ Sem dados sensíveis indevidos expostos

### 9.7 Mobile (viewport 390×844)
- ✓ Homepage carrega corretamente com revisões listadas
- ✓ Página de acesso por código renderiza formulário
- ✓ Código smoke válido aceito e redirecionamento correto
- ✓ Missão smoke renderiza conteúdo didático completo

---

## 10. Falhas encontradas e ações

| # | Falha | Severidade | Ação |
|---|---|---|---|
| 1 | `import-revision.ts` e `generate-access-codes.ts` não carregavam `.env.local` | Bloqueante (scripts inutilizáveis localmente) | Corrigido neste bloco — PR #14 |
| 2 | `SimuladoFinal` não suportava questões `numeric` | Não-bloqueante (simulado funciona, questões numéricas ficavam presas) | Corrigido neste bloco — PR #14 |
| 3 | `SUPABASE_SERVICE_ROLE_KEY`, `SESSION_SECRET`, `PROFESSOR_ACCESS_CODE` ausentes no Vercel | Bloqueante (API /api/auth/validate-code retornava 503) | Resolvido pelo proprietário (variáveis adicionadas + redeploy) |

---

## 11. Pendências manuais

1. **Merge do PR #14** — [`fix(deploy): ajustes pos-deploy e smoke test controlado`](https://github.com/vitorgsantos-eng/questao-certeira-interativo/pull/14) — corrige scripts e simulado numérico.
2. **Verificar simulado completo após deploy do PR #14** — confirmar que questões numéricas no simulado funcionam em produção.
3. **Variáveis Vercel** — confirmar que `SUPABASE_SERVICE_ROLE_KEY`, `SESSION_SECRET` e `PROFESSOR_ACCESS_CODE` estão configuradas para ambientes Preview também.

---

## 12. Evidências de custo zero

- Supabase: plano Free (projeto `vejvgrwdgyknazouviww`, dentro dos limites)
- Vercel: plano Hobby (deploy automático, sem funções pagas)
- Nenhuma API paga ativada
- Nenhum serviço novo contratado

---

## 13. Confirmações

- **Custo zero mantido:** sim
- **Sem IA no runtime do app:** sim (nenhuma chamada a API de LLM no fluxo do aluno)
- **Sem secrets versionados:** sim (`.env.local` gitignored; códigos de aluno apenas no terminal)
- **Sem alunos reais usados:** sim (apenas fictícios: "Aluno Teste Visual", "Aluno Smoke Motor")
- **Nenhum dado apagado sem autorização:** sim

---

## 14. Arquivos alterados neste bloco

| Arquivo | Tipo de alteração |
|---|---|
| `scripts/import-revision.ts` | fix: adicionar `loadEnvLocal()` |
| `scripts/generate-access-codes.ts` | fix: adicionar `loadEnvLocal()` |
| `src/components/simulado/SimuladoFinal.tsx` | fix: suporte a `NumericQuestion` |
| `data/students-smoke.local.json` | novo (gitignored): alunos fictícios para revisão smoke |

---

## 15. PR aberto

- [PR #14 — fix(deploy): ajustes pos-deploy e smoke test controlado](https://github.com/vitorgsantos-eng/questao-certeira-interativo/pull/14)

---

## 16. Próximo bloco

**Bloco 6 — Pipeline externo de PDFs** (somente após merge e verificação do PR #14)
