# Guia — Como Criar uma Nova Revisão

**Motor Questão Certeira Interativo — Bloco 5**

Este guia é executável por agente autônomo e humano. Seguir na ordem.

---

## 0. Antes de começar

Ler:
- `AGENTS.md` — restrições absolutas
- `PLANO_MATRIZ.md` — princípios didáticos obrigatórios
- `docs/architecture/motor-content-boundary.md` — fronteira motor/conteúdo
- `content/schemas/revision.schema.json` — schema formal
- `content/revisions/revisao-9ano-triangulos-sistemas.json` — exemplo completo

Confirmar:
- [ ] Novo conteúdo é autoral ou com direitos garantidos
- [ ] Nenhum PDF protegido será versionado
- [ ] Nenhum dado de aluno real será incluído no JSON
- [ ] Gabaritos foram verificados por humano antes da importação

---

## 1. Criar o arquivo JSON da revisão

### 1.1 Convenção de nome

```
content/revisions/revisao-[ano]-[assunto]-[topico].json
```

Exemplos:
- `revisao-8ano-frações-algebra.json`
- `revisao-enem-geometria-analitica.json`
- `revisao-smoke-motor.json` ← sintético para smoke test

### 1.2 Campos obrigatórios do pacote

```json
{
  "schemaVersion": "1.0",
  "revisionSlug": "revisao-[slug-unico]",
  "title": "Título exibido ao aluno",
  "grade": "9º ano",
  "subject": "Matemática",
  "description": "Descrição curta do conteúdo.",
  "visualConfig": {
    "subtitle": "Subtítulo opcional",
    "subject": "Matemática",
    "tone": "performance",
    "missionMapBadge": "4 missões"
  },
  "missions": [ ... ]
}
```

Campos obrigatórios: `schemaVersion`, `revisionSlug`, `title`, `grade`, `description`, `missions`.  
Campos opcionais: `subject`, `visualConfig`.

---

## 2. Padrão de slugs

- `revisionSlug`: somente letras minúsculas, números e hífens. Exemplo: `revisao-9ano-triangulos-sistemas`
- `mission.slug`: idem. Exemplo: `semelhanca-triangulos`
- O slug deve ser **único** por entidade — nunca reutilizar um slug de revisão ou missão existente

---

## 3. Estrutura de missões

Cada missão segue obrigatoriamente:

```json
{
  "slug": "nome-da-missao",
  "title": "Título completo",
  "shortTitle": "Curto",
  "goal": "O aluno será capaz de...",
  "estimatedMinutes": 8,
  "isOptional": false,
  "prerequisites": [],
  "blocks": [ ... ],
  "questions": [ ... ],
  "challengeQuestions": [ ... ]
}
```

- `questions`: mínimo 5 questões obrigatórias
- `blocks`: deve conter ao menos um bloco `concept` e um `worked_example`
- `challengeQuestions`: opcional; se presente, todas devem ter `difficulty: "challenge"`

---

## 4. Tipos de bloco (`blocks`)

| Tipo | Uso |
|------|-----|
| `intro` | Abertura da missão — 1-2 frases de contexto |
| `concept` | Ideia antes da fórmula — explicação clara sem simbolismo excessivo |
| `visual_explanation` | Lista de passos, critérios ou itens visuais |
| `worked_example` | Problema resolvido passo a passo |
| `hint` | Dica curta e direta |
| `summary` | Resumo com pontos-chave |
| `diagram` | Referência a componente visual por `diagramId` |

---

## 5. Tipos de questão

### Múltipla escolha

```json
{
  "type": "multiple_choice",
  "difficulty": "basic",
  "skillTag": "nome-da-habilidade",
  "statement": "Enunciado da questão.",
  "options": [
    {
      "text": "Alternativa correta",
      "isCorrect": true,
      "feedback": "Explicação de por que está certo.",
      "errorCategory": null
    },
    {
      "text": "Alternativa errada",
      "isCorrect": false,
      "feedback": "Explicação de por que está errado e o que deveria pensar.",
      "errorCategory": "conceito base"
    }
  ]
}
```

- Exatamente 1 opção com `isCorrect: true`
- Opções incorretas **devem** ter `errorCategory` não-nulo
- Opção correta **deve** ter `errorCategory: null`
- Mínimo: 2 opções. Recomendado: 3-4 opções.

### Resposta numérica

```json
{
  "type": "numeric",
  "difficulty": "intermediate",
  "skillTag": "calcular-area",
  "statement": "Calcule a área do triângulo com base 6 e altura 4.",
  "correctNumericAnswer": 12,
  "tolerance": 0.1,
  "numericFeedbackCorrect": "Correto. Área = (base × altura) / 2 = (6 × 4) / 2 = 12.",
  "numericFeedbackWrong": "Não. Use a fórmula Área = (base × altura) / 2."
}
```

---

## 6. Categorias de erro (obrigatórias em opções incorretas)

```
interpretação
fórmula inadequada
identificação de elementos
operação algébrica
sinal
cálculo numérico
conceito base
pressa/chute
unidade de medida
proporção
```

---

## 7. Dificuldades

| Nível | Uso |
|-------|-----|
| `basic` | Reconhecimento direto do conceito |
| `intermediate` | Aplicação em contexto novo |
| `challenge` | Combinação de habilidades ou situação inversa |

Cada missão deve ter ao menos uma questão `basic` e uma `challenge`.

---

## 8. Padrão de feedback pedagógico

Evitar:
> ❌ "Errado. Resposta: B."

Preferir:
> ✓ "Ainda não. Você confundiu semelhança com congruência. Dois triângulos semelhantes têm a mesma forma — ângulos iguais, lados proporcionais — mas não precisam ter o mesmo tamanho."

O feedback deve:
1. Dizer o que o aluno provavelmente pensou (diagnóstico do erro)
2. Mostrar o raciocínio correto
3. Usar linguagem direta, sem condescendência

---

## 9. Linguagem

- Clara, direta, madura
- Sem infantilização ("campeão", "ótimo!", moedas)
- Sem jargão excessivo
- Tom: treino, missão, foco, resultado

---

## 10. Validação automática

```bash
npm run validate-content content/revisions/revisao-[slug].json
```

O validador verifica:
- `schemaVersion` presente e suportado
- `revisionSlug` presente e em formato correto
- `title`, `grade`, `description` presentes
- Cada missão: `concept` e `worked_example` presentes
- Cada missão: mínimo 5 questões
- Questões de múltipla escolha: exatamente 1 correta, errorCategory correto
- Questões numéricas: `correctNumericAnswer` presente
- Categorias de erro: dentro das permitidas

Nenhum erro deve ser ignorado. Warnings devem ser revisados.

---

## 11. Importação para o banco (Supabase)

Após validação local sem erros:

```bash
npm run import-revision content/revisions/revisao-[slug].json
```

Pré-requisitos:
- `.env.local` com `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
- Supabase projeto configurado com migrations rodadas

O script importa: revisão, missões, blocos de conteúdo, questões e opções.

---

## 12. Geração de códigos de acesso

Após importar a revisão, gerar códigos para os alunos:

```bash
npm run generate-codes data/students-[turma].json
```

Formato do arquivo de alunos:

```json
{
  "revisionSlug": "revisao-[slug]",
  "daysValid": 15,
  "students": [
    { "displayName": "Ana", "grade": "9A", "groupLabel": "Turma A" }
  ]
}
```

Gera um arquivo `data/access-codes-[slug]-[data].json` com os códigos. **Nunca versionar este arquivo** (está no `.gitignore`).

---

## 13. Revisão humana antes do piloto

- [ ] Gabaritos conferidos questão por questão
- [ ] Feedbacks lidos e verificados pedagogicamente
- [ ] Categorias de erro fazem sentido para o erro descrito
- [ ] Blocos de conteúdo: ideia antes da fórmula presente
- [ ] Linguagem sem infantilização
- [ ] Nenhum dado real de aluno no JSON
- [ ] Nenhum conteúdo protegido de terceiros
- [ ] Revisão importada com sucesso no banco
- [ ] Build passando após importação

---

## 14. Diferença: criação de conteúdo vs alteração do motor

| Ação | Quem faz | Arquivo afetado |
|------|---------|-----------------|
| Nova revisão | Conteúdo | `content/revisions/` + importação |
| Novo assunto/disciplina | Conteúdo | Novo JSON de revisão |
| Novo tipo de bloco | Motor | `src/types/index.ts`, `validate-content.ts`, componentes |
| Novo tipo de questão | Motor | `src/types/index.ts`, componentes, `validate-content.ts` |
| Novo campo no schema | Motor | `content/schemas/revision.schema.json`, `src/types/index.ts` |
| Bug em scoring | Motor | `src/lib/scoring/` |
| Correção de questão | Conteúdo | JSON + re-importação |

Regra: se a mudança serve a **qualquer** revisão → motor. Se serve a uma revisão **específica** → conteúdo.
