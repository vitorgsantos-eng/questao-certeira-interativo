# CONTENT_GUIDE.md — Guia de Conteúdo Pedagógico

## Tom de linguagem

**Use:**
- Frases curtas e diretas
- "Missão liberada.", "Treino rápido.", "Você dominou este passo."
- "Ainda não. Veja onde o raciocínio desviou."
- Linguagem madura, levemente desafiadora, sem infantilização

**Evite:**
- "Parabéns, campeãozinho!", "Vamos fazer continhas?"
- "Oops, tente de novo!", "Você ganhou estrelinha!"
- Jargão excessivo ou tom professoral cansativo

## Estrutura de uma missão

1. **intro** — apresentação da missão, o que o aluno vai aprender
2. **concept** — ideia antes da fórmula (sempre)
3. **visual_explanation** — listas, itens, clareza visual
4. **worked_example** — problema resolvido passo a passo
5. **hint** — dica prática
6. **summary** — resumo dos pontos principais
7. **5 questões obrigatórias** — basic, intermediate, challenge
8. **desafios extras** (opcional)

## Formato das questões

### Múltipla escolha
```json
{
  "type": "multiple_choice",
  "difficulty": "basic | intermediate | challenge",
  "skillTag": "slug-identificador",
  "statement": "Enunciado claro e completo.",
  "options": [
    {
      "text": "Opção correta",
      "isCorrect": true,
      "feedback": "Explica por que está certa.",
      "errorCategory": null
    },
    {
      "text": "Opção errada",
      "isCorrect": false,
      "feedback": "Explica o erro de forma pedagógica.",
      "errorCategory": "categoria-do-erro"
    }
  ]
}
```

### Resposta numérica
```json
{
  "type": "numeric",
  "difficulty": "intermediate",
  "skillTag": "slug",
  "statement": "Calcule o valor de x.",
  "correctNumericAnswer": 12.5,
  "tolerance": 0.1,
  "numericFeedbackCorrect": "Correto! Explica o raciocínio.",
  "numericFeedbackWrong": "Explica onde pode ter errado e qual é o resultado esperado."
}
```

## Padrão de feedback

**Nunca:**
> Errado. Resposta correta: B.

**Sempre:**
> Ainda não. Você usou Pitágoras, mas a questão pedia relação entre altura e projeções. Quando aparecem h e as projeções, use h² = m · n.

O feedback deve:
- Identificar o erro específico
- Explicar o raciocínio correto brevemente
- Não ser genérico

## Categorias de erro

Use exatamente essas categorias (em português):

| Categoria | Quando usar |
|-----------|-------------|
| `interpretação` | Aluno entendeu mal o enunciado |
| `fórmula inadequada` | Usou a fórmula errada |
| `identificação de elementos` | Confundiu cateto/hipotenusa, lados/ângulos |
| `operação algébrica` | Erro de manipulação algébrica |
| `sinal` | Erro de sinal positivo/negativo |
| `cálculo numérico` | Erro de conta |
| `conceito base` | Não entendeu o conceito fundamental |
| `pressa/chute` | Resposta sem raciocínio evidente |
| `unidade de medida` | Confusão com unidades |
| `proporção` | Erro em proporção ou razão |

## Critérios de revisão pedagógica

Antes de importar, confirme:
- [ ] A ideia vem antes da fórmula em todos os conceitos
- [ ] O exemplo guiado é resolvido passo a passo
- [ ] Cada questão tem exatamente 1 opção correta
- [ ] Cada opção errada tem feedback específico e categoria
- [ ] A linguagem está no padrão (madura, direta, sem infantilização)
- [ ] Dificuldades estão distribuídas: pelo menos 2 basic, 2 intermediate, 1 challenge
- [ ] Os gabaritos foram conferidos manualmente

## Checklist de gabarito

Para cada questão de múltipla escolha:
- [ ] Calcular a resposta independentemente
- [ ] Confirmar que a opção marcada como `isCorrect: true` está matematicamente correta
- [ ] Conferir que as opções erradas representam erros reais que alunos cometem
- [ ] Garantir que o feedback da opção errada explica o erro específico
