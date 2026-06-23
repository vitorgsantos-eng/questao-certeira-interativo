# blueprints/ — Blueprints Pedagógicos

Um blueprint é o formato intermediário entre o material bruto e o draft JSON final.

## Para que serve

1. Estruturar pedagogicamente o conteúdo antes de escrever o JSON final.
2. Forçar revisão humana de autoria e copyright antes da geração.
3. Servir de documentação do raciocínio pedagógico por trás da revisão.

## Schema

Ver `schema.json` neste diretório.

## Validação

```bash
npm run pipeline:validate-blueprint -- content/pipeline/blueprints/examples/blueprint-demo-autoral.json
```

## Geração de draft

Após blueprint aprovado (`humanReview.approved: true`):

```bash
npm run pipeline:blueprint-to-revision -- content/pipeline/blueprints/examples/blueprint-demo-autoral.json
```

## Exemplo sintético

Ver `examples/blueprint-demo-autoral.json`.

## Regra

Somente blueprints sintéticos/autorais são versionados aqui. Blueprints derivados de material protegido ficam localmente e **não são commitados**.
