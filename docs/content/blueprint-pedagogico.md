# Blueprint Pedagógico — O que é e como preencher

**Motor Questão Certeira Interativo — Bloco 6 + Bloco 7**

> **Padrão de qualidade:** todo blueprint deve gerar revisões que atendam ao `docs/content/quality-standard.md`. Leia esse documento antes de criar um blueprint.

---

## O que é um blueprint

Um blueprint pedagógico é um documento intermediário entre o material bruto e o JSON final de revisão. Ele captura a **intenção pedagógica** da revisão: o que o aluno deve aprender, como os conceitos serão apresentados e como as questões serão planejadas.

O blueprint **não** é o JSON final. Ele é preenchido pelo autor e validado antes da geração automática do draft.

---

## Por que usar um blueprint

1. **Separa pensar de escrever.** O autor decide a estrutura pedagógica antes de escrever cada questão.
2. **Força revisão humana.** O blueprint só gera draft se `humanReview.approved = true`.
3. **Rastrea origem.** O `sourceSummary` liga o blueprint à sua fonte no `provenance.json`.
4. **Documenta intenção.** Futuros revisores entendem por que cada missão existe.

---

## Schema

Ver `content/pipeline/blueprints/schema.json`.

## Exemplo completo

Ver `content/pipeline/blueprints/examples/blueprint-demo-autoral.json`.

---

## Campos obrigatórios

### `blueprintVersion`
Atualmente: `"1.0"`.

### `targetRevision`
Define a revisão que será gerada:

```json
{
  "revisionSlug": "revisao-7ano-proporcionalidade",
  "title": "Proporcionalidade e Regra de Três — 7º Ano",
  "grade": "7º ano",
  "subject": "Matemática",
  "description": "Revisão sobre grandezas proporcionais e regra de três simples."
}
```

O `revisionSlug` deve ser único no projeto e seguir o padrão `revisao-[ano]-[assunto]`.

### `sourceSummary`
Rastreia a origem do material:

```json
{
  "sourceId": "apostila-mat-7ano-2024",
  "scope": "Capítulos 4 e 5 — proporcionalidade",
  "copyrightRisk": "medium",
  "notes": "Material usado como referência de estudo. Conteúdo final será reescrito."
}
```

- `copyrightRisk: "high"` → revisão de copyright obrigatória antes de gerar draft.
- O `sourceId` deve existir em `content/pipeline/provenance/`.

### `learningObjectives`
Lista de objetivos de aprendizagem. Mínimo: 1.

```json
[
  "Identificar grandezas diretamente e inversamente proporcionais.",
  "Aplicar regra de três simples em contextos práticos."
]
```

### `missions`
Array de missões. Cada missão tem:

| Campo | Descrição |
|-------|-----------|
| `slug` | Identificador único em `kebab-case` |
| `title` | Título completo |
| `shortTitle` | Título curto para exibição |
| `goal` | "O aluno será capaz de..." |
| `estimatedMinutes` | 1–30 |
| `prerequisites` | Slugs de missões anteriores (array, pode ser vazio) |
| `concepts` | Lista de conceitos a apresentar (mínimo 1) |
| `workedExamples` | Lista de exemplos resolvidos (mínimo 1) |
| `questionPlan` | Planejamento das questões |

**`questionPlan`:**

```json
{
  "minimumQuestions": 5,
  "difficulties": ["basic", "intermediate", "challenge"],
  "skills": ["identificar-proporcao-direta", "montar-regra-de-tres"],
  "commonErrors": ["Inverter a proporção", "Confundir proporção direta com inversa"]
}
```

> **Padrão mínimo (Bloco 7):** o blueprint deve documentar, para cada missão:
> - `prerequisites` — lista de pré-requisitos do aluno (pode ser `[]`).
> - `concepts` — ao menos 1 conceito central com explicação (não só o nome).
> - `workedExamples` — ao menos 2 para revisões de Matemática.
> - `questionPlan.commonErrors` — ao menos 3 erros comuns previstos.
> - Visual previsto: que tipo de diagrama ou elemento visual acompanhará a missão.

### `humanReview`
Gate obrigatório antes de gerar draft:

```json
{
  "pedagogicalReviewRequired": true,
  "copyrightReviewRequired": false,
  "approved": true,
  "reviewer": "Vitor",
  "reviewDate": "2026-06-23"
}
```

- `approved: false` → o script `blueprint-to-revision.ts` **aborta**.
- `copyrightReviewRequired: true` com `reviewer: null` → **aborta**.

---

## Validação do blueprint

```bash
npm run pipeline:validate-blueprint -- content/pipeline/blueprints/meu-blueprint.json
```

Erros comuns:
- `approved: false` → preencha `reviewer` e `reviewDate` após revisar
- `minimumQuestions < 5` → ajuste o `questionPlan`
- `concepts` vazio → descreva pelo menos 1 conceito central
- `workedExamples < 2` (Matemática) → inclua ao menos 2 exemplos resolvidos
- `commonErrors < 3` → documente ao menos 3 erros comuns
- `difficulties` sem `basic`, `intermediate` ou `challenge` → inclua as 3 dificuldades

## Validação da revisão gerada

Após gerar o draft e revisar o conteúdo, valide a qualidade pedagógica:

### Modo diagnóstico

Audita todo o diretório de revisões. Warnings não bloqueiam (exit 0). Use para diagnóstico:

```bash
npm run validate-content:quality
```

### Modo estrito

Warnings **bloqueiam** (exit 1). Obrigatório para a revisão piloto e para qualquer revisão antes de importar para produção:

```bash
npm run validate-content:quality:pilot
```

A revisão piloto (`revisao-9ano-triangulos-sistemas.json`) é sempre validada em modo estrito no CI (`npm run validate-content:quality:pilot`). Toda nova revisão que entrar no CI deve também passar nesse padrão — adicione um script `validate-content:quality:<slug>` equivalente em `package.json`.

---

## Critérios de qualidade pedagógica exigidos

Antes de marcar `approved: true`, confirme que o blueprint atende:

| Critério | Campo do blueprint |
|----------|-------------------|
| Missão tem abertura contextual definida | `missions[].concepts` ou notes |
| Vocabulário e pré-requisitos documentados | `missions[].prerequisites` + concepts |
| Ao menos 1 conceito central com sentido | `missions[].concepts` (≥1) |
| Exemplos resolvidos planejados (≥2 para Matemática) | `missions[].workedExamples` (≥2) |
| Erros comuns mapeados (≥3) | `missions[].questionPlan.commonErrors` (≥3) |
| Visual previsto | notes ou campo adicional |
| Feedbacks pedagógicos planejados | `missions[].questionPlan.skills` |
| Progressão basic → intermediate → challenge | `missions[].questionPlan.difficulties` |

Ver detalhes em `docs/content/quality-standard.md`.

---

## Diferença: blueprint vs draft vs revisão

| Artefato | Onde fica | Quem cria | Quando usar |
|----------|-----------|-----------|-------------|
| Blueprint | `content/pipeline/blueprints/` | Autor + script | Antes de gerar o JSON |
| Draft | `content/pipeline/drafts/` | Script gerador | Rascunho com placeholders |
| Revisão | `content/revisions/` | Autor (pós-checklist) | Após revisão humana completa |
