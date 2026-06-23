# INSTRUÇÕES GOAL — BLOCO 6: PIPELINE EXTERNO DE PDFs
## Questão Certeira Interativo / Motor Questão Certeira

**Data-base:** 2026-06-23  
**Modo de execução:** Goal mode, com planejamento, execução incremental, validação e relatório final.  
**Repositório:** `vitorgsantos-eng/questao-certeira-interativo`  
**Branch-base:** `master`  
**Bloco:** 6 — Pipeline externo de PDFs  
**Objetivo do bloco:** criar uma esteira externa, rastreável, sem custo obrigatório e sem IA no runtime do app, para transformar materiais brutos/PDFs em conteúdo estruturado compatível com o Motor Questão Certeira.

---

## 1. Estado atual assumido

Antes de iniciar, considere este estado como premissa operacional:

1. O PR #13 foi mergeado e implementou o motor reutilizável.
2. O PR #14 foi mergeado e corrigiu:
   - carregamento de `.env.local` em scripts operacionais;
   - suporte a questões numéricas no simulado.
3. O app já possui deploy Vercel de produção em estado `READY`.
4. O Supabase remoto já existe e contém revisões importadas, códigos controlados e tentativas do smoke test.
5. O bloco pós-deploy/smoke test foi validado em ambiente real.
6. O próximo avanço lógico é o **pipeline externo de PDFs**, não novas funcionalidades no fluxo do aluno.

---

## 2. Objetivo macro

Implementar a base técnica e documental do pipeline externo:

```text
PDFs/materiais brutos locais
→ extração local controlada
→ texto limpo / relatório de extração
→ blueprint pedagógico intermediário
→ checklist autoral/humano
→ draft JSON compatível com o schema do motor
→ validação automática
→ relatório de prontidão para importação
```

Este bloco **não deve** colocar IA dentro do app.  
Este bloco **não deve** automatizar ingestão de PDFs protegidos sem revisão humana.  
Este bloco **não deve** depender de serviço pago.

---

## 3. Fontes obrigatórias de leitura

Antes de alterar qualquer arquivo, leia:

1. `AGENTS.md`
2. `README.md`
3. `PLANO_MATRIZ.md`
4. `ROADMAP.md`
5. `CHECKLISTS.md`
6. `CONTENT_GUIDE.md`
7. `COST_GUARDRAILS.md`, se existir
8. `DECISIONS.md`
9. `docs/architecture/motor-content-boundary.md`
10. `docs/content/creating-new-revision.md`
11. `content/schemas/revision.schema.json`
12. `content/revisions/revisao-9ano-triangulos-sistemas.json`
13. `content/revisions/revisao-smoke-motor.json`
14. `scripts/validate-content.ts`
15. `scripts/import-revision.ts`
16. `docs/agent-reports/2026-06-23-post-deploy-smoke-test.md`, se existir

Depois da leitura, escreva um plano curto antes de implementar.

---

## 4. Issues Linear relacionadas

Este bloco deve cobrir, na medida do possível:

- **VIT-42** — Definir convenção de fontes brutas e `provenance.json`
- **VIT-43** — Criar extrator local de texto de PDFs
- **VIT-44** — Definir blueprint pedagógico intermediário
- **VIT-45** — Gerar draft JSON de revisão a partir de blueprint
- **VIT-46** — Criar checklist autoral e revisão humana de conteúdo
- **VIT-47** — Importar revisão gerada por pipeline externo

Não é obrigatório fechar todas em um único PR caso isso aumente risco. Se o escopo ficar grande, entregue a base segura e proponha um segundo PR.

---

## 5. Escopo permitido

Você pode:

1. Criar diretórios de pipeline com `.gitkeep`, `README.md`, schemas e templates.
2. Atualizar `.gitignore` para bloquear PDFs, extrações, outputs temporários e dados sensíveis.
3. Criar scripts locais para:
   - extrair texto de PDFs textuais;
   - gerar relatório de extração;
   - validar blueprint pedagógico;
   - converter blueprint completo em draft JSON;
   - validar o JSON gerado contra o schema do motor.
4. Criar schemas/documentos para:
   - `provenance.json`;
   - blueprint pedagógico;
   - checklist autoral/humano;
   - fluxo de aprovação antes da importação.
5. Criar um exemplo **sintético/autoral** de blueprint e draft JSON para validar a esteira.
6. Adicionar dependências gratuitas e permissivas apenas se necessário, com justificativa.
7. Atualizar `package.json` com scripts claros, por exemplo:
   - `pipeline:extract-pdf`
   - `pipeline:validate-blueprint`
   - `pipeline:blueprint-to-revision`
   - `pipeline:validate-demo`
8. Atualizar `ROADMAP.md`, `CHECKLISTS.md` e `DECISIONS.md`.
9. Criar relatório em `docs/agent-reports/YYYY-MM-DD-bloco6-pdf-pipeline.md`.
10. Abrir PR pequeno e rastreável.

---

## 6. Fora de escopo absoluto

Não faça:

1. Não colocar IA no app do aluno.
2. Não adicionar chamadas a OpenAI, Anthropic, Gemini, Groq, Together, Mistral ou qualquer LLM no runtime.
3. Não usar API paga.
4. Não usar serviço pago de OCR.
5. Não depender de Vercel/Supabase para executar o pipeline.
6. Não alterar login, sessão, código de acesso, painel professor ou jornada do aluno.
7. Não modificar schema de banco Supabase neste bloco, salvo falha objetiva bloqueante e muito bem justificada.
8. Não versionar PDFs, apostilas, livros, provas protegidas ou textos extraídos de material protegido.
9. Não copiar longos trechos de PDFs para arquivos versionados.
10. Não criar conteúdo final derivado de material protegido sem checklist autoral/humano.
11. Não usar alunos reais.
12. Não apagar dados do Supabase.
13. Não fazer deploy manual pela Vercel.
14. Não alterar secrets, `.env.local` ou variáveis remotas.
15. Não mexer em produção.

---

## 7. Diretriz autoral e jurídica operacional

O pipeline deve auxiliar produção de conteúdo autoral, não copiar apostilas.

Regras:

1. PDFs podem ser usados como insumo privado/local para estudo, mapeamento e extração, mas:
   - PDF bruto não deve ser versionado;
   - texto extraído de material protegido não deve ser versionado;
   - conteúdo final deve ser reescrito de forma autoral;
   - deve haver rastreabilidade de origem e revisão humana.
2. Conteúdo público, licenciado ou autoral deve registrar licença/origem.
3. Toda revisão gerada por pipeline deve ter `provenance.json` ou metadado equivalente.
4. Checklist autoral deve ser obrigatório antes de importar qualquer revisão para Supabase.

---

## 8. Estrutura sugerida de diretórios

Implemente ou refine uma estrutura semelhante:

```text
content/
  pipeline/
    README.md
    .gitignore
    raw/
      .gitkeep
    extracted/
      .gitkeep
    blueprints/
      README.md
      schema.json
      examples/
        blueprint-demo-autoral.json
    drafts/
      README.md
      examples/
        revisao-demo-pipeline.json
    provenance/
      README.md
      schema.json
      examples/
        provenance-demo-autoral.json
    reviews/
      README.md
      checklist-autoral-template.md

docs/
  content/
    pdf-pipeline-guide.md
    blueprint-pedagogico.md
    checklist-autoral-e-revisao-humana.md

scripts/
  pipeline/
    extract-pdf-text.ts
    validate-blueprint.ts
    blueprint-to-revision.ts
```

A estrutura pode ser ajustada, mas precisa manter separação clara entre fontes brutas, extrações, blueprints, drafts JSON, provenance e revisão humana/autoral.

---

## 9. Tarefa A — Baseline e auditoria inicial

### Ações

1. Atualizar `master`:
   ```bash
   git checkout master
   git pull
   ```

2. Criar branch:
   ```bash
   git checkout -b feat/bloco6-pdf-pipeline
   ```

3. Rodar baseline:
   ```bash
   npm ci
   npm run lint
   npm run type-check
   npm run build
   npm run validate-content:all
   npm test
   ```

4. Registrar estado inicial no relatório do agente.

### Critérios de aceite

- Todos os comandos passam antes das alterações.
- Se algum comando falhar no baseline, pare e registre antes de implementar.
- Não prosseguir com pipeline sobre base quebrada sem corrigir ou justificar.

---

## 10. Tarefa B — Convenção de fontes brutas e provenance

### Objetivo

Criar a regra operacional para trabalhar com PDFs/materiais locais sem bagunça, sem vazamento e com rastreabilidade.

### Ações

1. Criar documentação:
   - `docs/content/pdf-pipeline-guide.md`
   - `docs/content/checklist-autoral-e-revisao-humana.md`

2. Criar estrutura:
   - `content/pipeline/raw/`
   - `content/pipeline/extracted/`
   - `content/pipeline/blueprints/`
   - `content/pipeline/drafts/`
   - `content/pipeline/provenance/`
   - `content/pipeline/reviews/`

3. Criar ou atualizar `.gitignore` para impedir versionamento de:
   - `content/pipeline/raw/**`
   - `content/pipeline/extracted/**`
   - arquivos `.pdf`
   - arquivos `.docx`, se usados como fonte bruta
   - outputs temporários
   - qualquer `students.local.json` ou dados sensíveis

4. Permitir versionar apenas:
   - `.gitkeep`;
   - `README.md`;
   - schemas;
   - templates;
   - exemplos sintéticos/autorais.

5. Criar `content/pipeline/provenance/schema.json` com campos mínimos:
   - `sourceId`
   - `sourceType`
   - `title`
   - `author`
   - `origin`
   - `licenseOrPermission`
   - `copyrightRisk`
   - `allowedUse`
   - `extractionDate`
   - `humanReviewer`
   - `notes`
   - `derivedRevisionSlug`

6. Criar exemplo sintético:
   - `content/pipeline/provenance/examples/provenance-demo-autoral.json`

### Critérios de aceite

- PDFs e textos extraídos ficam gitignored.
- Provenance tem schema e exemplo.
- Guia explica o que pode e não pode ser versionado.
- Regra autoral está explícita.
- Nenhum material protegido é adicionado ao repositório.

---

## 11. Tarefa C — Extrator local de texto de PDFs

### Objetivo

Criar um utilitário local para tentar extrair texto de PDFs textuais e gerar relatório quando não for possível.

### Ações

1. Criar script:
   - `scripts/pipeline/extract-pdf-text.ts`

2. O script deve aceitar:
   ```bash
   npm run pipeline:extract-pdf -- <arquivo.pdf>
   ```

3. O script deve:
   - receber caminho de PDF local;
   - recusar arquivo inexistente;
   - salvar texto extraído em `content/pipeline/extracted/`;
   - gerar relatório `.json` ou `.md` com nome do arquivo, data, caracteres extraídos, indicação de PDF possivelmente escaneado, caminho do output e alerta de não versionamento.

4. Se precisar de dependência:
   - usar apenas pacote gratuito;
   - verificar licença;
   - justificar no relatório;
   - rodar `npm audit`;
   - não usar dependência abandonada sem justificar.

5. O script **não precisa** fazer OCR neste bloco.

### Critérios de aceite

- Script funciona com PDF textual.
- Script falha amigavelmente para arquivo inexistente.
- Script identifica extração vazia/insuficiente como possível PDF escaneado.
- Nenhum texto extraído é versionado.
- Nenhuma API externa é chamada.
- Nenhum custo é gerado.

---

## 12. Tarefa D — Blueprint pedagógico intermediário

### Objetivo

Definir um formato intermediário entre texto extraído e revisão JSON final.

### Ações

1. Criar:
   - `content/pipeline/blueprints/schema.json`
   - `docs/content/blueprint-pedagogico.md`
   - `content/pipeline/blueprints/examples/blueprint-demo-autoral.json`

2. O blueprint deve conter, no mínimo:

```json
{
  "blueprintVersion": "1.0",
  "targetRevision": {
    "revisionSlug": "string",
    "title": "string",
    "grade": "string",
    "subject": "string",
    "description": "string"
  },
  "sourceSummary": {
    "sourceId": "string",
    "scope": "string",
    "copyrightRisk": "low|medium|high",
    "notes": "string"
  },
  "learningObjectives": ["string"],
  "missions": [
    {
      "slug": "string",
      "title": "string",
      "shortTitle": "string",
      "goal": "string",
      "estimatedMinutes": 8,
      "prerequisites": [],
      "concepts": ["string"],
      "workedExamples": [
        {
          "problem": "string",
          "steps": ["string"],
          "conclusion": "string"
        }
      ],
      "questionPlan": {
        "minimumQuestions": 5,
        "difficulties": ["basic", "intermediate", "challenge"],
        "skills": ["string"],
        "commonErrors": ["string"]
      }
    }
  ],
  "humanReview": {
    "pedagogicalReviewRequired": true,
    "copyrightReviewRequired": true,
    "approved": false,
    "reviewer": null,
    "reviewDate": null
  }
}
```

3. Criar script:
   - `scripts/pipeline/validate-blueprint.ts`

4. Adicionar script npm:
   ```json
   "pipeline:validate-blueprint": "tsx scripts/pipeline/validate-blueprint.ts"
   ```

### Critérios de aceite

- Blueprint tem schema documentado.
- Blueprint demo é sintético/autoral.
- Validador rejeita blueprint sem campos obrigatórios.
- Documentação explica o papel pedagógico do blueprint.

---

## 13. Tarefa E — Gerador de draft JSON a partir de blueprint

### Objetivo

Criar conversão controlada de blueprint para draft JSON compatível com o motor.

O script não deve inventar conteúdo pedagógico profundo. Ele deve transformar blueprint suficientemente completo em JSON inicial validável ou quase validável.

### Ações

1. Criar:
   - `scripts/pipeline/blueprint-to-revision.ts`

2. O script deve aceitar:
   ```bash
   npm run pipeline:blueprint-to-revision -- content/pipeline/blueprints/examples/blueprint-demo-autoral.json
   ```

3. O script deve gerar:
   - `content/pipeline/drafts/examples/revisao-demo-pipeline.json`
   - ou caminho informado por argumento.

4. O JSON gerado deve seguir `ContentRevisionJSON`:
   - `schemaVersion`
   - `revisionSlug`
   - `title`
   - `grade`
   - `subject`
   - `description`
   - `visualConfig`
   - `missions`
   - `blocks`
   - `questions`

5. Para o demo sintético, o draft deve ser validável por:
   ```bash
   npm run validate-content -- content/pipeline/drafts/examples/revisao-demo-pipeline.json
   ```

6. O script deve alertar se:
   - blueprint não foi aprovado;
   - faltam exemplos;
   - faltam habilidades;
   - faltam erros comuns;
   - não há base para 5 questões.

### Critérios de aceite

- Geração funciona com blueprint demo.
- Draft JSON gerado valida com 0 erros.
- Processo não altera `content/revisions/` automaticamente.
- Agente não importa o draft para Supabase.
- Draft demo é sintético/autoral.
- Não há material protegido no draft.

---

## 14. Tarefa F — Checklist autoral e revisão humana

### Objetivo

Criar gate obrigatório antes de promover um draft para revisão real.

### Ações

1. Criar:
   - `content/pipeline/reviews/checklist-autoral-template.md`
   - `docs/content/checklist-autoral-e-revisao-humana.md`

2. O checklist deve cobrir:
   - origem do material;
   - licença/permissão;
   - risco autoral;
   - reescrita autoral;
   - reprodução excessiva;
   - dados pessoais;
   - imagens/tabelas protegidas;
   - conferência de gabaritos;
   - feedbacks pedagógicos;
   - linguagem adequada;
   - aprovação humana final.

3. Incluir regra:
   - nenhum draft vira `content/revisions/*.json` sem checklist aprovado.

### Critérios de aceite

- Checklist existe e é claro.
- Checklist exige revisão humana.
- Checklist impede importação direta de material bruto.
- Documentação diferencia “fonte de estudo” de “conteúdo final autoral”.

---

## 15. Tarefa G — Demonstração fim a fim com conteúdo sintético

### Objetivo

Provar o pipeline sem depender de PDF real.

### Ações

1. Criar blueprint demo autoral simples.
2. Validar blueprint.
3. Gerar draft JSON.
4. Validar draft JSON.
5. Registrar comandos no relatório.

### Comandos esperados

```bash
npm run pipeline:validate-blueprint -- content/pipeline/blueprints/examples/blueprint-demo-autoral.json
npm run pipeline:blueprint-to-revision -- content/pipeline/blueprints/examples/blueprint-demo-autoral.json
npm run validate-content -- content/pipeline/drafts/examples/revisao-demo-pipeline.json
```

Opcionalmente:

```bash
npm run pipeline:validate-demo
```

### Critérios de aceite

- Demonstração roda localmente sem Supabase.
- Demonstração não depende de Vercel.
- Demonstração não depende de PDF protegido.
- Demonstração não usa IA.
- Demonstração gera JSON compatível com o motor.

---

## 16. Tarefa H — Documentação operacional para agentes

### Objetivo

Permitir que agentes futuros usem o pipeline sem depender de memória.

### Ações

Criar ou atualizar:

1. `docs/content/pdf-pipeline-guide.md`
2. `docs/content/blueprint-pedagogico.md`
3. `docs/content/checklist-autoral-e-revisao-humana.md`
4. `docs/content/creating-new-revision.md`
5. `README.md`, apenas se necessário
6. `ROADMAP.md`
7. `CHECKLISTS.md`
8. `DECISIONS.md`

### A documentação deve explicar

- Onde colocar PDFs locais.
- O que é gitignored.
- Como extrair texto.
- Como preencher provenance.
- Como criar blueprint.
- Como validar blueprint.
- Como gerar draft JSON.
- Como revisar autoria.
- Como promover draft para `content/revisions/`.
- Como validar conteúdo final.
- Quando importar para Supabase.
- Quando não importar.

### Critérios de aceite

- Um agente novo consegue seguir a documentação sem perguntar “qual arquivo ler agora”.
- Restrições de custo, privacidade e autoria estão explícitas.
- Não há incentivo a copiar PDFs.

---

## 17. Testes e validações obrigatórias

Ao final, rode:

```bash
npm run lint
npm run type-check
npm run build
npm run validate-content:all
npm test
```

Além disso, rode os novos scripts:

```bash
npm run pipeline:validate-blueprint -- content/pipeline/blueprints/examples/blueprint-demo-autoral.json
npm run pipeline:blueprint-to-revision -- content/pipeline/blueprints/examples/blueprint-demo-autoral.json
npm run validate-content -- content/pipeline/drafts/examples/revisao-demo-pipeline.json
```

Se criar `pipeline:validate-demo`, rode também:

```bash
npm run pipeline:validate-demo
```

Se adicionar dependência:

```bash
npm audit --omit=dev
```

### Critérios de aceite

- Todos os checks passam.
- Nenhum arquivo sensível entra no `git status`.
- Nenhum PDF real/protegido entra no commit.
- Nenhum output extraído de PDF protegido entra no commit.
- Nenhum secret entra no commit.

---

## 18. Relatório final do agente

Criar:

```text
docs/agent-reports/YYYY-MM-DD-bloco6-pdf-pipeline.md
```

O relatório deve conter:

1. Branch usada.
2. Commit(s) criados.
3. Arquivos criados/alterados.
4. Dependências adicionadas, se houver, com justificativa.
5. Comandos executados.
6. Resultado dos testes.
7. Estrutura final do pipeline.
8. Como usar o pipeline.
9. Limitações conhecidas.
10. O que ficou fora de escopo.
11. Riscos autorais restantes.
12. Próximas tarefas recomendadas.
13. Confirmações:
    - custo zero mantido;
    - sem IA no runtime;
    - sem secrets;
    - sem dados reais de aluno;
    - sem PDF protegido versionado.

---

## 19. Critérios finais de aceite do bloco

O bloco só pode ser considerado concluído se:

1. Existe estrutura de pipeline em `content/pipeline/`.
2. PDFs e textos extraídos estão protegidos por `.gitignore`.
3. Existe schema de `provenance`.
4. Existe exemplo de `provenance` sintético/autoral.
5. Existe schema de blueprint.
6. Existe exemplo de blueprint sintético/autoral.
7. Existe validador de blueprint.
8. Existe gerador de draft JSON a partir de blueprint.
9. Existe draft JSON demo validável.
10. `validate-content` aceita o draft demo com 0 erros.
11. Existe checklist autoral/humano.
12. Existe documentação operacional.
13. Existe relatório do agente.
14. `npm run lint` passa.
15. `npm run type-check` passa.
16. `npm run build` passa.
17. `npm run validate-content:all` passa.
18. `npm test` passa.
19. Nenhum PDF real/protegido foi versionado.
20. Nenhum texto extraído de PDF protegido foi versionado.
21. Nenhum segredo foi versionado.
22. Nenhum serviço pago foi adicionado.
23. Nenhuma IA foi adicionada ao app.
24. Nenhuma alteração de produção foi feita.
25. PR aberto com escopo pequeno e descrição clara.

---

## 20. Estratégia de PR

Abra um PR com título:

```text
feat(pipeline): Bloco 6 — pipeline externo de PDFs
```

Descrição mínima do PR:

```md
## Objetivo
Implementar a base do pipeline externo de PDFs do Motor Questão Certeira, sem IA no app e sem serviços pagos.

## Entregas
- Estrutura `content/pipeline/`
- Convenção de fontes brutas e provenance
- Extrator local de PDF textual
- Schema e validador de blueprint
- Gerador de draft JSON
- Checklist autoral/humano
- Demo sintético validável
- Documentação e relatório

## Fora de escopo
- OCR
- IA no runtime
- Importação automática em Supabase
- PDFs protegidos versionados
- Mudanças no fluxo do aluno
- Deploy

## Testes
- npm run lint
- npm run type-check
- npm run build
- npm run validate-content:all
- npm test
- npm run pipeline:validate-blueprint -- ...
- npm run pipeline:blueprint-to-revision -- ...
- npm run validate-content -- ...
```

Não faça merge automaticamente.

---

## 21. Stop rules

Pare e peça orientação se:

1. Precisar de API paga.
2. Precisar de OCR pago.
3. Precisar versionar PDF protegido.
4. Precisar copiar trecho longo de material protegido.
5. Precisar alterar runtime do aluno.
6. Precisar mexer em Supabase ou Vercel.
7. Precisar de segredo/env var.
8. Algum teste base falhar antes das alterações.
9. O escopo crescer para mais de um PR seguro.
10. Houver dúvida autoral relevante.

---

## 22. Resultado esperado

Ao final deste bloco, o projeto deve estar pronto para receber um material bruto local e orientar um agente/humano a produzir uma nova revisão de forma controlada, rastreável, autoral e compatível com o motor.

A entrega correta não é “ter uma revisão nova perfeita a partir de PDF”.  
A entrega correta é “ter uma esteira segura e verificável para criar revisões novas a partir de fontes externas sem contaminar o app, o repositório ou a autoria”.
