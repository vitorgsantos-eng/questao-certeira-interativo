# Relatório do ciclo — PR #12 + Motor Reutilizável

**Data:** 2026-06-23  
**Branch:** feat/motor-reutilizavel  
**Base:** master @ ead53eb

---

## 1. Resumo executivo

O PR #12 foi inspecionado, validado e integrado ao master. Em seguida, o Bloco 5 foi implementado na branch `feat/motor-reutilizavel`: separação da fronteira motor/conteúdo, schema formal com `schemaVersion`, configuração visual por revisão, segunda revisão mínima (`revisao-smoke-motor`) e guia de criação de nova revisão. Todos os testes passam sem erros novos. A revisão piloto continua funcionando. O motor está pronto para receber novas revisões por configuração, sem alterar código central.

---

## 2. Estado inicial observado

- Branch: `chore/vit-35-deploy` (PR #12 aberto em draft)
- PR #12 mergeable, sem secrets, diff seguro (4 arquivos)
- Baseline de testes: todos passando antes de qualquer alteração
- Acoplamentos ao conteúdo piloto: homepage com slug hardcoded, fallback de grade no access page

---

## 3. PR #12

- **Estado inicial:** OPEN, draft
- **Decisão tomada:** Saída A — integração direta ao master
- **Arquivos avaliados:** `.env.example`, `next.config.ts`, `scripts/cleanup-test-data.ts`, relatório de deploy
- **Testes executados:** lint ✓, type-check ✓, build ✓, validate-content:ci ✓, npm test ✓
- **Resultado:** Squash merge executado; branch `chore/vit-35-deploy` deletada

---

## 4. Implementação do motor

### Separação motor/conteúdo

- Homepage (`src/app/page.tsx`) refatorada: remove slug hardcoded `revisao-9ano-triangulos-sistemas` e grade `9º ano`; agora busca revisões ativas do banco dinamicamente; exibe lista de revisões se conectado, landing genérica se não
- Fallback de grade no `acessar/[revisionSlug]/page.tsx` substituído por string genérica
- Fronteira documentada em `docs/architecture/motor-content-boundary.md`

### Schema formal

- `schemaVersion: string` adicionado como campo obrigatório em `ContentRevisionJSON` (TypeScript)
- `visualConfig?: RevisionVisualConfig` adicionado como campo opcional
- `content/schemas/revision.schema.json` atualizado: `schemaVersion` obrigatório, `visualConfig` e `challengeQuestions` formalizados
- `validate-content.ts` valida `schemaVersion` e reporta versões não suportadas
- Revisão piloto atualizada: `schemaVersion: "1.0"`, `visualConfig` com subtitle/subject/tone/missionMapBadge

### Configuração por revisão

- `visualConfig` disponível no schema e no tipo TypeScript
- Cada revisão pode declarar `subtitle`, `subject`, `tone`, `missionMapBadge`
- Motor não usa esses campos diretamente ainda (sem alteração forçada de componentes genéricos); pronto para uso futuro

### Multi-revisão

- Rotas já usavam `[revisionSlug]` — nenhuma alteração necessária no roteamento
- Homepage agora exibe qualquer revisão ativa do banco (não apenas a piloto)
- Acesso, missão, simulado, relatório e painel professor: todos parametrizados por slug (confirmado sem hardcode)

### Segunda revisão mínima

- `content/revisions/revisao-smoke-motor.json` criada
- Conteúdo 100% sintético e autoral; assunto: arquitetura de software (sem vínculo com Matemática)
- 1 missão, 5 questões (3 básicas/intermediárias + 1 desafio + 1 que valida fronteira motor/conteúdo)
- Valida: 0 erros, 0 warnings

---

## 5. Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| `content/revisions/revisao-smoke-motor.json` | Segunda revisão mínima — prova técnica do motor |
| `docs/architecture/motor-content-boundary.md` | Fronteira motor vs pacote de revisão |
| `docs/content/creating-new-revision.md` | Guia operacional para criar nova revisão |
| `docs/agent-reports/2026-06-23-pr12-baseline-motor-start.md` | Relatório de baseline |
| `docs/agent-reports/2026-06-23-motor-reutilizavel.md` | Este relatório |

---

## 6. Arquivos alterados

| Arquivo | Alteração |
|---------|-----------|
| `src/app/page.tsx` | Homepage dinâmica — remove hardcodes da revisão piloto |
| `src/app/acessar/[revisionSlug]/page.tsx` | Fallback genérico (sem grade hardcoded) |
| `src/types/index.ts` | `schemaVersion`, `subject`, `visualConfig` em `ContentRevisionJSON` |
| `content/schemas/revision.schema.json` | Schema atualizado (schemaVersion obrigatório, visualConfig, challengeQuestions) |
| `content/revisions/revisao-9ano-triangulos-sistemas.json` | schemaVersion: "1.0" + visualConfig adicionados |
| `scripts/validate-content.ts` | Validação de schemaVersion |
| `DECISIONS.md` | Decisões 10-13 do Bloco 5 |
| `ROADMAP.md` | Fase 10b — Bloco 5 completo |
| `CHECKLISTS.md` | Checklist do motor reutilizável |

---

## 7. Testes executados

| Comando | Resultado | Observação |
|---------|-----------|------------|
| `npm run lint` | ✓ | 1 warning pré-existente (`_table` não usado no mock de teste) |
| `npm run type-check` | ✓ | Sem erros |
| `npm run build` | ✓ | Todas as 12 rotas compiladas |
| `npm run validate-content:ci` | ✓ | Revisão piloto: 0 erros |
| `npm test` | ✓ 13/13 | Todos os testes passaram |
| `npx tsx scripts/validate-content.ts revisao-smoke-motor.json` | ✓ | Segunda revisão: 0 erros |

---

## 8. Critérios de aceite

| Critério | Status | Evidência |
|----------|--------|-----------|
| PR #12 revisado e integrado | ✅ | Squash merge ead53eb |
| Fronteira motor/conteúdo documentada | ✅ | `docs/architecture/motor-content-boundary.md` |
| Motor não hardcoda revisão piloto | ✅ | Homepage dinâmica; grep confirma |
| Schema formal com schemaVersion | ✅ | `content/schemas/revision.schema.json` v1.0 |
| Revisão piloto continua válida | ✅ | validate-content:ci 0 erros |
| Segunda revisão mínima | ✅ | `revisao-smoke-motor.json` 0 erros |
| Todos os fluxos do MVP preservados | ✅ | Build ✓; rotas parametrizadas por slug |
| lint ✓ | ✅ | Sem erros (warning pré-existente) |
| type-check ✓ | ✅ | |
| build ✓ | ✅ | |
| validate-content:ci ✓ | ✅ | |
| npm test ✓ | ✅ | 13/13 |
| Custo zero | ✅ | Nenhuma dependência nova |
| Sem IA no runtime | ✅ | Confirmado |
| Sem secrets versionados | ✅ | Confirmado |
| Dados sensíveis: nenhum coletado | ✅ | Confirmado |
| Guia de nova revisão | ✅ | `docs/content/creating-new-revision.md` |
| ROADMAP e CHECKLISTS atualizados | ✅ | |

---

## 9. Restrições confirmadas

- **Custo zero:** SIM
- **IA no runtime:** NÃO
- **Dependência paga adicionada:** NÃO
- **Secrets versionados:** NÃO
- **Dados sensíveis coletados:** NÃO

---

## 10. Riscos residuais

1. **Componentes visuais acoplados:** `TrigonometryDiagram`, `SimilarTrianglesDiagram`, `RightTriangleMetricsDiagram` são específicos do piloto. Para uma nova revisão com diagramas próprios, o motor precisa registrar os novos IDs. Documentado em DECISIONS.md #13.
2. **Smoke test com banco real pendente:** a segunda revisão foi validada localmente via script, mas não foi importada no Supabase (banco não configurado). Teste de fluxo completo requer banco ativo.
3. **Meta description do layout:** `src/app/layout.tsx` ainda menciona "Matemática" na descrição SEO. Acoplamento cosmético, sem impacto funcional.

---

## 11. Pendências manuais

- **Supabase:** configurar projeto remoto, rodar migrations, importar revisão piloto e smoke
- **Vercel:** configurar variáveis de ambiente e executar deploy (guia em `docs/agent-reports/2026-06-20-vit-35-controlled-free-deploy.md`)
- **Revisão humana:** gabaritos e feedbacks das 5 questões da revisão piloto (pendência do CHECKLISTS original)
- **Smoke test com banco:** após configurar banco, testar fluxo completo com `revisao-smoke-motor`

---

## 12. Próxima etapa recomendada

1. Configurar Supabase remoto e rodar migrations (Fase 1 do ROADMAP)
2. Importar revisão piloto: `npm run import-revision content/revisions/revisao-9ano-triangulos-sistemas.json`
3. Importar segunda revisão: `npm run import-revision content/revisions/revisao-smoke-motor.json`
4. Executar smoke test manual com código de acesso controlado para ambas as revisões
5. Abrir PR `feat/motor-reutilizavel` → master com título: `feat(motor): Bloco 5 — Motor Questão Certeira reutilizável`
6. Após validação humana, iniciar Fase 11 (piloto controlado)
