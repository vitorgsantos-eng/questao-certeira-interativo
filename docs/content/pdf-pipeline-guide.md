# Guia Operacional — Pipeline Externo de PDFs

**Motor Questão Certeira Interativo — Bloco 6**

Este guia descreve o pipeline completo para transformar materiais brutos (PDFs, apostilas, rascunhos) em revisões compatíveis com o motor, de forma controlada, rastreável e sem violação de direitos autorais.

---

## 0. Onde colocar cada coisa

| O que | Onde | Versionado? |
|-------|------|-------------|
| PDF bruto / apostila | `content/pipeline/raw/` | **NÃO** — gitignored |
| Texto extraído de PDF | `content/pipeline/extracted/` | **NÃO** — gitignored |
| Blueprint pedagógico | `content/pipeline/blueprints/` | Só se autoral/sintético |
| Draft JSON de revisão | `content/pipeline/drafts/` | Só se autoral/sintético |
| Provenance da fonte | `content/pipeline/provenance/` | Só exemplos sintéticos |
| Checklist preenchido | `content/pipeline/reviews/` | Só templates (sem conteúdo protegido) |
| Revisão pronta | `content/revisions/` | Sim — após aprovação |

---

## 1. Fluxo completo

```
1. Coloque o PDF em content/pipeline/raw/  (local, não commitar)
2. Extraia o texto:
   npm run pipeline:extract-pdf -- content/pipeline/raw/material.pdf

3. Leia o relatório gerado em content/pipeline/extracted/
4. Crie/preencha o provenance.json em content/pipeline/provenance/

5. Crie o blueprint pedagógico em content/pipeline/blueprints/
6. Valide o blueprint:
   npm run pipeline:validate-blueprint -- content/pipeline/blueprints/meu-blueprint.json

7. Gere o draft JSON:
   npm run pipeline:blueprint-to-revision -- content/pipeline/blueprints/meu-blueprint.json

8. Valide o draft:
   npm run validate-content -- content/pipeline/drafts/examples/revisao-demo-pipeline.json

9. Reescreva os placeholders no draft (questões, feedbacks, blocos)
10. Preencha e aprove o checklist autoral:
    content/pipeline/reviews/checklist-autoral-template.md

11. Após aprovação humana:
    cp content/pipeline/drafts/meu-draft.json content/revisions/revisao-[slug].json
    npm run validate-content -- content/revisions/revisao-[slug].json
    npm run import-revision -- content/revisions/revisao-[slug].json
```

---

## 2. O que é gitignored

Os seguintes arquivos/diretórios **nunca são versionados**:

- `content/pipeline/raw/**` — PDFs e materiais brutos
- `content/pipeline/extracted/**` — texto extraído
- `*.pdf`, `*.docx` — arquivos de origem
- `*.extracted.txt`, `*.extraction-report.json` — outputs de extração

Apenas schemas, READMEs, templates e exemplos **sintéticos/autorais** são versionados.

---

## 3. Como extrair texto de um PDF textual

```bash
npm run pipeline:extract-pdf -- content/pipeline/raw/material.pdf
```

- Funciona apenas com PDFs textuais (não escaneados).
- Para PDFs escaneados, o script alerta e sai. OCR não está disponível neste pipeline — o autor deve trabalhar manualmente.
- O texto extraído vai para `content/pipeline/extracted/` (gitignored).
- Um relatório `.extraction-report.json` é gerado com metadados da extração.

---

## 4. Como preencher o provenance

Crie um arquivo em `content/pipeline/provenance/` seguindo `provenance/schema.json`.

Campos obrigatórios:

| Campo | O que preencher |
|-------|----------------|
| `sourceId` | ID único da fonte (ex: `apostila-mat-9ano-2024`) |
| `sourceType` | `pdf-textual`, `pdf-scanned`, `own-authorship`, etc. |
| `title` | Título do material original |
| `author` | Autor ou instituição |
| `origin` | Como foi obtido, de quem, em que contexto |
| `licenseOrPermission` | Licença ou permissão explícita de uso |
| `copyrightRisk` | `low`, `medium` ou `high` |
| `allowedUse` | O que pode ser feito (referência, adaptação autoral, etc.) |
| `extractionDate` | Data no formato YYYY-MM-DD |
| `humanReviewer` | Nome de quem aprovou o uso |
| `derivedRevisionSlug` | Slug da revisão gerada (ou null) |

---

## 5. Como criar um blueprint

Ver `docs/content/blueprint-pedagogico.md` e `content/pipeline/blueprints/schema.json`.

---

## 6. Como validar um blueprint

```bash
npm run pipeline:validate-blueprint -- content/pipeline/blueprints/meu-blueprint.json
```

---

## 7. Como gerar o draft JSON

```bash
npm run pipeline:blueprint-to-revision -- content/pipeline/blueprints/meu-blueprint.json
```

O script:
- Verifica se `humanReview.approved = true`. Se não, aborta.
- Gera `content/pipeline/drafts/examples/<revisionSlug>.json` por padrão.
- As questões são **placeholders** — devem ser reescritas pelo autor.

---

## 8. Como revisar a autoria

Ver `docs/content/checklist-autoral-e-revisao-humana.md` e `content/pipeline/reviews/checklist-autoral-template.md`.

---

## 9. Como promover o draft para produção

Só após checklist autoral aprovado:

```bash
# Copiar draft para content/revisions/
cp content/pipeline/drafts/meu-draft.json content/revisions/revisao-[slug].json

# Validar
npm run validate-content -- content/revisions/revisao-[slug].json

# Importar para Supabase
npm run import-revision -- content/revisions/revisao-[slug].json
```

---

## 10. Quando NÃO importar para Supabase

- Checklist autoral não preenchido.
- Questões com placeholders não reescritos.
- `validate-content` com erros.
- `humanReview.approved = false` no blueprint.
- `copyrightRisk: "high"` sem revisão humana de copyright.
- Material bruto protegido não reescrito de forma autoral.

---

## 11. Restrições absolutas

- **Não** versionar PDFs, apostilas ou textos extraídos de material protegido.
- **Não** colocar IA no runtime do app.
- **Não** usar serviço pago de OCR.
- **Não** copiar trechos longos de material protegido para arquivos versionados.
- **Não** importar revisão sem checklist autoral aprovado.
- **Não** usar dados de alunos reais.
