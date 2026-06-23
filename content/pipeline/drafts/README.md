# drafts/ — Drafts JSON de Revisão

Drafts são JSONs no formato do Motor Questão Certeira gerados a partir de blueprints aprovados.

## Regras

1. Drafts são **rascunhos** — as questões contêm placeholders que devem ser reescritos.
2. Somente exemplos **sintéticos/autorais** são versionados aqui.
3. Nenhum draft vira `content/revisions/*.json` sem checklist autoral aprovado.
4. Nenhum draft é importado para Supabase sem revisão humana completa.

## Validação

```bash
npm run validate-content -- content/pipeline/drafts/examples/revisao-demo-pipeline.json
```

## Promoção para produção

Após checklist autoral aprovado:

1. Copie o draft para `content/revisions/<slug>.json`
2. Reescreva todos os placeholders
3. Execute `npm run validate-content -- content/revisions/<slug>.json`
4. Execute `npm run import-revision -- content/revisions/<slug>.json`

## Exemplo sintético

Ver `examples/revisao-demo-pipeline.json` (gerado por `npm run pipeline:blueprint-to-revision`).
