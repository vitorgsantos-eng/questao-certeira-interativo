# Bloco de Implementação — Pós-Deploy, Supabase Real e Smoke Test Controlado

**Projeto:** Questão Certeira Interativo  
**Repositório:** `vitorgsantos-eng/questao-certeira-interativo`  
**Modo de execução:** `goal`  
**Executor previsto:** agente autônomo local, sem acesso direto aos painéis Supabase/Vercel  
**Data-base:** 2026-06-23  

---

## 1. Objetivo do bloco

Concluir a validação operacional do Questão Certeira Interativo após o deploy inicial, provando que o motor funciona em ambiente real com Supabase remoto, Vercel em produção, revisões importadas, códigos controlados e smoke test completo.

Este bloco não é uma nova fase de arquitetura. É um bloco de estabilização pós-deploy.

Ao final, deve haver evidência de que:

1. o app publicado abre corretamente em URL pública da Vercel;
2. o app está conectado ao Supabase remoto correto;
3. as revisões estruturadas foram importadas no banco real;
4. códigos de acesso controlados funcionam;
5. o fluxo aluno funciona de ponta a ponta;
6. o painel professor funciona com dados reais/fictícios controlados;
7. nenhum segredo foi versionado;
8. o MVP continua dentro da diretriz de custo zero.

---

## 2. Estado atual conhecido

### 2.1 GitHub

O PR do Bloco 5 já foi mergeado no `master`:

- PR: `#13`
- Tema: `feat(motor): Bloco 5 — Motor Questão Certeira reutilizável`
- Commit mergeado: `09b096ebdd4c8119932d5752379051f9a2aa3a62`

O motor agora possui:

- separação básica entre motor e pacote de revisão;
- `schemaVersion` obrigatório;
- `subject` e `visualConfig` no pacote de revisão;
- migration 005 para persistir metadados em `revisions`;
- segunda revisão mínima `revisao-smoke-motor`;
- CI validando todos os JSONs via `validate-content:all`.

### 2.2 Supabase

Projeto Supabase existente:

```txt
project_ref: vejvgrwdgyknazouviww
project_name: questao-certeira-interativo
url: https://vejvgrwdgyknazouviww.supabase.co
```

Chave pública para frontend:

```txt
NEXT_PUBLIC_SUPABASE_URL=https://vejvgrwdgyknazouviww.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_3ji2cssImmU8ySF38p1ppA_FCqONv-Q
```

O Supabase remoto já foi verificado fora deste agente com os seguintes achados:

- banco ativo;
- 10 tabelas principais existentes;
- RLS habilitado nas tabelas principais;
- constraint de `content_blocks.type` já aceita `diagram`;
- migration 005 já aplicada;
- colunas `schema_version`, `subject` e `visual_config` já existem em `public.revisions`;
- Supabase Security Advisor ficou limpo após revogação de execução pública da função `public.rls_auto_enable()`.

### 2.3 Vercel

Projeto Vercel detectado:

```txt
project_name: questao-certeira-interativo
project_id: prj_FgNZtxFZNf8zcZUSk80FD0n3vivU
team_id: team_nhjIlJftBMcR5EXWewCmNm9r
framework: nextjs
```

Deployment de produção detectado:

```txt
deployment_id: dpl_25Nx9EcmWLtD1TpnMwtziWhEvB8x
state: READY
target: production
url: https://questao-certeira-interativo-ohtzscfma-vitors-projects-ef82f6e5.vercel.app
canonical_domain: https://questao-certeira-interativo.vercel.app
branch_alias: https://questao-certeira-interativo-git-master-vitors-projects-ef82f6e5.vercel.app
```

### 2.4 Limitação crítica do agente

O agente **não tem acesso direto às aplicações Supabase e Vercel**.

Portanto, ele não deve tentar:

- abrir painel Supabase;
- abrir painel Vercel;
- criar projeto Supabase;
- criar projeto Vercel;
- alterar env vars diretamente na Vercel;
- buscar `SUPABASE_SERVICE_ROLE_KEY` no painel;
- rotacionar chaves;
- usar ações administrativas externas que dependam de login em painel.

O agente deve trabalhar com:

- repositório local;
- scripts do projeto;
- `.env.local` fornecido pelo proprietário;
- URL pública do deploy;
- comandos locais;
- logs locais;
- verificações HTTP públicas;
- relatório técnico final.

---

## 3. Regra operacional principal

Não avance para pipeline de PDFs, novas funcionalidades ou refatorações amplas neste bloco.

A missão é validar e estabilizar o MVP pós-deploy.

Se faltar variável sensível, chave ou dado que só o proprietário possui, o agente deve parar e pedir exatamente o item faltante.

---

## 4. Escopo permitido

O agente pode:

1. sincronizar `master` local com GitHub;
2. rodar validações locais;
3. conferir `.env.local` sem expor valores sensíveis;
4. importar revisões para Supabase remoto usando scripts existentes, se `SUPABASE_SERVICE_ROLE_KEY` estiver disponível localmente;
5. gerar códigos controlados para alunos fictícios usando scripts existentes;
6. testar URL pública do deploy;
7. testar fluxos funcionais no navegador/local/browser automation, se disponível;
8. criar relatório em `docs/agent-reports/`;
9. corrigir bugs pequenos e diretamente ligados ao smoke test;
10. abrir PR pequeno se houver correção necessária.

---

## 5. Fora de escopo

O agente não deve:

1. criar nova arquitetura;
2. iniciar pipeline de PDFs;
3. criar novas revisões reais;
4. adicionar IA dentro do app;
5. adicionar API paga;
6. adicionar pagamento;
7. criar login completo;
8. trocar Supabase por outro banco;
9. recriar o banco do zero;
10. apagar dados sem autorização expressa;
11. versionar `.env.local` ou qualquer secret;
12. expor códigos de aluno em commit, issue, PR ou relatório público;
13. alterar domínio pago ou configurar recurso pago;
14. fechar issues Linear sem evidência objetiva.

---

## 6. Variáveis de ambiente esperadas

O `.env.local` local deve existir, mas não deve ser versionado.

Valores públicos esperados:

```env
NEXT_PUBLIC_SUPABASE_URL=https://vejvgrwdgyknazouviww.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_3ji2cssImmU8ySF38p1ppA_FCqONv-Q
```

Valores sensíveis esperados, que devem ser fornecidos pelo proprietário:

```env
SUPABASE_SERVICE_ROLE_KEY=<fornecido manualmente pelo proprietário>
PROFESSOR_ACCESS_CODE=<definido pelo proprietário>
SESSION_SECRET=<segredo forte definido pelo proprietário>
```

Também pode existir, por compatibilidade:

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=<opcional se o app ainda suportar fallback>
```

### Gate obrigatório

Se qualquer uma destas variáveis estiver ausente:

- `SUPABASE_SERVICE_ROLE_KEY`
- `PROFESSOR_ACCESS_CODE`
- `SESSION_SECRET`

O agente deve parar e pedir ao proprietário para preencher. Não inventar valores definitivos.

---

## 7. Estratégia de execução

### Etapa 1 — Sincronizar repositório

Executar:

```bash
git status
git branch --show-current
git switch master
git pull origin master
```

Confirmar que o commit do PR #13 está no histórico:

```bash
git log --oneline -10
```

Critério de aceite:

- branch local em `master`;
- repositório sem alterações não intencionais;
- commit do PR #13 incorporado.

---

### Etapa 2 — Rodar validações locais

Executar:

```bash
npm ci
npm run lint
npm run type-check
npm run build
npm run validate-content:all
npm test
```

Critério de aceite:

- todos os comandos passam;
- warnings não bloqueantes devem ser registrados;
- qualquer erro deve ser corrigido antes de continuar.

---

### Etapa 3 — Verificar `.env.local`

Executar inspeção sem imprimir segredos.

Exemplo seguro:

```bash
node -e "const fs=require('fs'); const p='.env.local'; if(!fs.existsSync(p)){console.error('missing .env.local'); process.exit(1)} const s=fs.readFileSync(p,'utf8'); for (const k of ['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY','SUPABASE_SERVICE_ROLE_KEY','PROFESSOR_ACCESS_CODE','SESSION_SECRET']) console.log(k, s.includes(k+'=') ? 'present' : 'missing')"
```

Critério de aceite:

- variáveis públicas presentes;
- variáveis sensíveis presentes;
- nenhum valor sensível impresso no terminal compartilhável;
- `.env.local` permanece ignorado pelo Git.

---

### Etapa 4 — Confirmar conexão com Supabase via scripts

Sem painel Supabase, o agente deve usar os scripts do projeto ou consultas controladas via biblioteca Supabase, se já houver utilitário.

Antes de importar, rodar validação:

```bash
npm run validate-content:all
```

Depois, importar revisões:

```bash
npm run import-revision -- content/revisions/revisao-9ano-triangulos-sistemas.json
npm run import-revision -- content/revisions/revisao-smoke-motor.json
```

Critério de aceite:

- importação da revisão piloto conclui sem erro;
- importação da revisão smoke conclui sem erro;
- logs não expõem secrets;
- `schemaVersion === "1.0"` validado antes da importação;
- importador persiste `schema_version`, `subject` e `visual_config`.

Se a importação falhar por permissão, variável ausente ou conexão, registrar a causa e parar.

---

### Etapa 5 — Conferir revisões importadas

O agente deve criar uma verificação local temporária, se necessário, sem versionar secrets.

Verificar que existem pelo menos duas revisões ativas:

- `revisao-9ano-triangulos-sistemas`
- `revisao-smoke-motor`

Verificar para cada uma:

- `status = active`;
- `schema_version = 1.0`;
- `subject` preenchido quando aplicável;
- `visual_config` persistido;
- missões importadas;
- questões importadas;
- opções importadas.

Critério de aceite:

- as duas revisões aparecem no banco;
- a homepage do deploy consegue listá-las ou ao menos acessar por link direto;
- sem erro de RLS no runtime esperado.

---

### Etapa 6 — Gerar códigos controlados

Criar ou usar arquivo local não versionado:

```txt
data/students.local.json
```

O arquivo deve conter apenas alunos fictícios.

Exemplo de intenção, não necessariamente formato exato:

```json
[
  {
    "displayName": "Aluno Piloto Teste",
    "grade": "9º ano",
    "groupLabel": "smoke",
    "revisionSlug": "revisao-9ano-triangulos-sistemas"
  },
  {
    "displayName": "Aluno Smoke Motor",
    "grade": "Teste",
    "groupLabel": "smoke",
    "revisionSlug": "revisao-smoke-motor"
  }
]
```

Usar o formato real esperado por `scripts/generate-access-codes.ts`.

Executar geração conforme documentação/scripts existentes.

Critérios de aceite:

- pelo menos um código válido para revisão piloto;
- pelo menos um código válido para revisão smoke;
- códigos puros só aparecem em arquivo local controlado ou saída local temporária;
- banco armazena apenas hash;
- nenhum código real é versionado;
- nenhum aluno real é usado neste bloco.

---

### Etapa 7 — Validar deploy público

URLs conhecidas:

```txt
https://questao-certeira-interativo.vercel.app
https://questao-certeira-interativo-ohtzscfma-vitors-projects-ef82f6e5.vercel.app
https://questao-certeira-interativo-git-master-vitors-projects-ef82f6e5.vercel.app
```

Executar verificação HTTP básica:

```bash
curl -I https://questao-certeira-interativo.vercel.app
```

Critério de aceite:

- resposta HTTP 200, 301 ou 308 aceitável para redirecionamento HTTPS;
- app abre em navegador;
- HTTPS ativo;
- sem página de erro da Vercel;
- sem erro visível de variável de ambiente ausente.

---

### Etapa 8 — Smoke test funcional completo

O agente deve testar, preferencialmente por navegador automatizado se disponível, ou manualmente registrando passos.

#### 8.1 Homepage

Verificar:

- abre sem erro;
- mostra identidade visual correta;
- mostra revisão disponível ou instrução correta;
- quando revisões estão importadas, lista revisões ativas;
- `subject`/badge aparecem quando disponíveis.

#### 8.2 Acesso por código

Testar:

- código válido da revisão piloto;
- código válido da revisão smoke;
- código inválido;
- código da revisão piloto não deve liberar revisão smoke;
- código da revisão smoke não deve liberar revisão piloto.

#### 8.3 Fluxo aluno

Para pelo menos uma revisão:

- acessar mapa de missões;
- abrir missão;
- ler bloco didático;
- responder questão de múltipla escolha;
- responder questão numérica, se aplicável;
- receber feedback;
- concluir missão;
- abrir relatório.

#### 8.4 Simulado

Verificar:

- abertura do simulado;
- resposta de pelo menos uma questão;
- cálculo de resultado;
- persistência de tentativa.

#### 8.5 Painel professor

Verificar:

- login com `PROFESSOR_ACCESS_CODE`;
- visualização dos alunos fictícios;
- visualização de progresso;
- ausência de dados sensíveis indevidos.

#### 8.6 Mobile

Testar em viewport móvel ou celular real:

- homepage;
- formulário de acesso;
- mapa de missões;
- questão de múltipla escolha;
- questão numérica;
- feedback;
- relatório.

Critério de aceite:

- fluxo essencial funciona sem erro bloqueante;
- falhas menores são registradas;
- falhas bloqueantes geram correção pequena em branch separada.

---

## 8. Correções permitidas durante o bloco

Se surgir bug bloqueante, o agente pode corrigir apenas se cumprir todos os critérios:

1. bug diretamente relacionado a deploy, env, importação, código de acesso ou smoke test;
2. alteração pequena;
3. sem mudança de arquitetura;
4. sem nova dependência paga;
5. sem mexer em dados reais;
6. com testes locais passando;
7. com PR separado, se houver alteração de código.

Nome sugerido de branch:

```bash
git switch -c fix/post-deploy-smoke
```

Título sugerido de PR:

```txt
fix(deploy): ajustes pós-deploy e smoke test controlado
```

---

## 9. Relatório obrigatório

Criar relatório em:

```txt
docs/agent-reports/2026-06-23-post-deploy-smoke-test.md
```

O relatório deve conter:

1. contexto;
2. commit/branch testado;
3. URL pública do deploy;
4. Supabase project ref usado;
5. variáveis verificadas, sem valores sensíveis;
6. revisões importadas;
7. quantidade de missões/questões importadas;
8. códigos controlados gerados, sem expor código se houver risco;
9. resultados dos comandos locais;
10. resultados do smoke test;
11. evidências de mobile;
12. falhas encontradas;
13. pendências manuais;
14. confirmação de custo zero;
15. confirmação de que não houve IA no app;
16. confirmação de que nenhum secret foi versionado.

---

## 10. Critérios de aceite finais do bloco

O bloco só pode ser considerado concluído se todos os itens abaixo forem verdadeiros:

- [ ] `master` local atualizado com GitHub;
- [ ] `npm ci` executado com sucesso;
- [ ] `npm run lint` passa;
- [ ] `npm run type-check` passa;
- [ ] `npm run build` passa;
- [ ] `npm run validate-content:all` passa;
- [ ] `npm test` passa;
- [ ] `.env.local` contém variáveis necessárias, sem ser versionado;
- [ ] revisão piloto importada no Supabase remoto;
- [ ] revisão smoke importada no Supabase remoto;
- [ ] códigos controlados gerados para revisões de teste;
- [ ] deploy público abre com HTTPS;
- [ ] acesso por código válido funciona;
- [ ] código inválido falha com mensagem amigável;
- [ ] código de uma revisão não libera outra revisão;
- [ ] missão pode ser concluída;
- [ ] tentativa é persistida;
- [ ] relatório do aluno abre;
- [ ] painel professor abre e mostra dados fictícios;
- [ ] teste mobile básico realizado;
- [ ] relatório em `docs/agent-reports/` criado;
- [ ] nenhum secret versionado;
- [ ] nenhum serviço pago ativado;
- [ ] nenhuma IA adicionada ao runtime do app.

---

## 11. Condições de parada

O agente deve parar e pedir intervenção do proprietário se ocorrer qualquer item abaixo:

1. ausência de `SUPABASE_SERVICE_ROLE_KEY`;
2. ausência de `PROFESSOR_ACCESS_CODE`;
3. ausência de `SESSION_SECRET`;
4. Vercel exige configuração no painel;
5. Supabase exige ação no painel;
6. falha de permissão no banco;
7. risco de apagar dados;
8. risco de expor secret;
9. cobrança ou upgrade de plano;
10. necessidade de usar aluno real.

---

## 12. Resposta final esperada do agente

Ao final, responder com:

```md
## Resultado do bloco pós-deploy

### Estado geral
- [ ] Concluído
- [ ] Parcial
- [ ] Bloqueado

### URL testada
- ...

### Supabase
- Project ref: vejvgrwdgyknazouviww
- Revisões importadas: ...
- Códigos gerados: sim/não

### Testes locais
- npm ci: ...
- lint: ...
- type-check: ...
- build: ...
- validate-content:all: ...
- npm test: ...

### Smoke test
- Homepage: ...
- Acesso válido: ...
- Acesso inválido: ...
- Cross-revision code: ...
- Missão: ...
- Simulado: ...
- Relatório: ...
- Professor: ...
- Mobile: ...

### Arquivos alterados
- ...

### PR aberto, se houver
- ...

### Pendências
- ...

### Riscos
- ...

### Confirmações
- Custo zero mantido: sim/não
- Sem IA no app: sim/não
- Sem secrets versionados: sim/não
```

---

## 13. Próximo bloco após este

Somente depois deste bloco ser aceito, avançar para:

**Bloco 6 — Pipeline externo de PDFs**

Ordem sugerida:

1. convenção de fontes brutas e `provenance.json`;
2. extrator local de texto de PDFs;
3. blueprint pedagógico intermediário;
4. geração de draft JSON;
5. checklist autoral/revisão humana;
6. importação controlada da revisão gerada.

Não iniciar esse bloco antes do smoke test real do motor.
