# Padrão Mínimo de Qualidade Pedagógica

Documento de referência para qualquer revisão criada no motor do Questão Certeira Interativo.

> **Princípio geral:** cada missão deve permitir que um aluno aprenda o conteúdo **do zero**, sem depender de apostila, aula externa, vídeo ou material auxiliar.

---

## 1. O que significa "do zero"

O aluno parte do pressuposto de que:

- não lembra a fórmula;
- não sabe quando usar a fórmula;
- confunde conceitos parecidos;
- precisa ver exemplos antes de resolver sozinho;
- precisa entender o motivo do erro, não só saber que errou.

A missão **não pode assumir** que o aluno já foi exposto ao conteúdo.

---

## 2. Critérios obrigatórios por missão

### 2.1 Abertura contextual (`intro`)

- Explicar **para que serve** o conteúdo da missão.
- Contextualizar onde esse conteúdo aparece na vida real ou na prova.
- Não presumir conhecimento prévio no texto de abertura.
- Usar linguagem adequada ao nível do aluno.

**Exemplo aceitável:**
> "Nesta missão, você vai aprender a identificar triângulos semelhantes sem depender de chute — e a usar isso para calcular medidas desconhecidas de figuras que você nem consegue medir diretamente."

---

### 2.2 Vocabulário e pré-requisitos (`visual_explanation` ou `concept`)

Cada missão deve ter um bloco explícito que:

- Lista e define os termos essenciais (com explicação, não só o nome).
- Identifica o pré-requisito mínimo (se houver).
- Diz o que o aluno precisa saber antes de avançar.

Use `visual_explanation` com `items` ou `concept` com texto claro.

---

### 2.3 Conceito central (`concept`)

- Explicar **a ideia** antes da fórmula.
- Usar analogia, exemplo intuitivo ou comparação concreta.
- A fórmula deve ter sentido na sequência do texto, não aparecer solta.
- O campo `highlight` exibe a fórmula/ideia central com destaque visual.

---

### 2.4 Fórmula com sentido

- Apresentar a fórmula no campo `highlight` de um bloco `concept`.
- Explicar **cada símbolo** no texto do bloco ou no bloco `visual_explanation` seguinte.
- Explicar **quando usar** e **quando não usar** (erros comuns).
- Para múltiplas fórmulas: usar separador pipe (`   |   `) para chips empilhados.
- Para fórmula única importante: envolver em `$...$` sem pipe para display centralizado.

---

### 2.5 Elemento visual obrigatório (`diagram`)

Cada missão **deve ter** pelo menos um bloco `diagram` com um diagrama SVG React que:

- Ajuda o aluno a entender o conceito visualmente.
- Tem legenda explicativa (`caption`).
- Funciona em mobile (usa `viewBox` e `w-full`).
- Não depende de imagem externa.
- Usa a identidade visual do projeto (paleta brand).

**Tipos de diagrama aceitos:**
- Diagrama geométrico (triângulo, círculo, reta numérica).
- Esquema de nomenclatura (identificando cada elemento).
- Tabela visual (valores tabelados com cores).
- Card de estratégia (fluxo de etapas).
- Mapa de decisão ("qual fórmula usar?").

---

### 2.6 Exemplos resolvidos (`worked_example`)

- **Mínimo: 2 exemplos resolvidos** por missão quando o tema exigir cálculo.
- Cada exemplo deve ter:
  - Enunciado claro no campo `problem`.
  - Passos numerados em `steps[]`, cada um explicando o raciocínio.
  - Conclusão interpretada em `conclusion` (não apenas "= X", mas "portanto o resultado é...").
- Os exemplos devem progredir em complexidade (primeiro mais simples, segundo mais elaborado).

---

### 2.7 Erros comuns (`visual_explanation`)

Cada missão deve ter um bloco `visual_explanation` explicitando erros comuns, com:

- **Mínimo: 3 erros** identificados.
- Cada erro explicado em uma linha de `items`.
- Para cada erro: o que o aluno faz errado + por que parece tentador + como evitar.
- Formato sugerido: `"Erro N — [o que faz]: [por que parece certo]. [Como evitar]."`

---

### 2.8 Prática guiada (questões)

- **Mínimo: 5 questões** por missão.
- **Deve conter** pelo menos 1 questão `basic`, 1 `intermediate`, 1 `challenge`.
- A progressão deve ser: básica → intermediária → desafio.
- Questões básicas verificam compreensão da fórmula.
- Questões intermediárias exigem aplicação com um passo extra.
- Questões challenge exigem raciocínio combinado ou interpretação de contexto.

---

### 2.9 Feedback pedagógico

**Feedback de resposta correta:**
- Deve explicar o raciocínio, não apenas confirmar o acerto.
- Exemplo: "Correto. $h^2 = m \cdot n = 4 \times 9 = 36 \Rightarrow h = 6$."

**Feedback de resposta incorreta:**
- Deve identificar o erro específico cometido (não pode ser genérico como "Resposta errada, tente novamente").
- Deve mostrar o caminho correto.
- O campo `errorCategory` deve refletir a categoria real do erro.

**Feedback mínimo:** 40 caracteres. Feedback mais curto provavelmente é genérico.

---

### 2.10 Resumo acionável (`summary`)

O bloco `summary` deve conter:

- A lista do que o aluno deve lembrar.
- A fórmula central da missão (em `$...$`).
- A estratégia de resolução (quando aplicar cada fórmula).
- Máximo de 7 pontos — se precisar de mais, divida em duas missões.

---

## 3. Critérios visuais

- Fórmulas centrais renderizam com KaTeX legível.
- Fórmulas longas com `\dfrac` não ficam espremidas em linha.
- Cada missão tem ao menos um diagrama.
- Diagramas possuem legenda (`caption`).
- Diagramas funcionam em mobile (viewport 390px).
- Não há dependência de imagem externa.

---

## 4. O que não fazer

- **Não** começar a missão jogando a fórmula sem contexto.
- **Não** presumir que o aluno sabe o que significa cada letra na fórmula.
- **Não** usar feedbacks genéricos como "Incorreto. Tente novamente."
- **Não** criar missão com questões que exigem conteúdo não explicado antes.
- **Não** criar texto corrido longo — prefira blocos pequenos e focados.
- **Não** usar jargão sem explicação.
- **Não** criar missão sem elemento visual quando o conteúdo é geométrico ou algébrico.

---

## 5. Validação automática

O script `scripts/validate-content-quality.ts` verifica automaticamente:

- Presença de `diagram` ou `visual_explanation` por missão.
- Presença de pelo menos 2 `worked_example` em revisões de Matemática.
- Presença de `hint` e `summary`.
- Presença de `[PLACEHOLDER]` (erro — não pode estar em revisão final).
- Feedbacks muito curtos (< 40 chars).
- Fórmulas prováveis sem `$...$`.
- Ausência de dificuldades `basic` e `challenge`.

Rode: `npm run validate-content:quality`

---

## 6. Reutilizabilidade

Este padrão deve ser seguido por **toda nova revisão** criada no motor.

O blueprint pedagógico (Bloco 6) deve referenciar este documento e exigir, para cada missão:

- `prerequisites` preenchido (pode ser vazio).
- `vocabulary` documentado no blueprint (ao menos como campo notes).
- `workedExamples` com mínimo 2 para Matemática.
- `commonErrors` documentado.
- Visual previsto no blueprint.
