# Checklist Autoral e Revisão Humana

**Motor Questão Certeira Interativo — Bloco 6**

---

## Princípio

O pipeline converte blueprints em drafts JSON. Os drafts contêm **placeholders** — questões, feedbacks e blocos que devem ser reescritos pelo autor antes de qualquer uso em produção.

**Nenhum draft vira `content/revisions/*.json` sem checklist autoral aprovado.**

---

## Diferença: fonte de estudo vs conteúdo final autoral

| Fonte de estudo | Conteúdo final autoral |
|----------------|----------------------|
| PDF, apostila, livro didático | JSON em `content/revisions/` |
| Usado como referência local | Reescrito pelo autor |
| **Não versionado** | **Versionado no Git** |
| Fica em `content/pipeline/raw/` | Vai para Supabase |

Um material de terceiro pode inspirar a estrutura de uma revisão, mas **o texto pedagógico final deve ser original**.

---

## Uso aceitável de material externo

| Ação | Permitido? |
|------|-----------|
| Ler apostila para entender o tema | Sim |
| Usar como referência para criar questões próprias | Sim |
| Usar contextos e situações-problema semelhantes, reescritos | Sim com cautela |
| Copiar questões diretamente | **Não** |
| Copiar explicações e feedbacks diretamente | **Não** |
| Versionar texto extraído de material protegido | **Não** |
| Importar conteúdo sem revisão humana | **Não** |

---

## Template de checklist

Ver `content/pipeline/reviews/checklist-autoral-template.md`.

Preencha uma cópia do template para cada revisão antes de promover para `content/revisions/`.

---

## Fluxo de aprovação

```
Draft gerado (com placeholders)
  ↓
Autor reescreve questões, feedbacks e blocos
  ↓
npm run validate-content -- <draft.json>    ← deve passar com 0 erros
  ↓
Preencher checklist-autoral-template.md
  ↓
Checklist aprovado pelo revisor humano
  ↓
Copiar draft para content/revisions/<slug>.json
  ↓
npm run validate-content -- content/revisions/<slug>.json
  ↓
npm run import-revision -- content/revisions/<slug>.json
```

---

## Riscos autorais residuais

Mesmo com checklist, mantenha atenção para:

1. **Paráfrase insuficiente.** Trocar algumas palavras não é reescrita autoral.
2. **Situações-problema idênticas.** Se a situação-problema é copiada de uma prova específica, há risco.
3. **Feedbacks genéricos.** Feedbacks do tipo "Errado." não são pedagógicos nem autorais.
4. **Gabaritos sem verificação.** A questão mais perigosa é a que parece certa mas tem gabarito errado.

---

## Quando NÃO prosseguir

Pare e consulte se:

- O material de origem tem `copyrightRisk: "high"` e nenhum revisor assinou.
- As questões do draft são cópias reconhecíveis de provas externas.
- O conteúdo envolve reprodução de tabelas, figuras ou imagens protegidas.
- Há dúvida sobre a titularidade do material.
