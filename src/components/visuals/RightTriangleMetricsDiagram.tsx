// Diagrama didático: relações métricas no triângulo retângulo
// M2 — Mostra h, m, n, a, b, c com código de cores
// Este é o visual mais importante: elimina ambiguidade sobre o que são m, n e h.

export function RightTriangleMetricsDiagram() {
  // Vértices do triângulo retângulo (ângulo reto em A, no topo)
  const B = [22, 168] as const   // base esquerda
  const C = [258, 168] as const  // base direita
  const A = [88, 40] as const    // ápice (ângulo reto aqui)
  const H = [88, 168] as const   // pé da altura (diretamente abaixo de A)

  // m = BH, n = HC, c = BC, h = AH
  // Marcador de ângulo reto (quadradinho)
  const rightAngleSize = 8

  return (
    <figure className="w-full">
      <svg
        viewBox="0 0 285 205"
        className="w-full max-w-md mx-auto"
        aria-label="Triângulo retângulo com hipotenusa c, catetos a e b, altura h e projeções m e n"
        role="img"
      >
        {/* Fundo */}
        <rect width="285" height="205" fill="#f8fafc" rx="8" />

        {/* ── Triângulo principal ── */}
        <polygon
          points={`${A[0]},${A[1]} ${B[0]},${B[1]} ${C[0]},${C[1]}`}
          fill="#eff6ff"
          stroke="#1e40af"
          strokeWidth="2"
        />

        {/* ── Altura h (linha pontilhada interna) ── */}
        <line
          x1={A[0]} y1={A[1]}
          x2={H[0]} y2={H[1]}
          stroke="#7c3aed"
          strokeWidth="2"
          strokeDasharray="5,3"
        />

        {/* ── Marcadores de ângulo reto ── */}
        {/* Ângulo reto em A */}
        <path
          d={`M ${A[0] - rightAngleSize},${A[1] + rightAngleSize}
              L ${A[0]},${A[1] + rightAngleSize}
              L ${A[0]},${A[1]}`}
          fill="none"
          stroke="#1e40af"
          strokeWidth="1.5"
        />
        {/* Ângulo reto em H (pé da altura) */}
        <rect
          x={H[0]}
          y={H[1] - rightAngleSize}
          width={rightAngleSize}
          height={rightAngleSize}
          fill="none"
          stroke="#7c3aed"
          strokeWidth="1.5"
        />

        {/* ── Labels dos lados ── */}

        {/* c — hipotenusa (base BC) */}
        <text
          x={(B[0] + C[0]) / 2}
          y={C[1] + 18}
          textAnchor="middle"
          fontSize="13"
          fontWeight="bold"
          fontStyle="italic"
          fill="#1e40af"
        >c</text>

        {/* a — cateto esquerdo (AB) */}
        <text
          x={(A[0] + B[0]) / 2 - 12}
          y={(A[1] + B[1]) / 2}
          textAnchor="end"
          fontSize="13"
          fontWeight="bold"
          fontStyle="italic"
          fill="#dc2626"
        >a</text>

        {/* b — cateto direito (AC) */}
        <text
          x={(A[0] + C[0]) / 2 + 12}
          y={(A[1] + C[1]) / 2}
          textAnchor="start"
          fontSize="13"
          fontWeight="bold"
          fontStyle="italic"
          fill="#059669"
        >b</text>

        {/* h — altura */}
        <text
          x={H[0] + 12}
          y={(A[1] + H[1]) / 2}
          textAnchor="start"
          fontSize="13"
          fontWeight="bold"
          fontStyle="italic"
          fill="#7c3aed"
        >h</text>

        {/* m — projeção esquerda (BH) */}
        <text
          x={(B[0] + H[0]) / 2}
          y={B[1] + 18}
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fontStyle="italic"
          fill="#b45309"
        >m</text>

        {/* n — projeção direita (HC) */}
        <text
          x={(H[0] + C[0]) / 2}
          y={H[1] + 18}
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fontStyle="italic"
          fill="#0f766e"
        >n</text>

        {/* ── Setas de delimitação m e n (pequenos traços) ── */}
        <line x1={B[0]} y1={B[1] + 7} x2={H[0]} y2={H[1] + 7} stroke="#b45309" strokeWidth="1" />
        <line x1={B[0]} y1={B[1] + 4} x2={B[0]} y2={B[1] + 10} stroke="#b45309" strokeWidth="1" />
        <line x1={H[0]} y1={H[1] + 4} x2={H[0]} y2={H[1] + 10} stroke="#b45309" strokeWidth="1" />

        <line x1={H[0]} y1={H[1] + 7} x2={C[0]} y2={C[1] + 7} stroke="#0f766e" strokeWidth="1" />
        <line x1={H[0]} y1={H[1] + 4} x2={H[0]} y2={H[1] + 10} stroke="#0f766e" strokeWidth="1" />
        <line x1={C[0]} y1={C[1] + 4} x2={C[0]} y2={C[1] + 10} stroke="#0f766e" strokeWidth="1" />

        {/* ── Legenda de cores ── */}
        <g fontSize="9" fill="#374151">
          <circle cx="10" cy="196" r="4" fill="#1e40af" />
          <text x="17" y="199">c = hipotenusa</text>

          <circle cx="88" cy="196" r="4" fill="#dc2626" />
          <text x="95" y="199">a = cateto</text>

          <circle cx="148" cy="196" r="4" fill="#059669" />
          <text x="155" y="199">b = cateto</text>

          <circle cx="195" cy="196" r="4" fill="#7c3aed" />
          <text x="202" y="199">h = altura</text>

          <circle cx="240" cy="196" r="4" fill="#b45309" />
          <text x="247" y="199">m, n = projeções</text>
        </g>
      </svg>
      <figcaption className="text-center text-xs text-gray-500 mt-1">
        O pé da altura H divide a hipotenusa em m (azul-laranja) e n (verde-água)
      </figcaption>
    </figure>
  )
}
