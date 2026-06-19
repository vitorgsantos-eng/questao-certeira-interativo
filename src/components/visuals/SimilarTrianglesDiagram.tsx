// Diagrama didático: dois triângulos semelhantes com razão de semelhança k
// M1 — Semelhança de Triângulos
//
// Semelhança exata (k = 1,5):
//   Triângulo menor:  A=(60,50), B=(20,130), C=(100,130)
//   Triângulo maior:  A=(220,30), B=(160,150), C=(280,150)
//   Verificação de lados correspondentes:
//     BC → B'C' = 80 → 120 = 1,5 × 80  ✓
//     AB → A'B' = (−40,80) → (−60,120) = 1,5 × (−40,80)  ✓
//     AC → A'C' = (40,80) → (60,120) = 1,5 × (40,80)  ✓

export function SimilarTrianglesDiagram() {
  const sA = [60,  50]  as const   // triângulo menor — vértices
  const sB = [20,  130] as const
  const sC = [100, 130] as const

  const lA = [220, 30]  as const   // triângulo maior (k = 1,5 exato)
  const lB = [160, 150] as const
  const lC = [280, 150] as const

  const poly = (pts: readonly (readonly [number, number])[]) =>
    pts.map(([x, y]) => `${x},${y}`).join(' ')

  return (
    <figure className="w-full">
      <svg
        viewBox="0 0 310 170"
        className="w-full max-w-md mx-auto"
        aria-label="Dois triângulos semelhantes: mesma forma, tamanhos diferentes. O maior é k = 1,5 vezes o menor."
        role="img"
      >
        {/* Fundo */}
        <rect width="310" height="170" fill="#f8fafc" rx="8" />

        {/* ── Triângulo menor ── */}
        <polygon
          points={poly([sA, sB, sC])}
          fill="#e0e7ff"
          stroke="#3730a3"
          strokeWidth="1.8"
        />

        {/* ── Triângulo maior ── */}
        <polygon
          points={poly([lA, lB, lC])}
          fill="#dcfce7"
          stroke="#166534"
          strokeWidth="1.8"
        />

        {/* ── Marcas de ângulo em A / A′ (arco côncavo para dentro do triângulo) ── */}
        <path
          d={`M ${sA[0]-10},${sA[1]+17} Q ${sA[0]},${sA[1]+7} ${sA[0]+10},${sA[1]+17}`}
          fill="none" stroke="#3730a3" strokeWidth="1.5"
        />
        <path
          d={`M ${lA[0]-12},${lA[1]+20} Q ${lA[0]},${lA[1]+8} ${lA[0]+12},${lA[1]+20}`}
          fill="none" stroke="#166534" strokeWidth="1.5"
        />

        {/* ── Marcas de ângulo em B / B′ (arco simples) ── */}
        <path
          d={`M ${sB[0]+17},${sB[1]-5} Q ${sB[0]+11},${sB[1]-12} ${sB[0]+7},${sB[1]-19}`}
          fill="none" stroke="#3730a3" strokeWidth="1.5"
        />
        <path
          d={`M ${lB[0]+21},${lB[1]-6} Q ${lB[0]+14},${lB[1]-14} ${lB[0]+9},${lB[1]-23}`}
          fill="none" stroke="#166534" strokeWidth="1.5"
        />
        {/* Segunda marca (duplo arco = ângulo marcado duas vezes) */}
        <path
          d={`M ${sB[0]+21},${sB[1]-4} Q ${sB[0]+15},${sB[1]-11} ${sB[0]+10},${sB[1]-21}`}
          fill="none" stroke="#3730a3" strokeWidth="1.5"
        />
        <path
          d={`M ${lB[0]+26},${lB[1]-5} Q ${lB[0]+19},${lB[1]-13} ${lB[0]+13},${lB[1]-26}`}
          fill="none" stroke="#166534" strokeWidth="1.5"
        />

        {/* ── Labels vértices — triângulo menor ── */}
        <text x={sA[0]} y={sA[1]-6} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#3730a3">A</text>
        <text x={sB[0]-8} y={sB[1]+4} textAnchor="end" fontSize="11" fontWeight="bold" fill="#3730a3">B</text>
        <text x={sC[0]+8} y={sC[1]+4} textAnchor="start" fontSize="11" fontWeight="bold" fill="#3730a3">C</text>

        {/* ── Labels vértices — triângulo maior ── */}
        <text x={lA[0]} y={lA[1]-7} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#166534">{"A′"}</text>
        <text x={lB[0]-8} y={lB[1]+5} textAnchor="end" fontSize="11" fontWeight="bold" fill="#166534">{"B′"}</text>
        <text x={lC[0]+8} y={lC[1]+5} textAnchor="start" fontSize="11" fontWeight="bold" fill="#166534">{"C′"}</text>

        {/* ── Labels lados — triângulo menor ── */}
        <text x={(sB[0]+sC[0])/2} y={sB[1]+13} textAnchor="middle" fontSize="10" fontStyle="italic" fill="#1e1b4b">a</text>
        <text x={(sA[0]+sB[0])/2-9} y={(sA[1]+sB[1])/2} textAnchor="end" fontSize="10" fontStyle="italic" fill="#1e1b4b">b</text>
        <text x={(sA[0]+sC[0])/2+9} y={(sA[1]+sC[1])/2} textAnchor="start" fontSize="10" fontStyle="italic" fill="#1e1b4b">c</text>

        {/* ── Labels lados — triângulo maior ── */}
        <text x={(lB[0]+lC[0])/2} y={lB[1]+13} textAnchor="middle" fontSize="10" fontStyle="italic" fill="#14532d">ka</text>
        <text x={(lA[0]+lB[0])/2-9} y={(lA[1]+lB[1])/2} textAnchor="end" fontSize="10" fontStyle="italic" fill="#14532d">kb</text>
        <text x={(lA[0]+lC[0])/2+9} y={(lA[1]+lC[1])/2} textAnchor="start" fontSize="10" fontStyle="italic" fill="#14532d">kc</text>

        {/* ── Seta + badge ×k entre os triângulos ── */}
        <defs>
          <marker id="arr51" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 Z" fill="#b45309" />
          </marker>
        </defs>
        <line x1="110" y1="90" x2="148" y2="90" stroke="#b45309" strokeWidth="1.5" markerEnd="url(#arr51)" />
        <rect x="108" y="75" width="38" height="18" rx="4" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
        <text x="127" y="88" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#b45309">k = 1,5</text>

        {/* ── Legenda ── */}
        <rect x="6"  y="6" width="13" height="10" rx="2" fill="#e0e7ff" stroke="#3730a3" strokeWidth="1" />
        <text x="23" y="15" fontSize="9" fill="#374151">Triângulo menor</text>
        <rect x="6" y="20" width="13" height="10" rx="2" fill="#dcfce7" stroke="#166534" strokeWidth="1" />
        <text x="23" y="29" fontSize="9" fill="#374151">Triângulo maior (k = 1,5)</text>
      </svg>
      <figcaption className="text-center text-xs text-gray-500 mt-1">
        Mesma forma (ângulos iguais), todos os lados proporcionais com k = 1,5
      </figcaption>
    </figure>
  )
}
