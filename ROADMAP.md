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

## Fase 11 — Piloto controlado
- [ ] Distribuição de códigos para grupo piloto
- [ ] Acompanhamento por painel do professor
- [ ] Coleta de feedback qualitativo
- [ ] Ajustes baseados no piloto

## Backlog futuro (pós-MVP)
- Mais turmas e revisões
- Script de geração de PDF com relatório
- Notificações por WhatsApp (sem API paga — via link)
- ENEM e Ensino Médio
- Outros componentes curriculares
