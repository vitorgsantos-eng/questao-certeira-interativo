# provenance/ — Rastreabilidade de Origem

Cada revisão gerada pelo pipeline deve ter um arquivo de provenance correspondente.

## Schema

Ver `schema.json` neste diretório.

## Regras

- `copyrightRisk: "high"` → revisão humana obrigatória antes de qualquer uso
- `humanReviewer: null` → **não importar** para Supabase
- Material com `copyrightRisk: "high"` pode ser usado como **referência de estudo** para criar conteúdo autoral, mas o texto extraído **não pode ser versionado** nem **reproduzido diretamente**

## Exemplo sintético

Ver `examples/provenance-demo-autoral.json`.
