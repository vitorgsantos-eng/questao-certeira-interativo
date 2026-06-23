# content/pipeline — Pipeline Externo de PDFs

Este diretório contém a esteira de transformação de materiais brutos em revisões compatíveis com o Motor Questão Certeira.

## Fluxo

```
PDFs/materiais brutos locais (raw/ — NÃO versionado)
  → extração local controlada
  → texto limpo / relatório (extracted/ — NÃO versionado)
  → blueprint pedagógico intermediário (blueprints/ — versionado se sintético/autoral)
  → checklist autoral/humano (reviews/ — versionado como template)
  → draft JSON compatível com o motor (drafts/ — versionado se sintético/autoral)
  → validação automática (npm run validate-content)
  → promoção para content/revisions/ (manual, pós-revisão humana)
  → importação para Supabase (npm run import-revision)
```

## Estrutura

| Diretório | Conteúdo | Versionado? |
|-----------|----------|-------------|
| `raw/` | PDFs e apostilas brutas | **NÃO** — gitignored |
| `extracted/` | Texto extraído de PDFs | **NÃO** — gitignored |
| `blueprints/` | Blueprints pedagógicos intermediários | Só exemplos sintéticos/autorais |
| `drafts/` | Drafts JSON de revisão | Só exemplos sintéticos/autorais |
| `provenance/` | Rastreabilidade de origem | Só exemplos sintéticos/autorais |
| `reviews/` | Checklist autoral/humano | Template (sem conteúdo protegido) |

## Regra autoral obrigatória

- PDF bruto → **não versionar**
- Texto extraído de material protegido → **não versionar**
- Conteúdo final → deve ser **reescrito de forma autoral**
- Toda revisão → deve ter **provenance.json** ou metadado equivalente
- Checklist autoral → **obrigatório** antes de importar qualquer revisão para Supabase

## Documentação completa

- `docs/content/pdf-pipeline-guide.md` — guia operacional
- `docs/content/blueprint-pedagogico.md` — o que é e como preencher um blueprint
- `docs/content/checklist-autoral-e-revisao-humana.md` — checklist obrigatório
- `docs/content/creating-new-revision.md` — passo a passo completo
