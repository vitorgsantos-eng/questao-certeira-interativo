# VIT-50 — Relatório de Revisão Pedagógica: Aprendizagem Guiada do Zero

**Data:** 2026-06-19  
**Branch:** `review/vit-50-guided-learning`  
**Arquivo alterado:** `content/revisions/revisao-9ano-triangulos-sistemas.json`

---

## 1. Diagnóstico Pedagógico

Auditoria completa das 4 missões contra as questões de cada missão. Pergunta de referência para cada item: *"um aluno que nunca viu esse conteúdo consegue responder Q4 e Q5 a partir apenas do que foi ensinado?"*

### Gaps críticos encontrados

| Missão | Gap | Impacto |
|--------|-----|---------|
| M1 Semelhança | Nenhum exemplo mostrava como **calcular** lado desconhecido — só verificar semelhança | Q4 (calcular EF) fica sem scaffolding direto |
| M2 Relações Métricas | `visual_explanation` de nomenclatura (h, m, n, a, b, c) vinha **depois** do `concept` com fórmulas que já usavam essas letras | Aluno vê "h² = m·n" sem saber o que h, m e n significam |
| M2 Relações Métricas | Fórmula `h = a·b/c` usada em Q4 **não aparecia em lugar algum** na lição | Q4 fica irrespondível sem inferência não-ensinada |
| M3 Trigonometria | Só um exemplo (ângulo → lado); Q4 testa **lado → ângulo** sem nenhuma preparação | Q4 e a tabela de valores ficam sem exemplo aplicado |
| M4 Sistemas | "Sistema" não definido (aluno pode não saber o que é) | Barreira conceitual antes mesmo das questões |
| M4 Sistemas | Expansão de `(5−x)²` pulada num único passo | Erro comum de "25 − x²" sem visibilidade |
| M4 Sistemas | Identidade `(x+y)² − 2xy = x²+y²` usada em Q4 e Q5 **sem ser ensinada** | Q4 (calcular x²+y² dado x+y e xy) fica irresolúvel para o aluno |

---

## 2. Mudanças Implementadas

### M1 — Semelhança de Triângulos

**Blocos:**
- `concept`: adicionada definição da razão de semelhança k ("existe um número k — a razão de semelhança — pelo qual se multiplica qualquer lado de um para obter o lado correspondente do outro")
- `visual_explanation`: adicionado item "Lados correspondentes: os lados que ficam na mesma posição relativa nos dois triângulos"
- `worked_example` **NOVO (#3)**: exemplo completo calculando EF dado AB=6, BC=8, DE=9 → monta proporção, multiplicação cruzada, EF=12
- `hint`: expandido com instrução de como montar a proporção (lados do mesmo triângulo ficam no mesmo nível)
- `summary`: adicionado ponto operacional sobre calcular lado desconhecido por multiplicação cruzada

### M2 — Relações Métricas no Triângulo Retângulo

**Blocos:**
- `intro`: reescrita para motivar por que o assunto existe (três triângulos semelhantes gerados pela altura h)
- **REORDENAÇÃO CRÍTICA**: `visual_explanation` (nomenclatura h, m, n, a, b, c) movida para **antes** do `concept` (fórmulas)
- `concept`: texto ajustado para referenciar nomenclatura "já definida acima"
- `worked_example 1`: adicionadas linhas de abertura "Dados: ... Queremos: ..."
- `worked_example` **NOVO (#3)**: demonstra `h = a·b/c` passo a passo (a=6, b=8 → Pitágoras c=10 → h=48/10=4,8) com instrução de quando usar essa via
- `hint`: adicionada fórmula `h = a·b/c` com explicação de quando usá-la
- `summary`: adicionado ponto `h = a·b/c` (use quando conhecer catetos e hipotenusa)

### M3 — Trigonometria no Triângulo Retângulo

**Blocos:**
- `concept`: adicionado exemplo concreto ("em qualquer triângulo retângulo com 30°, a razão oposto/hipotenusa é sempre 0,5")
- `worked_example 1`: adicionada linha de abertura "Dado: α = 30°, hipotenusa = 20 cm. Queremos: cateto oposto."
- `worked_example` **NOVO (#2)**: encontrar ângulo dados catetos (oposto=3, adjacente=$3\sqrt{3}$, tg=1/√3, α=30°)
- `summary`: adicionado ponto sobre encontrar o ângulo pela tabela
- **Conversão KaTeX**: expressões `5√3`, `3√3` e `6√3` (cruas em texto de questão/opção) convertidas para `$5\sqrt{3}$`, `$3\sqrt{3}$` e `$6\sqrt{3}$`

### M4 — Sistemas com Equações do 2º Grau

**Blocos:**
- `intro`: reescrita com definição de "sistema" para alunos que podem não conhecer o termo
- `worked_example`: expansão de `(5-x)²` dividida em **dois passos** explícitos (primeiro mostra `(5-x)² = 25-10x+x²`, depois substitui); adicionado passo de verificação final
- `concept` **NOVO (identidade)**: bloco "Identidade útil: x²+y² sem calcular x e y" com `x²+y² = (x+y)² − 2xy` — ensinada antes de Q4 e Q5 usá-la
- `worked_example` **NOVO (soma/produto)**: demonstra que dado x+y=S e xy=P, os números são raízes de `t²−St+P=0`; exemplo completo x+y=7, xy=12 → t²−7t+12=0 → (t−3)(t−4)=0 → {3, 4}
- `hint`: melhorado com exemplo concreto de como subtrair duas equações do 2º grau
- `summary`: adicionado atalho da identidade e da estratégia soma/produto

---

## 3. Recomendações Visuais para VIT-51

*Registradas aqui — não implementadas nesta PR.*

| Missão | Recurso futuro |
|--------|---------------|
| M2 Relações Métricas | Diagrama SVG do triângulo retângulo com altura h e projeções m e n legendadas — elimina ambiguidade sobre "o trecho da hipotenusa embaixo de a" |
| M3 Trigonometria | Diagrama interativo com oposto/adjacente/hipotenusa se recalculando conforme o ângulo muda |
| M4 Sistemas | Animação mostrando a substituição passo a passo (linha 1 → linha 2 com y=5-x destacado) |

---

## 4. Preservação de Gabaritos

Nenhum gabarito, resposta numérica, tolerância ou categoria de erro foi alterado. Além dos blocos de lição, alguns feedbacks foram refinados pedagogicamente sem alterar alternativas corretas.

---

## 5. Preservação de KaTeX

Toda fórmula nova usa a convenção do projeto:
- Inline: `$...$`
- Frações: `\\dfrac{}{}`
- Raízes: `\\sqrt{}`
- Potências: `^`
- Vírgula decimal: `{,}` dentro de `$`
- Seno: `\\text{sen}\\,`
- Produto: `\\cdot`

---

## 6. Resultados dos Testes

| Teste | Resultado |
|-------|-----------|
| `npm run lint` | ✓ (1 warning pré-existente em `server.ts`, não relacionado) |
| `npm run type-check` | ✓ sem erros |
| `npm run build` | ✓ build completo |
| `npm run validate-content:ci` | ✓ 0 erros, 0 warnings |
| `npm test` | ✓ 13/13 passaram |

---

## 7. Conformidade com Restrições

| Restrição | Status |
|-----------|--------|
| Não fazer deploy | ✓ |
| Não importar revisão no Supabase | ✓ |
| Não gerar códigos de aluno | ✓ |
| Não alterar banco | ✓ |
| Não usar dados reais | ✓ |
| Não alterar gabaritos sem justificativa explícita | ✓ nenhum gabarito alterado |
| Não mexer em VIT-51 (exceto registrar recomendações) | ✓ registradas neste relatório |
| Não mexer em VIT-52 | ✓ |
| Não remover convenção KaTeX $...$ | ✓ toda fórmula preservada |
| Não publicar secrets | ✓ |
| Não transformar em textão excessivo | ✓ blocos enxutos |
| Não infantilizar linguagem | ✓ registro direto e técnico mantido |
