# Relatório do Agente — Bloco 6: Pipeline Externo de PDFs

**Data:** 2026-06-23  
**Branch:** `feat/bloco6-pdf-pipeline`  
**Agente:** Claude Sonnet 4.6 (Claude Code)  
**Issues cobertas:** VIT-42, VIT-43, VIT-44, VIT-45, VIT-46, VIT-47

---

## 1. Branch usada

`feat/bloco6-pdf-pipeline` — criada a partir de `master` (commit `061e9d5` após fast-forward com PR #14).

---

## 2. Arquivos criados

### Estrutura de pipeline

```
content/pipeline/
  README.md
  .gitignore
  raw/.gitkeep
  extracted/.gitkeep
  blueprints/
    README.md
    schema.json
    examples/
      blueprint-demo-autoral.json
  drafts/
    README.md
    examples/
      revisao-demo-pipeline.json  ← gerado pelo script
  provenance/
    README.md
    schema.json
    examples/
      provenance-demo-autoral.json
  reviews/
    checklist-autoral-template.md
```

### Scripts

```
scripts/pipeline/
  extract-pdf-text.ts
  validate-blueprint.ts
  blueprint-to-revision.ts
```

### Documentação

```
docs/content/
  pdf-pipeline-guide.md
  blueprint-pedagogico.md
  checklist-autoral-e-revisao-humana.md
```

---

## 3. Arquivos alterados

| Arquivo | O que mudou |
|---------|-------------|
| `package.json` | Scripts pipeline + devDependencies `pdf-parse`, `@types/pdf-parse` |
| `ROADMAP.md` | Fase 10d com todas as tarefas do Bloco 6 marcadas |
| `CHECKLISTS.md` | Checklist do pipeline externo de PDFs adicionado |
| `DECISIONS.md` | Decisões 14–17 adicionadas (blueprint, pdf-parse, drafts, provenance) |

---

## 4. Dependências adicionadas

| Pacote | Versão | Licença | Tipo | Justificativa |
|--------|--------|---------|------|---------------|
| `pdf-parse` | `^2.4.5` | Apache-2.0 | devDependency | Extração local de PDFs textuais sem API externa, gratuito, sem custo |
| `@types/pdf-parse` | `^1.1.5` | — | devDependency | Tipos TypeScript para pdf-parse |

`npm audit --omit=dev`: 0 vulnerabilidades.

---

## 5. Comandos executados e resultados

### Baseline (antes das alterações)
```
npm ci             → OK
npm run lint       → Warning pré-existente (_table), sem novos erros
npm run type-check → OK (sem erros)
npm run build      → OK
npm run validate-content:all → 0 erros (2 revisões)
npm test           → OK (13/13 + dry-run)
```

### Demo fim a fim

```bash
npm run pipeline:validate-blueprint -- content/pipeline/blueprints/examples/blueprint-demo-autoral.json
# → 0 erros, 0 avisos — Blueprint válido

npm run pipeline:blueprint-to-revision -- content/pipeline/blueprints/examples/blueprint-demo-autoral.json
# → Draft gerado: content/pipeline/drafts/examples/revisao-demo-pipeline.json

npm run validate-content -- content/pipeline/drafts/examples/revisao-demo-pipeline.json
# → 0 error(s), 0 warning(s) — All content is valid
```

### Testes finais
```
npm run lint       → Warning pré-existente, sem novos erros
npm run type-check → OK
npm run build      → OK
npm run validate-content:all → 0 erros
npm test           → OK
npm audit --omit=dev → 0 vulnerabilidades
```

---

## 6. Estrutura final do pipeline

```
Material bruto (PDF, apostila)
  ↓ [local, não versionado]
content/pipeline/raw/

  ↓ npm run pipeline:extract-pdf
content/pipeline/extracted/ (gitignored)

  ↓ Autor preenche blueprint
content/pipeline/blueprints/meu-blueprint.json

  ↓ npm run pipeline:validate-blueprint
[valida campos, aprovação humana, copyright risk]

  ↓ npm run pipeline:blueprint-to-revision
content/pipeline/drafts/meu-draft.json

  ↓ Autor reescreve placeholders
  ↓ npm run validate-content

  ↓ Checklist autoral (reviews/checklist-autoral-template.md)
  ↓ Aprovação humana

  ↓ cp draft → content/revisions/<slug>.json
  ↓ npm run import-revision
Supabase (produção)
```

---

## 7. Como usar o pipeline

### Extração de PDF textual
```bash
cp material.pdf content/pipeline/raw/
npm run pipeline:extract-pdf -- content/pipeline/raw/material.pdf
# Texto em content/pipeline/extracted/ (gitignored)
```

### Validar blueprint
```bash
npm run pipeline:validate-blueprint -- content/pipeline/blueprints/meu-blueprint.json
```

### Gerar draft
```bash
npm run pipeline:blueprint-to-revision -- content/pipeline/blueprints/meu-blueprint.json
```

### Validar draft
```bash
npm run validate-content -- content/pipeline/drafts/examples/revisao-demo-pipeline.json
```

### Demo completo
```bash
npm run pipeline:validate-demo
```

---

## 8. Limitações conhecidas

1. **OCR não disponível.** PDFs escaneados (imagem) não têm extração de texto neste bloco. O script identifica e alerta, mas não resolve. Requer trabalho manual ou OCR local em bloco futuro.
2. **Questões são placeholders.** O script `blueprint-to-revision.ts` gera questões estruturalmente válidas mas semanticamente vazias. Toda questão deve ser reescrita pelo autor.
3. **Sem geração automática de conteúdo pedagógico.** O pipeline não usa IA — o conteúdo final é inteiramente autoral. Isso é intencional.
4. **Provenance manual.** O arquivo de provenance é criado manualmente pelo autor. Não há verificação automática de consistência entre provenance e blueprint.

---

## 9. O que ficou fora de escopo

- OCR de PDFs escaneados (requisito explicitado como fora de escopo)
- Importação automática de revisão no Supabase (requer gate humano)
- IA no pipeline ou no runtime do app
- Geração automática de questões pedagógicas reais (sem IA)
- Modificações no fluxo do aluno ou no motor
- Alterações no schema do banco Supabase

---

## 10. Riscos autorais residuais

- Drafts com placeholders não reescritos, se promovidos por engano. **Mitigado:** `validate-content` não detecta placeholders semânticos, apenas estrutura — checklist humano é obrigatório.
- Material com `copyrightRisk: "high"` usado sem revisão. **Mitigado:** validador de blueprint emite warning; script aborta se `approved: false`.
- Gabaritos incorretos em questões reescritas pelo autor. **Mitigado:** checklist autoral exige conferência de gabaritos questão por questão.

---

## 11. Próximas tarefas recomendadas

1. Criar primeira revisão real via pipeline (conteúdo autoral, não demo)
2. Adicionar OCR local gratuito (ex: `tesseract`) para PDFs escaneados em bloco futuro
3. Criar script de validação de provenance (verificar se sourceId existe)
4. Smoke test da segunda revisão (`revisao-smoke-motor`) em banco real

---

## 12. Confirmações obrigatórias

| Item | Status |
|------|--------|
| Custo zero mantido | ✅ `pdf-parse` é Apache-2.0, sem custo |
| Sem IA no runtime do app | ✅ Pipeline é 100% local e offline |
| Sem secrets | ✅ Nenhum secret versionado |
| Sem dados reais de aluno | ✅ Exemplo sintético autoral |
| Sem PDF protegido versionado | ✅ `content/pipeline/.gitignore` protege PDFs |
| Sem texto extraído de protegido versionado | ✅ `extracted/` é gitignored |
| Sem serviço pago adicionado | ✅ |
| Sem alteração no fluxo do aluno | ✅ |
| Sem alteração em produção | ✅ |
