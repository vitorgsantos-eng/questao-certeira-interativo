// Diagrama didático: relações métricas no triângulo retângulo
// M2 — Mostra h, m, n, a, b, c com código de cores
//
// Geometricamente consistente — ângulo reto real em A:
//   A=(110,48), B=(20,168), C=(270,168), H=(110,168)
//   AB = (-90, 120)  |AC| = 150
//   AC = (160, 120)  |AC| = 200
//   AB · AC = (-90)(160) + (120)(120) = -14400 + 14400 = 0  ✓
//   AH = (0, 120) — perpendicular à hipotenusa BC horizontal  ✓
//   m = BH = 90, n = HC = 160, c = BC = 250, h = AH = 120

export function RightTriangleMetricsDiagram() {
  const A = [110, 48]  as const   // ápice — ângulo reto aqui
  const B = [20,  168] as const   // base esquerda
  const H = [110, 168] as const   // pé da altitude (diretamente abaixo de A)
  const C = [270, 168] as const   // base direita

  // Vetores unitários de A em direção a B e C:
  //   uAB = (-90/150, 120/150) = (-0.6,  0.8)
  //   uAC = (160/200, 120/200) = ( 0.8,  0.6)
  const S = 11  // tamanho do marcador de ângulo reto em A
  const p1x = A[0] + S * (-0.6);  const p1y = A[1] + S * 0.8   // A + S·uAB
  const p3x = A[0] + S * 0.8;     const p3y = A[1] + S * 0.6   // A + S·uAC
  const p2x = p1x  + S * 0.8;     const p2y = p1y  + S * 0.6   // p1 + S·uAC

  const rh = 8  // tamanho do marcador de ângulo reto em H

  return (
    <figure className="w-full">
      <svg
        viewBox="0 0 300 215"
        className="w-full max-w-md mx-auto"
        aria-label="Triângulo retângulo com ângulo reto em A, hipotenusa c, catetos a e b, altura h e projeções m e n"
        role="img"
      >
        {/* Fundo */}
        <rect width="300" height="215" fill="#f8fafc" rx="8" />

        {/* ── Triângulo principal ── */}
        <polygon
          points={`${A[0]},${A[1]} ${B[0]},${B[1]} ${C[0]},${C[1]}`}
          fill="#eff6ff"
          stroke="#1e40af"
          strokeWidth="2"
        />

        {/* ── Altitude h (pontilhada, de A até H) ── */}
        <line
          x1={A[0]} y1={A[1]}
          x2={H[0]} y2={H[1]}
          stroke="#7c3aed"
          strokeWidth="2"
          strokeDasharray="5,3"
        />

        {/* ── Marcador de ângulo reto em A
              Segmentos paralelos a AB e AC, tamanho S
              P1 = A + S·uAB  →  P2 = P1 + S·uAC  →  P3 = A + S·uAC ── */}
        <path
          d={`M ${p1x.toFixed(1)},${p1y.toFixed(1)}
              L ${p2x.toFixed(1)},${p2y.toFixed(1)}
              L ${p3x.toFixed(1)},${p3y.toFixed(1)}`}
          fill="none"
          stroke="#1e40af"
          strokeWidth="1.5"
        />

        {/* ── Marcador de ângulo reto em H (AH vertical ⊥ BC horizontal) ── */}
        <rect
          x={H[0]}
          y={H[1] - rh}
          width={rh}
          height={rh}
          fill="none"
          stroke="#7c3aed"
          strokeWidth="1.5"
        />

        {/* ── Labels dos lados ── */}

        {/* c — hipotenusa (centro de BC) */}
        <text
          x={(B[0] + C[0]) / 2}
          y={C[1] + 17}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fontStyle="italic"
          fill="#1e40af"
        >c</text>

        {/* a — cateto esquerdo AB */}
        <text
          x={(A[0] + B[0]) / 2 - 13}
          y={(A[1] + B[1]) / 2 + 3}
          textAnchor="end"
          fontSize="14"
          fontWeight="bold"
          fontStyle="italic"
          fill="#dc2626"
        >a</text>

        {/* b — cateto direito AC */}
        <text
          x={(A[0] + C[0]) / 2 + 13}
          y={(A[1] + C[1]) / 2 + 3}
          textAnchor="start"
          fontSize="14"
          fontWeight="bold"
          fontStyle="italic"
          fill="#059669"
        >b</text>

        {/* h — altura (à direita da linha pontilhada) */}
        <text
          x={H[0] + 12}
          y={(A[1] + H[1]) / 2}
          textAnchor="start"
          fontSize="14"
          fontWeight="bold"
          fontStyle="italic"
          fill="#7c3aed"
        >h</text>

        {/* m — projeção BH */}
        <text
          x={(B[0] + H[0]) / 2}
          y={B[1] + 17}
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fontStyle="italic"
          fill="#b45309"
        >m</text>

        {/* n — projeção HC */}
        <text
          x={(H[0] + C[0]) / 2}
          y={H[1] + 17}
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fontStyle="italic"
          fill="#0f766e"
        >n</text>

        {/* ── Traços de delimitação de m e n ── */}
        <line x1={B[0]} y1={B[1]+6} x2={H[0]} y2={H[1]+6} stroke="#b45309" strokeWidth="1" />
        <line x1={B[0]} y1={B[1]+3} x2={B[0]} y2={B[1]+9} stroke="#b45309" strokeWidth="1" />
        <line x1={H[0]} y1={H[1]+3} x2={H[0]} y2={H[1]+9} stroke="#b45309" strokeWidth="1" />

        <line x1={H[0]} y1={H[1]+6} x2={C[0]} y2={C[1]+6} stroke="#0f766e" strokeWidth="1" />
        <line x1={H[0]} y1={H[1]+3} x2={H[0]} y2={H[1]+9} stroke="#0f766e" strokeWidth="1" />
        <line x1={C[0]} y1={C[1]+3} x2={C[0]} y2={C[1]+9} stroke="#0f766e" strokeWidth="1" />

        {/* ── Legenda (2 linhas) ── */}
        <g fontSize="9" fill="#374151">
          <circle cx="8"   cy="198" r="4" fill="#1e40af" />
          <text x="15"  y="201">c = hipotenusa</text>
          <circle cx="105" cy="198" r="4" fill="#dc2626" />
          <text x="112" y="201">a = cateto</text>
          <circle cx="168" cy="198" r="4" fill="#059669" />
          <text x="175" y="201">b = cateto</text>

          <circle cx="8"   cy="210" r="4" fill="#7c3aed" />
          <text x="15"  y="213">h = altura</text>
          <circle cx="78"  cy="210" r="4" fill="#b45309" />
          <text x="85"  y="213">m = proj. esq.</text>
          <circle cx="168" cy="210" r="4" fill="#0f766e" />
          <text x="175" y="213">n = proj. dir.</text>
        </g>
      </svg>
      <figcaption className="text-center text-xs text-gray-500 mt-1">
        Ângulo reto em A — altitude h divide a hipotenusa c em m (esq.) e n (dir.)
      </figcaption>
    </figure>
  )
}
