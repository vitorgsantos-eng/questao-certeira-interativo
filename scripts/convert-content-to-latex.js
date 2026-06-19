// One-shot script: converts math expressions in the revision JSON to LaTeX $...$ delimiters.
// Run with: node scripts/convert-content-to-latex.js
// Safe to run multiple times (idempotent — won't double-convert already-converted strings).

const fs = require('fs')
const path = require('path')

const FILE = path.join(__dirname, '../content/revisions/revisao-9ano-triangulos-sistemas.json')

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'))

// Walk and transform every string value in the JSON tree
function transform(obj) {
  if (typeof obj === 'string') return convertMath(obj)
  if (Array.isArray(obj)) return obj.map(transform)
  if (obj && typeof obj === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(obj)) out[k] = transform(v)
    return out
  }
  return obj
}

// All string replacements. Each entry: [exactOldString, exactNewString]
// Applied in order. Skip if string already contains '$' (already converted).
const REPLACEMENTS = [
  // ─── MISSION 1: Semelhança ────────────────────────────────────────────────

  // Q3 feedback (correct): proportion feedback
  [
    'Correto. AB/DE = BC/EF → 6/9 = 8/x → x = 8 × 9 ÷ 6 = 12.',
    'Correto. $\\frac{AB}{DE} = \\frac{BC}{EF} \\Rightarrow \\frac{6}{9} = \\frac{8}{x} \\Rightarrow x = 8 \\times 9 \\div 6 = 12$.',
  ],
  [
    'Cuidado no cálculo. A proporção é AB/DE = BC/EF. Substitua: 6/9 = 8/x → 6x = 72 → x = 12.',
    'Cuidado no cálculo. A proporção é $\\frac{AB}{DE} = \\frac{BC}{EF}$. Substitua: $\\frac{6}{9} = \\frac{8}{x} \\Rightarrow 6x = 72 \\Rightarrow x = 12$.',
  ],
  // Q3 option D text
  [
    'x = 16/3 ≈ 5,3',
    '$x = \\frac{16}{3} \\approx 5{,}3$',
  ],
  // Q3 option D feedback
  [
    'Parece que você inverteu a razão: usou 6/9 = 2/3 em vez de 9/6 = 3/2. Isso levaria a x = 8 × (2/3) = 16/3 ≈ 5,3. Como o segundo triângulo é maior, a razão correta é 9/6 = 3/2, então x = 8 × (3/2) = 12.',
    'Parece que você inverteu a razão: usou $\\frac{6}{9} = \\frac{2}{3}$ em vez de $\\frac{9}{6} = \\frac{3}{2}$. Isso levaria a $x = 8 \\times \\frac{2}{3} = \\frac{16}{3} \\approx 5{,}3$. Como o segundo triângulo é maior, a razão correta é $\\frac{9}{6} = \\frac{3}{2}$, então $x = 8 \\times \\frac{3}{2} = 12$.',
  ],
  // Q4 (árvore/poste) feedbacks
  [
    'Correto. Os triângulos formados pela luz do sol são semelhantes. Árvore/sombra-árvore = Poste/sombra-poste → h/8 = 3/4 → h = 6 m.',
    'Correto. Os triângulos formados pela luz do sol são semelhantes. $\\dfrac{\\text{Árvore}}{\\text{sombra}} = \\dfrac{\\text{Poste}}{\\text{sombra}} \\Rightarrow \\dfrac{h}{8} = \\dfrac{3}{4} \\Rightarrow h = 6$ m.',
  ],
  [
    'Você pode ter multiplicado em vez de dividir. A proporção é h/8 = 3/4. Resolvendo: h = 3 × 8 ÷ 4 = 6 m.',
    'Você pode ter multiplicado em vez de dividir. A proporção é $\\frac{h}{8} = \\frac{3}{4}$. Resolvendo: $h = 3 \\times 8 \\div 4 = 6$ m.',
  ],
  [
    'Verifique se você inverteu sombra e altura. A proporção correta é objeto/sombra = objeto/sombra. h/8 = 3/4 → h = 6 m.',
    'Verifique se você inverteu sombra e altura. A proporção correta é objeto/sombra = objeto/sombra. $\\frac{h}{8} = \\frac{3}{4} \\Rightarrow h = 6$ m.',
  ],
  [
    'Talvez tenha sombreado 8-3 = 5. Mas o método correto é proporção: h/8 = 3/4 → h = 6 m.',
    'Talvez tenha sombreado 8−3 = 5. Mas o método correto é proporção: $\\frac{h}{8} = \\frac{3}{4} \\Rightarrow h = 6$ m.',
  ],

  // ─── MISSION 2: Relações Métricas ─────────────────────────────────────────

  // Highlight block: metric relations
  [
    'h² = m · n   |   a² = m · c   |   b² = n · c',
    '$h^2 = m \\cdot n$   |   $a^2 = m \\cdot c$   |   $b^2 = n \\cdot c$',
  ],
  // Q1 feedback: (m+n)/2
  [
    'Você pode ter usado h = (m+n)/2 = 13/2 = 6,5. Mas a relação correta é h² = m · n, não a média aritmética.',
    'Você pode ter usado $h = \\frac{m+n}{2} = \\frac{13}{2} = 6{,}5$. Mas a relação correta é $h^2 = m \\cdot n$, não a média aritmética.',
  ],
  // Q3 feedbacks: h²/m
  [
    'Você pode ter subtraído h - m = 6 - 4 = 2. A relação é h² = m · n. Portanto n = h²/m = 36/4 = 9.',
    'Você pode ter subtraído h − m = 6 − 4 = 2. A relação é $h^2 = m \\cdot n$. Portanto $n = \\frac{h^2}{m} = \\frac{36}{4} = 9$.',
  ],
  [
    'Você dividiu h por m em vez de h² por m. n = h²/m = 36/4 = 9, não h/m = 6/4 = 1,5.',
    'Você dividiu h por m em vez de $h^2$ por m. $n = \\frac{h^2}{m} = \\frac{36}{4} = 9$, não $\\frac{h}{m} = \\frac{6}{4} = 1{,}5$.',
  ],
  // Q4 numeric feedbacks: (a·b)/c
  [
    'Correto! c = √(36+64) = 10. h = (a·b)/c = (6×8)/10 = 4,8.',
    'Correto! $c = \\sqrt{36+64} = 10$. $h = \\dfrac{a \\cdot b}{c} = \\dfrac{6 \\times 8}{10} = 4{,}8$.',
  ],
  [
    'Primeiro calcule c = √(6²+8²) = √100 = 10. Depois use h = (a·b)/c = 48/10 = 4,8.',
    'Primeiro calcule $c = \\sqrt{6^2+8^2} = \\sqrt{100} = 10$. Depois use $h = \\dfrac{a \\cdot b}{c} = \\dfrac{48}{10} = 4{,}8$.',
  ],
  // Q5 challenge: 60/13
  [
    'h = 60/13 ≈ 4,6',
    '$h = \\dfrac{60}{13} \\approx 4{,}6$',
  ],
  [
    'Correto. b = √(13²−5²) = √(169−25) = √144 = 12. h = (a·b)/c = (5×12)/13 = 60/13 ≈ 4,62.',
    'Correto. $b = \\sqrt{13^2-5^2} = \\sqrt{169-25} = \\sqrt{144} = 12$. $h = \\dfrac{a \\cdot b}{c} = \\dfrac{5 \\times 12}{13} = \\dfrac{60}{13} \\approx 4{,}62$.',
  ],
  [
    'h não é igual ao cateto a. Calcule b = 12 primeiro, depois h = (5×12)/13 = 60/13.',
    'h não é igual ao cateto a. Calcule $b = 12$ primeiro, depois $h = \\dfrac{5 \\times 12}{13} = \\dfrac{60}{13}$.',
  ],
  [
    'Verifique o cálculo. b = √(169−25) = 12. h = a·b/c = 60/13 ≈ 4,6, não 6.',
    'Verifique o cálculo. $b = \\sqrt{169-25} = 12$. $h = \\dfrac{a \\cdot b}{c} = \\dfrac{60}{13} \\approx 4{,}6$, não 6.',
  ],
  [
    'Talvez tenha calculado h = a/2 = 5/2 = 2,5. A fórmula correta é h = (a·b)/c. Calcule b = √(13²−5²) = 12 e use h = 60/13 ≈ 4,6.',
    'Talvez tenha calculado $h = \\frac{a}{2} = \\frac{5}{2} = 2{,}5$. A fórmula correta é $h = \\dfrac{a \\cdot b}{c}$. Calcule $b = \\sqrt{13^2-5^2} = 12$ e use $h = \\dfrac{60}{13} \\approx 4{,}6$.',
  ],

  // ─── MISSION 3: Trigonometria ─────────────────────────────────────────────

  // Highlight block: trig definitions
  [
    'sen α = cateto oposto / hipotenusa   |   cos α = cateto adjacente / hipotenusa   |   tg α = cateto oposto / cateto adjacente',
    '$\\text{sen}\\,\\alpha = \\dfrac{\\text{cateto oposto}}{\\text{hipotenusa}}$   |   $\\text{cos}\\,\\alpha = \\dfrac{\\text{cateto adjacente}}{\\text{hipotenusa}}$   |   $\\text{tg}\\,\\alpha = \\dfrac{\\text{cateto oposto}}{\\text{cateto adjacente}}$',
  ],
  // Trig values table items (single | not triple, so convert | to comma and add LaTeX)
  [
    '30°: sen = 0,5 | cos = √3/2 ≈ 0,866 | tg = 1/√3 ≈ 0,577',
    '30°: sen = 0,5,  cos = $\\dfrac{\\sqrt{3}}{2} \\approx 0{,}866$,  tg = $\\dfrac{1}{\\sqrt{3}} \\approx 0{,}577$',
  ],
  [
    '45°: sen = √2/2 ≈ 0,707 | cos = √2/2 ≈ 0,707 | tg = 1',
    '45°: sen = $\\dfrac{\\sqrt{2}}{2} \\approx 0{,}707$,  cos = $\\dfrac{\\sqrt{2}}{2} \\approx 0{,}707$,  tg = 1',
  ],
  [
    '60°: sen = √3/2 ≈ 0,866 | cos = 0,5 | tg = √3 ≈ 1,732',
    '60°: sen = $\\dfrac{\\sqrt{3}}{2} \\approx 0{,}866$,  cos = 0,5,  tg = $\\sqrt{3} \\approx 1{,}732$',
  ],
  // Worked example step
  [
    'sen 30° = cateto oposto / hipotenusa',
    '$\\text{sen}\\, 30° = \\dfrac{\\text{cateto oposto}}{\\text{hipotenusa}}$',
  ],
  // Summary points
  [
    'sen α = oposto/hipotenusa → use quando envolver oposto e hipotenusa.',
    '$\\text{sen}\\,\\alpha = \\dfrac{\\text{oposto}}{\\text{hipotenusa}}$ → use quando envolver oposto e hipotenusa.',
  ],
  [
    'cos α = adjacente/hipotenusa → use quando envolver adjacente e hipotenusa.',
    '$\\text{cos}\\,\\alpha = \\dfrac{\\text{adjacente}}{\\text{hipotenusa}}$ → use quando envolver adjacente e hipotenusa.',
  ],
  [
    'tg α = oposto/adjacente → use quando não envolve a hipotenusa.',
    '$\\text{tg}\\,\\alpha = \\dfrac{\\text{oposto}}{\\text{adjacente}}$ → use quando não envolve a hipotenusa.',
  ],
  // Q1 option texts
  [
    'Cosseno: cos α = adjacente/hipotenusa',
    'Cosseno: $\\text{cos}\\,\\alpha = \\dfrac{\\text{adjacente}}{\\text{hipotenusa}}$',
  ],
  [
    'Seno: sen α = oposto/hipotenusa',
    'Seno: $\\text{sen}\\,\\alpha = \\dfrac{\\text{oposto}}{\\text{hipotenusa}}$',
  ],
  [
    'Tangente: tg α = oposto/adjacente',
    'Tangente: $\\text{tg}\\,\\alpha = \\dfrac{\\text{oposto}}{\\text{adjacente}}$',
  ],
  // Q3 feedback: tg 45° = 1/√3 type
  [
    'Correto. tg α = 5/(5√3) = 1/√3 ≈ 0,577. Portanto α = arctg(1/√3) = 30°.',
    'Correto. $\\text{tg}\\,\\alpha = \\dfrac{5}{5\\sqrt{3}} = \\dfrac{1}{\\sqrt{3}} \\approx 0{,}577$. Portanto $\\alpha = \\text{arctg}\\left(\\dfrac{1}{\\sqrt{3}}\\right) = 30°$.',
  ],
  [
    'tg 60° = √3 ≈ 1,73. Mas tg α = 5/(5√3) = 1/√3, que corresponde a 30°.',
    '$\\text{tg}\\, 60° = \\sqrt{3} \\approx 1{,}73$. Mas $\\text{tg}\\,\\alpha = \\dfrac{5}{5\\sqrt{3}} = \\dfrac{1}{\\sqrt{3}}$, que corresponde a 30°.',
  ],
  [
    'tg 45° = 1, o que exigiria oposto = adjacente. Aqui o adjacente é √3 vezes maior, então α = 30°.',
    '$\\text{tg}\\, 45° = 1$, o que exigiria oposto = adjacente. Aqui o adjacente é $\\sqrt{3}$ vezes maior, então α = 30°.',
  ],
  [
    'α não pode ser 90° em um ângulo de triângulo retângulo que não seja o ângulo reto. Calcule tg α = 1/√3 → α = 30°.',
    'α não pode ser 90° em um ângulo de triângulo retângulo que não seja o ângulo reto. Calcule $\\text{tg}\\,\\alpha = \\dfrac{1}{\\sqrt{3}} \\Rightarrow \\alpha = 30°$.',
  ],
  // Q4 (escada) feedback: sen 60° = √3/2
  [
    'Correto. A escada é a hipotenusa (6 m). Queremos o cateto oposto ao ângulo de 60°. sen 60° = oposto/6 → oposto = 6 × (√3/2) = 3√3 ≈ 5,2 m.',
    'Correto. A escada é a hipotenusa (6 m). Queremos o cateto oposto ao ângulo de 60°. $\\text{sen}\\, 60° = \\dfrac{\\text{oposto}}{6} \\Rightarrow \\text{oposto} = 6 \\times \\dfrac{\\sqrt{3}}{2} = 3\\sqrt{3} \\approx 5{,}2$ m.',
  ],
  [
    '3 m seria o cateto adjacente (cos 60° × 6 = 0,5 × 6 = 3). Para a altura (cateto oposto), use seno: 6 × sen 60° = 3√3.',
    '3 m seria o cateto adjacente ($\\text{cos}\\, 60° \\times 6 = 0{,}5 \\times 6 = 3$). Para a altura (cateto oposto), use seno: $6 \\times \\text{sen}\\, 60° = 3\\sqrt{3}$.',
  ],
  [
    '6 m é o comprimento total da escada (hipotenusa). A altura na parede é menor: 6 × sen 60° = 3√3 ≈ 5,2 m.',
    '6 m é o comprimento total da escada (hipotenusa). A altura na parede é menor: $6 \\times \\text{sen}\\, 60° = 3\\sqrt{3} \\approx 5{,}2$ m.',
  ],
  [
    'Você multiplicou 6 × √3. Mas sen 60° = √3/2, portanto altura = 6 × (√3/2) = 3√3, não 6√3.',
    'Você multiplicou $6 \\times \\sqrt{3}$. Mas $\\text{sen}\\, 60° = \\dfrac{\\sqrt{3}}{2}$, portanto altura $= 6 \\times \\dfrac{\\sqrt{3}}{2} = 3\\sqrt{3}$, não $6\\sqrt{3}$.',
  ],
]

function convertMath(str) {
  // Skip if already fully converted (contains $ outside of known prefixes)
  let result = str
  for (const [from, to] of REPLACEMENTS) {
    if (result.includes(from)) {
      result = result.replace(from, to)
    }
  }
  return result
}

const transformed = transform(data)
fs.writeFileSync(FILE, JSON.stringify(transformed, null, 2), 'utf8')
console.log('Done. Converted', REPLACEMENTS.length, 'expressions.')
