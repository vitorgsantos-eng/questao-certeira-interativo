# CHECKLISTS.md — Questão Certeira Interativo

## Checklist técnico

- [x] `npm run lint` sem erros
- [x] `npm run type-check` sem erros
- [x] `npm run build` sem erros
- [x] Nenhuma chave sensível em código ou `.env.local` versionado
- [ ] Migrations rodadas no Supabase
- [ ] Conteúdo importado via `import-revision.ts`
- [ ] Códigos de acesso gerados via `generate-access-codes.ts`
- [x] Rota `/professor` protegida por senha

## Checklist pedagógico

- [x] Cada missão tem pelo menos 5 questões
- [x] Cada missão tem bloco de conceito antes da fórmula
- [x] Cada missão tem exemplo guiado
- [x] Feedbacks são específicos (não genéricos)
- [x] Categorias de erro preenchidas para opções incorretas
- [ ] Gabaritos conferidos manualmente
- [x] Linguagem adequada ao público (sem infantilização)
- [x] Diagnóstico cobre todos os assuntos (1 questão por missão)

## Checklist de segurança

- [x] `SUPABASE_SERVICE_ROLE_KEY` nunca aparece em código client-side
- [x] Cookies com httpOnly e sameSite
- [x] Validação com Zod em rotas de API que recebem input externo
- [x] Conteúdo protegido não está em `/public`
- [ ] Sessão verifica expiração do código
- [ ] RLS habilitado em todas as tabelas

## Checklist de privacidade

- [x] Apenas apelido/nome coletado (sem nome completo obrigatório)
- [x] Sem CPF, e-mail, telefone, localização
- [x] Sem foto ou imagem do aluno
- [x] Finalidade exclusivamente pedagógica
- [x] Acesso restrito ao professor via senha

## Checklist de custo zero

- [ ] Supabase no plano Free
- [ ] Hospedagem no plano gratuito (Vercel Hobby / Netlify Free)
- [x] Nenhuma API paga chamada pelo app
- [x] Nenhuma dependência com trial que vence automaticamente
- [x] Nenhum webhook em serviço pago
- [x] Nenhum domínio pago como requisito

## Checklist de publicação

- [ ] Variáveis de ambiente configuradas no serviço de hospedagem
- [x] Build de produção funcionando
- [ ] HTTPS ativo
- [ ] Revisão ativa no banco (`status = 'active'`)
- [ ] Códigos de acesso gerados e distribuídos

## Checklist de teste no celular

- [x] Página inicial responsiva
- [x] Formulário de acesso renderiza no celular
- [ ] Mapa de missões legível em tela pequena
- [ ] Questões de múltipla escolha selecionáveis com toque
- [ ] Campo numérico abre teclado correto (inputMode="decimal")
- [ ] Feedback legível em tela pequena
- [ ] Navegação funciona sem zoom involuntário
- [ ] Relatório legível em tela pequena
