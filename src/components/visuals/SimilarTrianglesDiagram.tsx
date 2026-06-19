// Diagrama didático: dois triângulos semelhantes com razão de semelhança k
// M1 — Semelhança de Triângulos

export function SimilarTrianglesDiagram() {
  // Triângulo menor
  const sA = [52, 42] as const
  const sB = [16, 132] as const
  const sC = [96, 132] as const

  // Triângulo maior (k ≈ 1.6, visualmente proporcional)
  const lA = [210, 22] as const
  const lB = [162, 148] as const
  const lC = [282, 148] as const

  const poly = (pts: readonly (readonly [number, number])[]) =>
    pts.map(([x, y]) => `${x},${y}`).join(' ')

  return (
    <figure className="w-full">
      <svg
        viewBox="0 0 310 170"
        className="w-full max-w-md mx-auto"
        aria-label="Dois triângulos semelhantes: mesmo formato, tamanhos diferentes"
        role="img"
      >
        {/* Fundo claro */}
        <rect width="310" height="170" fill="#f8fafc" rx="8" />

        {/* Triângulo menor */}
        <polygon
          points={poly([sA, sB, sC])}
          fill="#e0e7ff"
          stroke="#3730a3"
          strokeWidth="1.8"
        />

        {/* Triângulo maior */}
        <polygon
          points={poly([lA, lB, lC])}
          fill="#dcfce7"
          stroke="#166534"
          strokeWidth="1.8"
        />

        {/* Marcas de ângulos iguais — A/A' */}
        <path
          d={`M ${sA[0] - 10},${sA[1] + 18} Q ${sA[0]},${sA[1] + 8} ${sA[0] + 10},${sA[1] + 18}`}
          fill="none"
          stroke="#3730a3"
          strokeWidth="1.5"
        />
        <path
          d={`M ${lA[0] - 12},${lA[1] + 22} Q ${lA[0]},${lA[1] + 10} ${lA[0] + 12},${lA[1] + 22}`}
          fill="none"
          stroke="#166534"
          strokeWidth="1.5"
        />

        {/* Marcas de ângulos — B/B' */}
        <path
          d={`M ${sB[0] + 16},${sB[1] - 6} Q ${sB[0] + 10},${sB[1] - 12} ${sB[0] + 8},${sB[1] - 18}`}
          fill="none"
          stroke="#3730a3"
          strokeWidth="1.5"
        />
        <path
          d={`M ${lB[0] + 20},${lB[1] - 8} Q ${lB[0] + 13},${lB[1] - 15} ${lB[0] + 10},${lB[1] - 23}`}
          fill="none"
          stroke="#166534"
          strokeWidth="1.5"
        />
        {/* Segunda marca de arco em B/B' (ângulo igual = 2 arcos) */}
        <path
          d={`M ${sB[0] + 20},${sB[1] - 5} Q ${sB[0] + 14},${sB[1] - 12} ${sB[0] + 11},${sB[1] - 20}`}
          fill="none"
          stroke="#3730a3"
          strokeWidth="1.5"
        />
        <path
          d={`M ${lB[0] + 26},${lB[1] - 7} Q ${lB[0] + 18},${lB[1] - 14} ${lB[0] + 14},${lB[1] - 26}`}
          fill="none"
          stroke="#166534"
          strokeWidth="1.5"
        />

        {/* Labels vértices — triângulo menor */}
        <text x={sA[0]} y={sA[1] - 6} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#3730a3">A</text>
        <text x={sB[0] - 8} y={sB[1] + 4} textAnchor="end" fontSize="11" fontWeight="bold" fill="#3730a3">B</text>
        <text x={sC[0] + 8} y={sC[1] + 4} textAnchor="start" fontSize="11" fontWeight="bold" fill="#3730a3">C</text>

        {/* Labels vértices — triângulo maior */}
        <text x={lA[0]} y={lA[1] - 7} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#166534">{"A′"}</text>
        <text x={lB[0] - 8} y={lB[1] + 5} textAnchor="end" fontSize="11" fontWeight="bold" fill="#166534">{"B′"}</text>
        <text x={lC[0] + 8} y={lC[1] + 5} textAnchor="start" fontSize="11" fontWeight="bold" fill="#166534">{"C′"}</text>

        {/* Labels lados — triângulo menor */}
        <text x={(sB[0] + sC[0]) / 2} y={sB[1] + 13} textAnchor="middle" fontSize="10" fill="#1e1b4b" fontStyle="italic">a</text>
        <text x={(sA[0] + sB[0]) / 2 - 9} y={(sA[1] + sB[1]) / 2} textAnchor="end" fontSize="10" fill="#1e1b4b" fontStyle="italic">b</text>
        <text x={(sA[0] + sC[0]) / 2 + 8} y={(sA[1] + sC[1]) / 2} textAnchor="start" fontSize="10" fill="#1e1b4b" fontStyle="italic">c</text>

        {/* Labels lados — triângulo maior */}
        <text x={(lB[0] + lC[0]) / 2} y={lB[1] + 13} textAnchor="middle" fontSize="10" fill="#14532d" fontStyle="italic">ka</text>
        <text x={(lA[0] + lB[0]) / 2 - 9} y={(lA[1] + lB[1]) / 2} textAnchor="end" fontSize="10" fill="#14532d" fontStyle="italic">kb</text>
        <text x={(lA[0] + lC[0]) / 2 + 8} y={(lA[1] + lC[1]) / 2} textAnchor="start" fontSize="10" fill="#14532d" fontStyle="italic">kc</text>

        {/* Seta + badge k entre os dois triângulos */}
        <line x1="106" y1="87" x2="148" y2="87" stroke="#b45309" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 Z" fill="#b45309" />
        </marker>
        <rect x="112" y="73" width="28" height="16" rx="4" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
        <text x="126" y="85" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#b45309">×k</text>

        {/* Legenda */}
        <rect x="6" y="6" width="12" height="10" rx="2" fill="#e0e7ff" stroke="#3730a3" strokeWidth="1" />
        <text x="22" y="15" fontSize="9" fill="#374151">Triângulo 1</text>
        <rect x="6" y="20" width="12" height="10" rx="2" fill="#dcfce7" stroke="#166534" strokeWidth="1" />
        <text x="22" y="29" fontSize="9" fill="#374151">Triângulo 2 (×k maior)</text>
      </svg>
      <figcaption className="text-center text-xs text-gray-500 mt-1">
        Mesma forma (ângulos iguais), lados multiplicados por k
      </figcaption>
    </figure>
  )
}
