# ROADMAP — Questão Certeira Interativo

## Fase 0 — Governança e setup ✅
- [x] Projeto Next.js + TypeScript
- [x] Tailwind CSS configurado
- [x] Estrutura de pastas
- [x] Documentos de governança
- [x] `.env.example`
- [x] `COST_GUARDRAILS.md`
- [x] `CONTENT_GUIDE.md`

## Fase 1 — Supabase e banco ✅
- [x] Migrations SQL (001_initial_schema.sql)
- [x] Tabelas criadas
- [x] Seed inicial
- [x] Cliente Supabase server/client separados
- [ ] Configurar projeto Supabase Free (manual — requer conta)
- [ ] Rodar migrations no projeto Supabase

## Fase 2 — Acesso por código ✅
- [x] Tela `/acessar/[revisionSlug]`
- [x] Validação de código (hash bcrypt)
- [x] Bloqueio de código expirado
- [x] Sessão/cookie temporário
- [x] Redirecionamento para mapa de missões
- [x] Erro amigável para código inválido

## Fase 3 — Mapa de missões ✅
- [x] `/revisao/[revisionSlug]`
- [x] Listagem de missões com progresso
- [x] Indicação de ordem recomendada
- [x] Diagnóstico opcional
- [x] Acesso ao simulado final
- [x] Link para relatório

## Fase 4 — Conteúdo JSON e importação ✅
- [x] Schema de tipos TypeScript
- [x] `validate-content.ts`
- [x] `import-revision.ts`
- [x] Conteúdo piloto (4 missões completas)
- [ ] Importar conteúdo para Supabase (requer banco configurado)

## Fase 5 — Tela de missão ✅
- [x] Abertura, objetivo, situação-problema
- [x] Blocos didáticos (intro, conceito, exemplo guiado, dica, resumo)
- [x] Navegação entre fase de leitura e quiz

## Fase 6 — Quiz e feedback ✅
- [x] Componente de múltipla escolha
- [x] Componente de resposta numérica
- [x] Feedback específico por alternativa
- [x] Categorias de erro
- [x] Salvar tentativa via API

## Fase 7 — Progresso e relatório do aluno ✅
- [x] Cálculo de resultado da missão
- [x] Identificação de pontos fracos
- [x] Revisão dos erros inline
- [x] `/revisao/[slug]/relatorio`

## Fase 8 — Simulado final ✅
- [x] `/revisao/[slug]/simulado`
- [x] Questões mistas de todas as missões
- [x] Resultado por assunto
- [x] Recomendação de revisão

## Fase 9 — Painel professor ✅
- [x] `/professor` protegido por código
- [x] Lista de alunos com progresso
- [x] Missões concluídas, média, última atividade

## Fase 10 — Testes e auditoria
- [x] Lint sem erros (`npm run lint`)
- [x] Build sem erros (`npm run build`)
- [x] Type-check sem erros (`npm run type-check`)
- [x] Auditoria npm sem vulnerabilidades de produção (`npm audit --omit=dev`)
- [x] Validação do conteúdo piloto (`npm run validate-content ...`)
- [x] Teste no celular (responsivo)
- [ ] Teste com código inválido
- [ ] Teste com código expirado
- [ ] Revisão dos gabaritos
- [ ] Revisão dos feedbacks pedagógicos
- [x] Checklist de privacidade
- [x] Checklist de custo zero
- [ ] Deploy em ambiente gratuito

Observação: testes de código válido/inválido/expirado, importação de conteúdo e painel com dados reais dependem da configuração manual do Supabase Free e execução das migrations no projeto remoto.

## Fase 10b — Bloco 5: Motor Reutilizável ✅ (2026-06-23)

### Parte A — PR #12 resolvido
- [x] PR #12 inspecionado: diff seguro, sem secrets, dry-run preservado
- [x] Testes validados: lint ✓, type-check ✓, build ✓, validate-content:ci ✓, npm test ✓
- [x] PR #12 integrado ao master (squash merge)

### Parte B — Baseline limpo
- [x] Branch `feat/motor-reutilizavel` criada a partir do master pós-merge
- [x] Todos os testes de baseline passando

### Parte C — Fronteira motor/conteúdo
- [x] Inventário de acoplamentos mapeado
- [x] Homepage desacoplada da revisão piloto (busca dinâmica do banco)
- [x] Fallback de `acessar/[slug]` sem grade hardcoded
- [x] Documentação em `docs/architecture/motor-content-boundary.md`

### Parte D — Schema formal
- [x] `schemaVersion` adicionado a `ContentRevisionJSON` (tipos TypeScript)
- [x] `visualConfig` adicionado como campo opcional no tipo
- [x] `content/schemas/revision.schema.json` atualizado com `schemaVersion` e `visualConfig`
- [x] `validate-content.ts` valida `schemaVersion`
- [x] Revisão piloto atualizada com `schemaVersion: "1.0"` e `visualConfig`

### Parte E — Configuração visual por revisão
- [x] `visualConfig` definido no schema (subtitle, subject, tone, missionMapBadge)
- [x] Revisão piloto tem `visualConfig` próprio

### Parte F — Suporte a múltiplas revisões
- [x] Rotas já usam `[revisionSlug]` dinâmico (nenhuma alteração necessária)
- [x] Homepage lista revisões ativas dinamicamente quando banco conectado
- [x] Acesso, missão, simulado, relatório: todos parametrizados por slug

### Parte G — Segunda revisão mínima
- [x] `content/revisions/revisao-smoke-motor.json` criada
- [x] Conteúdo sintético e autoral; 1 missão com 5 questões
- [x] Validação: 0 erros, 0 warnings

### Parte H — Guia de criação de nova revisão
- [x] `docs/content/creating-new-revision.md` criado

### Parte I — Testes finais
- [x] `npm run lint` — passa (warning pré-existente, sem erro novo)
- [x] `npm run type-check` — passa
- [x] `npm run build` — passa
- [x] `npm run validate-content:ci` — passa (revisão piloto)
- [x] `npm test` — 13/13 passed
- [x] Validação da revisão smoke — 0 erros

### Parte J — Documentação
- [x] `ROADMAP.md` atualizado
- [x] `CHECKLISTS.md` atualizado
- [x] `DECISIONS.md` atualizado (decisões 10-13)
- [x] `docs/architecture/motor-content-boundary.md` criado
- [x] `docs/content/creating-new-revision.md` criado
- [x] Relatório do agente em `docs/agent-reports/`

## Fase 11 — Piloto controlado
- [ ] Distribuição de códigos para grupo piloto
- [ ] Acompanhamento por painel do professor
- [ ] Coleta de feedback qualitativo
- [ ] Ajustes baseados no piloto

## Backlog futuro (pós-MVP)
- Mais turmas e revisões (motor já suporta)
- Smoke test com segunda revisão em banco real
- Script de geração de PDF com relatório
- Notificações por WhatsApp (sem API paga — via link)
- ENEM e Ensino Médio
- Outros componentes curriculares
- Registro dinâmico de componentes visuais (sem alterar motor por novo diagrama)
