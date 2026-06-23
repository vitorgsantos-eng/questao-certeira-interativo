# INSTRUÇÕES GOAL — PR #12 + BLOCO 5: MOTOR QUESTÃO CERTEIRA REUTILIZÁVEL

**Projeto:** Questão Certeira Interativo  
**Repositório:** `vitorgsantos-eng/questao-certeira-interativo`  
**Branch-base:** `master`  
**Modo de execução previsto:** agente autônomo em modo `goal`, com planejamento e execução incremental  
**Escopo central:** resolver o PR #12 e iniciar/concluir o grande bloco de transformação do MVP em motor reutilizável de revisões por missões  
**Data de referência:** 23/06/2026  

---

## 1. Objetivo macro

Transformar o **Questão Certeira Interativo** de um miniapp de revisão de Matemática específico para um **motor reutilizável de aprendizagem por missões**, capaz de executar múltiplos pacotes de revisão estruturados sem reescrever a lógica central da aplicação.

Antes de iniciar a refatoração do motor, o agente deve resolver o estado pendente do **PR #12 — `chore(deploy): VIT-35 — publicação gratuita controlada para piloto`**, pois ele prepara a publicação gratuita controlada, corrige pontos de configuração e documenta o deploy.

O resultado final deve preservar o MVP funcional, manter custo zero, não adicionar IA em tempo de execução, não coletar dados excessivos de menores e deixar o sistema pronto para receber novas revisões por conteúdo/configuração, não por alteração estrutural do código.

---

## 2. Fontes obrigatórias antes de implementar

O agente deve ler, nesta ordem, antes de alterar código:

1. `AGENTS.md`
2. `PLANO_MATRIZ.md`
3. `README.md`
4. `ROADMAP.md`
5. `CHECKLISTS.md`
6. `SECURITY.md`, se existir
7. `COST_GUARDRAILS.md`, se existir
8. `DECISIONS.md`, se existir
9. `CONTENT_GUIDE.md`, se existir
10. `package.json`
11. `content/revisions/revisao-9ano-triangulos-sistemas.json`
12. `supabase/migrations/`
13. PR #12 no GitHub
14. Issues Linear relacionadas:
    - `VIT-35` — deploy gratuito controlado
    - `VIT-36` — separar motor fixo e pacote de revisão
    - `VIT-37` — formalizar schema do pacote de revisão
    - `VIT-38` — permitir configuração visual por revisão
    - `VIT-39` — suportar múltiplas revisões/assuntos no mesmo motor
    - `VIT-40` — criar guia de criação de nova revisão
    - `VIT-41` — criar segunda revisão mínima como prova do motor

Se algum arquivo obrigatório não existir, o agente deve registrar isso no relatório e continuar com as fontes disponíveis. Não deve inventar conteúdo de arquivo ausente.

---

## 3. Restrições absolutas

Durante todo o bloco, é proibido:

1. adicionar API paga;
2. adicionar IA dentro do app entregue ao aluno;
3. chamar OpenAI, Anthropic, Gemini ou qualquer API de IA em produção;
4. adicionar gateway de pagamento;
5. exigir domínio pago;
6. exigir plano pago da Vercel, Supabase, Netlify ou qualquer outro serviço;
7. expor `SUPABASE_SERVICE_ROLE_KEY` no frontend;
8. versionar `.env.local`, códigos reais de alunos ou dados sensíveis;
9. coletar CPF, RG, e-mail, telefone, foto, localização ou data de nascimento de aluno;
10. criar login completo com e-mail/senha no MVP;
11. iniciar pipeline de PDFs antes de fechar a separação motor/conteúdo;
12. alterar a arquitetura de forma ampla sem registrar decisão em documentação;
13. apagar dados remotos sem dry-run e sem confirmação explícita;
14. fazer deploy de produção com secrets inventados;
15. considerar o bloco concluído sem executar ou justificar todos os testes exigidos.

---

## 4. Definição objetiva de pronto

Este grande bloco só estará pronto quando todos os itens abaixo forem verdadeiros:

1. O PR #12 foi resolvido de forma explícita:
   - ou foi revisado, validado e integrado;
   - ou foi descartado com justificativa técnica documentada;
   - ou suas alterações úteis foram reaplicadas em nova branch, com o PR original fechado ou documentado como obsoleto.

2. A aplicação possui documentação clara da fronteira entre:
   - **motor fixo**;
   - **pacote de revisão/conteúdo**;
   - **configuração visual e pedagógica por revisão**;
   - **dados runtime no Supabase**.

3. O código central não depende de strings, slugs, títulos, textos, tema visual ou comportamento específico da revisão piloto de Matemática, exceto quando esses dados estiverem no pacote de revisão, em seed controlado ou em configuração explicitamente documentada.

4. Existe um schema formal e validável de pacote de revisão.

5. O conteúdo piloto atual continua válido e funcional.

6. Existe uma segunda revisão mínima/sintética usada como prova de que o motor não está acoplado a uma única revisão.

7. Os fluxos principais continuam funcionando:
   - acesso por código;
   - mapa de missões;
   - missão;
   - quiz;
   - feedback;
   - relatório do aluno;
   - simulado;
   - painel professor.

8. Os comandos finais passam:
   - `npm run lint`
   - `npm run type-check`
   - `npm run build`
   - `npm run validate-content:ci`
   - `npm test`
   - validação individual da segunda revisão mínima, se criada fora do script CI.

9. Nenhum custo novo foi introduzido.

10. Nenhuma IA foi adicionada ao app em tempo de execução.

11. Nenhum dado sensível ou código real de aluno foi versionado.

12. `ROADMAP.md`, `CHECKLISTS.md` e documentação técnica foram atualizados.

---

## 5. Estratégia de execução

O agente deve operar em ciclos curtos, com commits pequenos e reversíveis.

Não fazer uma refatoração massiva cega. O objetivo é evoluir a arquitetura mantendo o MVP vivo.

### Branch sugerida

Criar uma branch dedicada:

```bash
git fetch origin
git checkout master
git pull origin master
git checkout -b goal/pr12-motor-reutilizavel
```

Se o ambiente local já estiver em uma branch de trabalho, o agente deve primeiro verificar `git status` e não sobrescrever alterações existentes sem registrar no relatório.

---

# PARTE A — RESOLVER O PR #12

## 6. Objetivo da Parte A

Resolver o PR #12 antes da implementação do motor, porque ele trata da preparação de publicação gratuita controlada e contém correções/documentação que podem afetar o estado de base do MVP.

O PR #12 foi descrito como preparação para deploy gratuito controlado, incluindo:

1. auditoria pré-deploy;
2. remoção de configuração restritiva em `next.config.ts`;
3. atualização de `.env.example`;
4. criação de script de limpeza de dados fictícios;
5. relatório completo de deploy;
6. testes declarados como aprovados: lint, type-check, build, validação de conteúdo e `npm test`.

O agente deve verificar tudo novamente no estado atual, sem confiar apenas na descrição do PR.

---

## 7. Procedimento obrigatório para o PR #12

### 7.1 Inspeção

Executar:

```bash
gh pr view 12 --json number,title,state,isDraft,mergeable,baseRefName,headRefName,commits,files,body
gh pr diff 12 --name-only
gh pr diff 12
```

Se `gh` não estiver autenticado, usar a interface GitHub disponível ou registrar bloqueio no relatório.

### 7.2 Critérios de revisão do PR #12

Verificar:

1. se não há secrets ou valores reais de `.env`;
2. se `.env.example` contém apenas nomes de variáveis e placeholders;
3. se o script de limpeza de dados fictícios usa dry-run por padrão;
4. se qualquer remoção em `next.config.ts` é compatível com o uso real de Next.js no projeto;
5. se a documentação de deploy não induz o proprietário a usar serviço pago;
6. se o PR não altera lógica pedagógica sem necessidade;
7. se o PR não adiciona dependências pagas ou desnecessárias;
8. se o PR não executa deploy automaticamente;
9. se o PR não apaga dados.

### 7.3 Validação local do PR #12

Executar preferencialmente:

```bash
gh pr checkout 12
npm ci || npm install
npm run lint
npm run type-check
npm run build
npm run validate-content:ci
npm test
```

Se algum teste falhar, corrigir na própria branch do PR #12 ou reaplicar a correção na branch de trabalho, conforme menor risco.

### 7.4 Decisão sobre o PR #12

Adotar uma das três saídas:

#### Saída A — integrar o PR #12

Usar se:

- PR está mergeável;
- testes passam;
- diff é seguro;
- não há conflito com `master`.

Procedimento:

```bash
gh pr ready 12 || true
gh pr merge 12 --squash --delete-branch
git checkout master
git pull origin master
```

Se o projeto preferir manter PRs como draft até revisão humana, não forçar merge. Nesse caso, documentar que o PR está validado, mas aguarda decisão humana.

#### Saída B — atualizar o PR #12

Usar se:

- PR é útil, mas precisa de pequenas correções;
- há conflito leve;
- testes falham por problema corrigível.

Procedimento:

```bash
gh pr checkout 12
# aplicar correções mínimas
npm run lint
npm run type-check
npm run build
npm run validate-content:ci
npm test
git add .
git commit -m "chore(deploy): finalize controlled free deploy prep"
git push
```

Depois, marcar como pronto para revisão ou fazer merge se autorizado pelo fluxo do projeto.

#### Saída C — descartar/recriar

Usar se:

- PR está obsoleto;
- conflito é maior que o benefício;
- o estado de `master` já contém as alterações;
- há risco de merge ruim.

Procedimento:

1. documentar exatamente por que o PR não deve ser integrado;
2. reaplicar manualmente apenas as alterações úteis em branch nova;
3. fechar o PR #12 apenas se houver certeza;
4. registrar decisão em `DECISIONS.md` ou relatório de agente.

---

## 8. Critérios de aceite da Parte A

A Parte A só está concluída se:

- [ ] PR #12 foi revisado no estado atual.
- [ ] O diff do PR #12 foi inspecionado.
- [ ] Não há secrets no PR.
- [ ] O script de limpeza, se mantido, permanece em dry-run por padrão.
- [ ] A documentação de deploy não exige plano pago.
- [ ] `next.config.ts` continua compatível com produção.
- [ ] Os testes exigidos foram executados ou a impossibilidade foi justificada.
- [ ] O PR foi integrado, atualizado ou descartado com justificativa.
- [ ] A situação final do PR #12 está documentada em relatório.
- [ ] O agente não realizou deploy real sem variáveis válidas e sem autorização operacional.

---

# PARTE B — BASELINE APÓS PR #12

## 9. Objetivo da Parte B

Criar uma base limpa e auditável antes de refatorar o motor.

Após resolver o PR #12, executar:

```bash
git checkout master
git pull origin master
npm ci || npm install
npm run lint
npm run type-check
npm run build
npm run validate-content:ci
npm test
```

Se a implementação do motor ocorrer em nova branch:

```bash
git checkout -b feat/motor-reutilizavel
```

Criar relatório inicial em:

```txt
docs/agent-reports/YYYY-MM-DD-pr12-baseline-motor-start.md
```

O relatório deve conter:

1. estado final do PR #12;
2. commit-base usado;
3. comandos executados;
4. resultado dos testes;
5. pendências manuais de Supabase/Vercel;
6. riscos antes de iniciar o motor.

---

# PARTE C — MOTOR FIXO VS PACOTE DE REVISÃO

## 10. Objetivo da Parte C

Implementar a separação entre **motor fixo** e **pacote de revisão**, começando pela VIT-36.

O motor fixo é o conjunto de rotas, componentes, APIs, validações, persistência, scoring, sessão, renderização e relatórios que deve funcionar para qualquer revisão compatível.

O pacote de revisão é o conjunto de dados variáveis que define conteúdo, missões, questões, feedbacks, textos, metadados, configuração pedagógica e aparência da revisão.

---

## 11. Inventário de acoplamentos

Antes de refatorar, procurar por acoplamentos à revisão piloto:

```bash
grep -R "revisao-9ano-triangulos-sistemas" -n .
grep -R "Matemática" -n src content scripts docs
grep -R "triângulo\|triangulo\|sistemas\|9ano\|9º" -n src scripts docs content
grep -R "Semelhança\|Trigonometria\|Relações métricas" -n src scripts docs content
```

No Windows PowerShell, equivalente:

```powershell
Select-String -Path .\src\*,.\scripts\*,.\content\*,.\docs\* -Pattern "revisao-9ano-triangulos-sistemas","Matemática","triângulo","triangulo","sistemas","9ano","9º","Semelhança","Trigonometria","Relações métricas" -Recurse
```

Classificar cada achado em:

1. **Permitido no conteúdo** — pode permanecer em `content/revisions/`.
2. **Permitido em documentação histórica** — pode permanecer em relatórios e docs de contexto.
3. **Permitido em seed/teste específico** — deve estar claramente isolado.
4. **Não permitido no motor** — deve virar configuração, metadata ou dado do pacote.
5. **Risco de bug multi-revisão** — deve ser corrigido.

Criar ou atualizar:

```txt
docs/architecture/motor-content-boundary.md
```

---

## 12. Critérios de aceite da Parte C

- [ ] Existe inventário de acoplamentos.
- [ ] Existe documentação da fronteira motor/conteúdo.
- [ ] Strings específicas da revisão piloto não permanecem espalhadas em lógica central.
- [ ] O conteúdo piloto permanece em arquivo de revisão ou banco, não hardcoded em componentes centrais.
- [ ] A aplicação continua renderizando a revisão piloto.
- [ ] Nenhuma funcionalidade do MVP foi removida.
- [ ] Nenhuma dependência paga foi adicionada.

---

# PARTE D — SCHEMA FORMAL DO PACOTE DE REVISÃO

## 13. Objetivo da Parte D

Formalizar o contrato do pacote de revisão para permitir novas revisões sem reprogramar o app.

O schema deve cobrir, no mínimo:

```txt
revisionPackage
├── schemaVersion
├── revision
│   ├── slug
│   ├── title
│   ├── subtitle
│   ├── subject
│   ├── gradeLevel
│   ├── estimatedDurationMinutes
│   ├── status
│   └── accessPolicy
├── visualConfig
│   ├── themeName
│   ├── tone
│   ├── missionMapLabels
│   └── optionalUiCopy
├── pedagogy
│   ├── learningObjectives
│   ├── prerequisites
│   ├── recommendedOrder
│   └── diagnosticConfig
├── missions
│   ├── slug
│   ├── title
│   ├── objective
│   ├── order
│   ├── estimatedDurationMinutes
│   ├── lessonBlocks
│   ├── requiredQuestions
│   └── optionalChallenges
├── finalSimulation
├── reportConfig
└── provenance
```

O agente deve adaptar esse modelo ao schema real já existente, sem quebrar compatibilidade sem necessidade.

---

## 14. Implementação esperada

1. Revisar tipos em `src/types/`.
2. Revisar validação em `scripts/validate-content.ts`.
3. Garantir versionamento do schema.
4. Garantir mensagens de erro úteis no validador.
5. Atualizar `CONTENT_GUIDE.md` ou criar documentação equivalente.
6. Garantir que o conteúdo piloto atual valide no novo contrato.
7. Não reescrever todo o conteúdo sem necessidade.

---

## 15. Critérios de aceite da Parte D

- [ ] Existe schema formal documentado.
- [ ] Existe `schemaVersion` ou mecanismo equivalente.
- [ ] O validador detecta campos obrigatórios ausentes.
- [ ] O validador detecta acoplamentos ou inconsistências básicas.
- [ ] O conteúdo piloto passa na validação.
- [ ] O schema permite uma segunda revisão sem alteração estrutural do motor.
- [ ] A documentação ensina como montar novo pacote de revisão.
- [ ] Os erros do validador são compreensíveis para agente autônomo e humano.

---

# PARTE E — CONFIGURAÇÃO VISUAL E PEDAGÓGICA POR REVISÃO

## 16. Objetivo da Parte E

Permitir que cada revisão tenha configuração própria sem duplicar componentes centrais.

A configuração por revisão pode incluir:

1. título exibido;
2. subtítulo;
3. componente curricular;
4. ano/série;
5. tom textual;
6. labels da jornada;
7. ordem recomendada;
8. status do simulado;
9. microcopy de botões e avisos;
10. configuração visual leve.

Não implementar sistema complexo de temas. A meta é configuração suficiente para reutilização controlada, não um construtor visual completo.

---

## 17. Critérios de aceite da Parte E

- [ ] O app lê metadados da revisão para montar telas principais.
- [ ] Títulos e textos principais não ficam hardcoded no motor.
- [ ] A configuração visual não exige dependência nova.
- [ ] O visual existente da revisão piloto é preservado.
- [ ] Uma segunda revisão pode ter título/descrição/labels próprios.
- [ ] O app não quebra se campos opcionais de visual não existirem; deve usar defaults seguros.

---

# PARTE F — SUPORTE A MÚLTIPLAS REVISÕES

## 18. Objetivo da Parte F

Garantir que o mesmo motor possa executar múltiplas revisões/assuntos no mesmo código-base.

Verificar e corrigir:

1. rotas com `[revisionSlug]`;
2. queries filtradas por revisão;
3. validação de acesso por código associado à revisão correta;
4. tentativas/progresso vinculados à revisão e missão corretas;
5. painel professor sem pressupor revisão única;
6. scripts de importação aceitando diferentes arquivos;
7. geração de códigos por revisão;
8. relatórios distinguindo revisão/assunto.

---

## 19. Critérios de aceite da Parte F

- [ ] O app suporta pelo menos duas revisões por slug.
- [ ] Código de uma revisão não libera outra revisão indevidamente.
- [ ] Progresso e tentativas são vinculados à revisão correta.
- [ ] O painel professor exibe ou filtra por revisão, se aplicável.
- [ ] Scripts aceitam arquivo de revisão parametrizado.
- [ ] O comportamento atual da revisão piloto é preservado.
- [ ] Não há pressuposto de revisão única em lógica central crítica.

---

# PARTE G — SEGUNDA REVISÃO MÍNIMA COMO PROVA DO MOTOR

## 20. Objetivo da Parte G

Criar uma segunda revisão mínima, sintética e segura, apenas para provar que o motor é reutilizável.

Sugestão de arquivo:

```txt
content/revisions/revisao-smoke-motor.json
```

Essa revisão deve:

1. ser curta;
2. usar conteúdo autoral/sintético;
3. não depender de PDF;
4. não usar material protegido;
5. ter quantidade mínima compatível com o validador;
6. conter metadados próprios;
7. conter ao menos uma missão completa com questões suficientes para validar o fluxo;
8. ser validável por script.

Não precisa ser pedagogicamente perfeita como produto final. Ela serve como prova técnica e arquitetural.

---

## 21. Critérios de aceite da Parte G

- [ ] Existe segunda revisão mínima.
- [ ] A segunda revisão tem slug próprio.
- [ ] A segunda revisão passa no validador.
- [ ] A segunda revisão não usa dados reais de aluno.
- [ ] A segunda revisão não usa conteúdo protegido de terceiros.
- [ ] O motor consegue renderizar a segunda revisão sem alteração estrutural.
- [ ] A revisão piloto original continua funcionando.

---

# PARTE H — GUIA DE CRIAÇÃO DE NOVA REVISÃO

## 22. Objetivo da Parte H

Criar documentação operacional para que agentes futuros consigam criar novas revisões sem mexer no motor.

Criar ou atualizar:

```txt
docs/content/creating-new-revision.md
```

O guia deve explicar:

1. estrutura do pacote de revisão;
2. campos obrigatórios;
3. campos opcionais;
4. padrão de slugs;
5. padrão de missões;
6. padrão de questões;
7. categorias de erro;
8. feedback pedagógico;
9. configuração visual;
10. validação;
11. importação;
12. geração de códigos;
13. revisão humana;
14. checklist antes de piloto.

---

## 23. Critérios de aceite da Parte H

- [ ] Existe guia claro para criar nova revisão.
- [ ] O guia é executável por agente autônomo.
- [ ] O guia não manda usar IA dentro do app.
- [ ] O guia preserva custo zero.
- [ ] O guia inclui revisão humana de gabaritos e feedbacks.
- [ ] O guia inclui validação automática antes de importação.
- [ ] O guia diferencia criação de conteúdo e alteração do motor.

---

# PARTE I — TESTES, BUILD E REGRESSÃO

## 24. Testes obrigatórios ao final

Executar:

```bash
npm run lint
npm run type-check
npm run build
npm run validate-content:ci
npm test
npm run validate-content content/revisions/revisao-smoke-motor.json
```

Se `revisao-smoke-motor.json` tiver outro nome, ajustar o comando e documentar.

Se algum comando não existir, não inventar sucesso. Registrar:

1. comando ausente;
2. razão;
3. alternativa executada;
4. risco residual.

---

## 25. Testes manuais mínimos

Se o agente tiver ambiente local funcional, verificar manualmente:

1. página inicial;
2. acesso por código válido controlado;
3. código inválido;
4. código expirado, se houver fixture;
5. mapa de missões da revisão piloto;
6. uma missão da revisão piloto;
7. simulado;
8. relatório;
9. painel professor;
10. segunda revisão mínima.

Se não houver Supabase remoto/local configurado, registrar bloqueio e testar o que puder com validações estáticas/build.

---

## 26. Critérios de aceite da Parte I

- [ ] Todos os comandos obrigatórios passam ou têm falha justificada.
- [ ] Build de produção passa.
- [ ] Validação do conteúdo piloto passa.
- [ ] Validação da segunda revisão passa.
- [ ] Nenhum teste existente foi removido para “fazer passar”.
- [ ] Nenhum erro de type-check foi mascarado com `any` indevido.
- [ ] Nenhuma checagem de segurança foi relaxada sem justificativa documentada.

---

# PARTE J — DOCUMENTAÇÃO E ROADMAP

## 27. Documentos que devem ser atualizados

Ao final, atualizar quando aplicável:

1. `ROADMAP.md`
2. `CHECKLISTS.md`
3. `DECISIONS.md`
4. `README.md`
5. `CONTENT_GUIDE.md`
6. `docs/architecture/motor-content-boundary.md`
7. `docs/content/creating-new-revision.md`
8. `docs/agent-reports/YYYY-MM-DD-motor-reutilizavel.md`

---

## 28. Critérios de aceite da Parte J

- [ ] `ROADMAP.md` reflete o estado real do Bloco 5.
- [ ] `CHECKLISTS.md` reflete os testes executados e pendências reais.
- [ ] Decisões arquiteturais relevantes estão registradas.
- [ ] Existe relatório final do agente.
- [ ] A documentação não promete funcionalidade que o código não entrega.
- [ ] Pendências manuais de Supabase/Vercel estão separadas de pendências de código.
- [ ] Pipeline de PDFs permanece explicitamente como etapa posterior, não implementada neste bloco.

---

# 29. Itens fora do escopo deste goal

Não implementar neste goal:

1. pipeline externo de PDFs;
2. OCR;
3. geração automática de conteúdo a partir de PDF;
4. integração com API de IA no app;
5. login completo;
6. pagamento;
7. painel administrativo completo;
8. ranking;
9. WhatsApp automático;
10. domínio próprio;
11. plano pago;
12. app mobile nativo;
13. armazenamento de foto, áudio ou vídeo de aluno.

Se algum desses itens parecer necessário, registrar como proposta futura, mas não implementar.

---

# 30. Riscos principais e mitigação

## Risco 1 — quebrar o MVP ao generalizar demais

Mitigação:

- refatorar em passos pequenos;
- manter revisão piloto funcionando;
- testar após cada ciclo;
- não reescrever componentes sem necessidade.

## Risco 2 — transformar schema em abstração excessiva

Mitigação:

- formalizar apenas o necessário para múltiplas revisões reais;
- evitar construtor visual complexo;
- preservar estrutura existente quando suficiente.

## Risco 3 — acoplar novamente a Matemática piloto

Mitigação:

- usar inventário de hardcodes;
- criar segunda revisão mínima;
- validar rotas por slug.

## Risco 4 — avançar para pipeline de PDF cedo demais

Mitigação:

- manter pipeline de PDFs fora do escopo;
- concluir Motor antes de PDF.

## Risco 5 — introduzir custo sem perceber

Mitigação:

- não adicionar serviço externo;
- não adicionar dependência paga;
- revisar `package.json`;
- revisar documentação de deploy.

---

# 31. Formato obrigatório do relatório final

Criar relatório em:

```txt
docs/agent-reports/YYYY-MM-DD-motor-reutilizavel.md
```

Modelo:

```md
# Relatório do ciclo — PR #12 + Motor Reutilizável

## 1. Resumo executivo

## 2. Estado inicial observado

## 3. PR #12
- Estado inicial:
- Decisão tomada:
- Arquivos avaliados:
- Testes executados:
- Resultado:

## 4. Implementação do motor
- Separação motor/conteúdo:
- Schema formal:
- Configuração por revisão:
- Multi-revisão:
- Segunda revisão mínima:

## 5. Arquivos criados

## 6. Arquivos alterados

## 7. Testes executados
| Comando | Resultado | Observação |
|---|---|---|

## 8. Critérios de aceite
| Critério | Status | Evidência |
|---|---|---|

## 9. Restrições confirmadas
- Custo zero: SIM/NÃO
- IA no runtime: NÃO/SIM
- Dependência paga adicionada: NÃO/SIM
- Secrets versionados: NÃO/SIM
- Dados sensíveis coletados: NÃO/SIM

## 10. Riscos residuais

## 11. Pendências manuais
- Supabase:
- Vercel:
- Revisão humana:
- Deploy/smoke test:

## 12. Próxima etapa recomendada
```

---

# 32. Mensagem de commit sugerida

Se o bloco for implementado em um único PR grande, usar:

```txt
feat(motor): separate reusable engine from revision package
```

Se separar em commits menores:

```txt
chore(deploy): resolve controlled free deploy preparation
docs(architecture): define engine and revision package boundary
feat(content): formalize revision package schema
feat(motor): support revision-level configuration
feat(motor): validate multiple revision packages
docs(content): add new revision creation guide
```

---

# 33. PR final esperado

Abrir PR contra `master` com título:

```txt
feat(motor): Bloco 5 — Motor Questão Certeira reutilizável
```

Descrição mínima:

```md
## Objetivo

Resolver o estado pendente do PR #12 e implementar o Bloco 5 do Questão Certeira Interativo: separação entre motor fixo e pacote de revisão, schema formal, configuração por revisão, suporte a múltiplas revisões e segunda revisão mínima como prova.

## Escopo

- [ ] PR #12 resolvido ou incorporado
- [ ] Fronteira motor/conteúdo documentada
- [ ] Schema formal de pacote de revisão
- [ ] Configuração por revisão
- [ ] Suporte multi-revisão
- [ ] Segunda revisão mínima
- [ ] Guia de criação de nova revisão
- [ ] Roadmap/checklists atualizados

## Fora de escopo

- Pipeline de PDFs
- IA no app
- Login completo
- Pagamento
- Deploy pago

## Testes

- [ ] npm run lint
- [ ] npm run type-check
- [ ] npm run build
- [ ] npm run validate-content:ci
- [ ] npm test
- [ ] validação da segunda revisão mínima

## Segurança/custo

- [ ] Nenhum secret versionado
- [ ] Nenhuma API paga adicionada
- [ ] Nenhuma IA em runtime
- [ ] Nenhuma coleta excessiva de dados
```

---

# 34. Regra final de parada

O agente deve parar e entregar relatório se ocorrer qualquer uma destas situações:

1. PR #12 contém risco de secret ou apagamento de dados.
2. Tests de baseline falham antes da refatoração e a causa não é trivial.
3. Refatoração exige mudança ampla de banco não prevista.
4. Supabase/Vercel exigem ação manual do proprietário.
5. Há risco de plano pago ou cobrança.
6. O agente não consegue validar que o conteúdo piloto continua funcionando.
7. A segunda revisão mínima só funciona mediante alteração hardcoded no motor.
8. O build passa apenas após remover funcionalidade ou afrouxar validação.
9. Existe conflito entre `PLANO_MATRIZ.md`, `AGENTS.md` e a implementação proposta.

Nesses casos, o agente deve entregar o que conseguiu, explicar o bloqueio e propor a próxima ação segura. Não deve forçar conclusão artificial.
