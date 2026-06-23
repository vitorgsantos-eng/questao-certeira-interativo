# Convenção de Renderização Matemática

Referência oficial para autores de conteúdo e desenvolvedores do Questão Certeira Interativo.

---

## 1. Componentes disponíveis

| Componente | Arquivo | Quando usar |
|---|---|---|
| `MathText` | `src/components/math/MathText.tsx` | Texto misto (prosa + fórmula), itens de lista, feedback, enunciados |
| `MathFormulaBlock` | `src/components/math/MathFormulaBlock.tsx` | Fórmula única, centralizada, em destaque — campo `highlight` de bloco `concept` com fórmula isolada |

---

## 2. Delimitadores `$...$` (KaTeX inline)

Use `$...$` para qualquer expressão matemática dentro de texto.

**Exemplos corretos:**
```
"O valor de $x$ é $2$."
"$h^2 = m \\cdot n$ — relação da altura com as projeções."
"$\\text{sen}\\,30° = 0{,}5$"
"A hipotenusa $c = \\sqrt{a^2 + b^2}$."
```

**Quando usar `\\dfrac` em vez de `\\frac`:**
- Sempre que a fração estiver em modo inline e precisar ser legível.
- `\\dfrac` força tamanho de exibição mesmo em modo inline.
- Exemplo: `$h = \\dfrac{a \\cdot b}{c}$`

---

## 3. Fórmula em destaque (chip) — campo `highlight` com pipe

Quando o campo `highlight` de um bloco `concept` contém múltiplas fórmulas, separe-as com `   |   ` (três espaços, pipe, três espaços). `MathText` renderiza cada uma como um chip separado.

```json
"highlight": "$h^2 = m \\cdot n$   |   $a^2 = m \\cdot c$   |   $b^2 = n \\cdot c$"
```

Resultado: três chips empilhados, cada um com fundo branco, borda e texto navy.

---

## 4. Fórmula em display mode — campo `highlight` com fórmula única

Quando o campo `highlight` contém **exatamente uma fórmula** (começa com `$`, termina com `$`, sem pipe), `LessonBlock` usa `MathFormulaBlock` automaticamente — renderização centralizada e em tamanho maior.

```json
"highlight": "$(x+y)^2 = x^2 + 2xy + y^2 \\Rightarrow x^2 + y^2 = (x+y)^2 - 2xy$"
```

```json
"highlight": "$ax^2 + bx + c = 0 \\Rightarrow x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$"
```

Use display mode quando a fórmula for a **identidade central** da missão e precisar de destaque visual pleno.

---

## 5. Texto puro no `highlight`

Quando o destaque não for uma fórmula, use texto puro sem `$`. `MathText` renderiza como texto normal.

```json
"highlight": "Mesma forma = ângulos iguais + lados proporcionais."
```

---

## 6. Superfícies onde `MathText` é aplicado

| Superfície | Componente | Campo |
|---|---|---|
| Intro | `LessonBlock` → `MathText` | `text` |
| Conceito | `LessonBlock` → `MathText` | `text` |
| Destaque de conceito | `LessonBlock` → `MathText` ou `MathFormulaBlock` | `highlight` |
| Explicação visual | `LessonBlock` → `MathText` | `text`, `items[]` |
| Exemplo resolvido — problema | `LessonBlock` → `MathText` | `problem` |
| Exemplo resolvido — passos | `LessonBlock` → `MathText` | `steps[]` |
| Exemplo resolvido — conclusão | `LessonBlock` → `MathText` | `conclusion` |
| Dica | `LessonBlock` → `MathText` | `text` |
| Resumo | `LessonBlock` → `MathText` | `points[]` |
| Enunciado de questão | `MultipleChoiceQuestion`, `NumericQuestion` → `MathText` | `statement` |
| Opção de múltipla escolha | `MultipleChoiceQuestion` → `MathText` | `text` |
| Feedback | `FeedbackBox` → `MathText` | `feedback` |
| Feedback numérico | `NumericQuestion` → `MathText` | `numericFeedbackCorrect/Wrong` |

---

## 7. Padrões proibidos

- **Nunca use imagem para fórmula** — use sempre `$...$` + KaTeX.
- **Nunca use API externa** — KaTeX é local, sem chamada de rede.
- **Nunca envie LaTeX de input do usuário** para `MathText` ou `MathFormulaBlock` — o LaTeX deve vir exclusivamente do JSON de conteúdo controlado.
- **Não use `²`, `√`, `×` como texto** para fórmulas importantes — use `$...$`. O legacy unicode só existe como fallback para texto antigo não migrado.
- **Não use `\frac` sem `\d`** em modo inline quando a legibilidade for crítica — prefira `\dfrac`.
- **Não misture fórmula e texto plain** sem `$...$` delimitadores — o leitor não sabe o que é expressão e o que é texto.

---

## 8. Erros comuns de LaTeX no conteúdo

| Errado | Correto |
|---|---|
| `sen α` | `$\\text{sen}\\,\\alpha$` |
| `tg α` | `$\\text{tg}\\,\\alpha$` |
| `√144` | `$\\sqrt{144}$` |
| `a² = m·c` | `$a^2 = m \\cdot c$` |
| `h = a·b/c` | `$h = \\dfrac{a \\cdot b}{c}$` |
| `(x+y)² ≠ x²+y²` | `$(x+y)^2 \\neq x^2 + y^2$` |

---

## 9. Testando renderização

Para testar se uma fórmula está sendo renderizada corretamente:

1. Rode `npm run dev`
2. Acesse a revisão e a missão correspondente
3. Verifique se frações aparecem legíveis, raízes são visíveis, expoentes ficam sobrescritos
4. Teste em viewport 390px (mobile) — fórmulas não devem overflow horizontal
