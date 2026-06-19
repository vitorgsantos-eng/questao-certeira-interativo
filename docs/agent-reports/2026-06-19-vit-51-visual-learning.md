# VIT-51 — Relatório: Recursos Visuais Didáticos

**Data:** 2026-06-19  
**Branch:** `feat/vit-51-visual-learning`  
**Arquivos alterados:**
- `src/types/index.ts`
- `scripts/validate-content.ts`
- `src/components/mission/LessonBlock.tsx`
- `src/components/visuals/SimilarTrianglesDiagram.tsx` (novo)
- `src/components/visuals/RightTriangleMetricsDiagram.tsx` (novo)
- `src/components/visuals/TrigonometryDiagram.tsx` (novo)
- `src/components/visuals/SystemsStrategyCard.tsx` (novo)
- `content/revisions/revisao-9ano-triangulos-sistemas.json`

---

## 1. Visuais Criados

### `SimilarTrianglesDiagram` — M1 Semelhança de Triângulos
- SVG com dois triângulos poligonais lado a lado
- Triângulo menor (azul) + triângulo maior (verde, ~1.6× o menor)
- Marcas de arco nos ângulos correspondentes (A↔A′, B↔B′)
- Lados do menor: a, b, c / lados do maior: ka, kb, kc
- Badge "×k" com seta entre os dois triângulos
- Legenda de cores integrada no canto superior
- `aria-label` descritivo; `<figcaption>` explicativa

### `RightTriangleMetricsDiagram` — M2 Relações Métricas (visual mais importante)
- SVG do triângulo retângulo com ângulo reto no ápice (A)
- Altitude h traçada com linha pontilhada de A até H (pé)
- Código de cores com significado fixo:
  - **Azul** → c (hipotenusa)
  - **Vermelho** → a (cateto)
  - **Verde** → b (cateto)
  - **Roxo** → h (altura)
  - **Laranja** → m (projeção esquerda)
  - **Verde-água** → n (projeção direita)
- Marcadores de ângulo reto em A e em H
- Traços de delimitação de m e n abaixo da base
- Legenda de cores na margem inferior
- Cobre o gap de ambiguidade identificado no diagnóstico pedagógico da VIT-50

### `TrigonometryDiagram` — M3 Trigonometria no Triângulo Retângulo
- SVG com ângulo reto em C (canto inferior-direito)
- Ângulo α em B (canto inferior-esquerdo) com arco de medição
- Labels: "Hipotenusa" (azul), "Cateto adjacente" (verde), "Cateto oposto" (vermelho)
- Box de fórmulas integrado: sen α = oposto/hip | cos α = adj/hip | tg α = oposto/adj
- Nota: "oposto e adjacente mudam conforme o ângulo escolhido"
- Reforça o critério de seleção da função trigonométrica

### `SystemsStrategyCard` — M4 Sistemas com Equações do 2º Grau
- Componente div/Tailwind (não SVG) — mais legível para fluxo textual
- Grid 2×2 (mobile) / 4 colunas (desktop) com as 4 etapas:
  - ① Isole | ② Substitua | ③ Simplifique | ④ Verifique
- Cartão separado: atalho soma/produto
  - x+y=S e xy=P → t²−St+P=0
  - "x e y são as raízes dessa equação"

---

## 2. Arquitetura de Integração

### Tipo `diagram` (novo bloco)
Adicionado ao sistema de tipos sem quebrar os existentes:

```typescript
// src/types/index.ts
export type DiagramId = 'similar-triangles' | 'metric-relations' | 'trigonometry' | 'systems-strategy'

export interface DiagramBlock {
  type: 'diagram'
  diagramId: DiagramId
  caption?: string
}
```

O bloco no JSON tem estrutura mínima:
```json
{
  "type": "diagram",
  "diagramId": "metric-relations",
  "caption": "Texto opcional de legenda."
}
```

### Dispatch em LessonBlock
`LessonBlock.tsx` despacha por `diagramId` com um mapa de componentes:
```tsx
case 'diagram': {
  const diagrams: Record<string, React.ReactElement> = {
    'similar-triangles': <SimilarTrianglesDiagram />,
    'metric-relations': <RightTriangleMetricsDiagram />,
    'trigonometry': <TrigonometryDiagram />,
    'systems-strategy': <SystemsStrategyCard />,
  }
  ...
}
```

Novos visuais podem ser adicionados sem alterar tipos ou validador — apenas adicionando entrada no mapa e o novo `DiagramId`.

### Validador de conteúdo
`'diagram'` adicionado a `VALID_BLOCK_TYPES`. A validação estrutural interna do bloco não é verificada pelo validador (apenas o tipo), o que é consistente com os demais blocos.

---

## 3. Posicionamento no JSON

| Missão | Posição do visual | diagramId |
|--------|-------------------|-----------|
| M1 | Antes do `visual_explanation` de critérios | `similar-triangles` |
| M2 | Antes do `visual_explanation` de nomenclatura | `metric-relations` |
| M3 | Antes do `visual_explanation` de identificação | `trigonometry` |
| M4 | Logo após o bloco `concept` de estratégia | `systems-strategy` |

---

## 4. Justificativa Pedagógica

| Visual | Justificativa |
|--------|---------------|
| M1 — Semelhança | Aluno precisa ver concretamente "mesma forma, tamanho diferente" antes de estudar os critérios. O badge ×k ancora o conceito de razão de semelhança antes de qualquer fórmula. |
| M2 — Relações Métricas | Gap crítico identificado na VIT-50: alunos liam "h² = m·n" sem saber o que h, m e n são visualmente. O código de cores fixo (azul=c, roxo=h, etc.) cria um referencial que o aluno pode consultar ao longo de toda a missão. |
| M3 — Trigonometria | A dificuldade mais comum é confundir oposto e adjacente. Ver o triângulo com os três lados rotulados em relação a α específico, com o arco marcando α, ancora a identidade de cada lado antes de escolher a função. |
| M4 — Sistemas | O fluxo visual (isole→substitua→simplifique→verifique) e o cartão soma/produto fornecem scaffolding operacional sem substituir o entendimento — o aluno vê onde cada worked_example se encaixa na sequência. |

---

## 5. Acessibilidade e Mobile

- Todos os SVGs têm `aria-label` e `role="img"`
- `SystemsStrategyCard` é div/Tailwind sem SVG — 100% responsivo e lido por leitores de tela
- SVGs usam `viewBox` relativo + `w-full max-w-md mx-auto` → escala corretamente em qualquer largura
- Nenhum texto no SVG abaixo de 9px
- Contraste de cores dentro do aceitável para uso em sala

---

## 6. Limitações

- SVGs são estáticos (não interativos) — movimentação de α não atualiza os labels de oposto/adjacente em tempo real (recomendado para VIT-52 ou posterior)
- O `RightTriangleMetricsDiagram` usa coordenadas fixas (h, m, n não refletem os valores exatos de uma questão específica) — é ilustrativo, não calculativo
- Fontes nos `<text>` SVG não herdam a fonte do projeto (Next.js não injeta fontes em SVG inline) — usam fonte do sistema
- `SystemsStrategyCard` não renderiza KaTeX nas fórmulas (texto puro); as fórmulas são simples o suficiente para não precisar

---

## 7. Recomendações Futuras

- **VIT-52 ou posterior**: `TrigonometryDiagram` interativo onde o aluno move o ângulo α e vê oposto/adjacente se atualizar
- Exportar `DiagramId` como `const` enum para evitar string typos no JSON
- Adicionar Storybook ou testes de snapshot para os componentes visuais
- Diagrama de Pitágoras (a²+b²=c²) para M2 como visual alternativo/complementar

---

## 8. Resultados dos Testes

| Teste | Resultado |
|-------|-----------|
| `npm run lint` | ✓ (1 warning pré-existente em `server.ts`) |
| `npm run type-check` | ✓ |
| `npm run build` | ✓ bundle da missão: 6,1 kB → 203 kB (esperado; SVGs inline são leves) |
| `npm run validate-content:ci` | ✓ 0 erros, 0 warnings |
| `npm test` | ✓ 47/47 |

---

## 9. Conformidade com Restrições

| Restrição | Status |
|-----------|--------|
| Não fazer deploy | ✓ |
| Não importar revisão no Supabase | ✓ |
| Não gerar códigos de aluno | ✓ |
| Não usar dados reais | ✓ |
| Não alterar gabaritos | ✓ — apenas `blocks[]` e `diagramId` adicionados |
| Não adicionar serviço pago | ✓ — SVG/React/Tailwind puro |
| Não adicionar IA no runtime | ✓ |
| Não usar imagens externas | ✓ — tudo inline |
| Não publicar secrets | ✓ |
| Não mexer em VIT-32 ou VIT-52 | ✓ |
