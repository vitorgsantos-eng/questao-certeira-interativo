// Diagrama didático: trigonometria no triângulo retângulo
// M3 — Mostra cateto oposto, cateto adjacente e hipotenusa em relação ao ângulo α

export function TrigonometryDiagram() {
  // Triângulo retângulo com ângulo reto em C (canto inferior-direito)
  const B = [28, 162] as const   // ângulo α (inferior-esquerdo)
  const C = [228, 162] as const  // ângulo reto 90° (inferior-direito)
  const A = [228, 45] as const   // topo (canto superior-direito)

  const rightAngleSize = 9

  return (
    <figure className="w-full">
      <svg
        viewBox="0 0 280 195"
        className="w-full max-w-md mx-auto"
        aria-label="Triângulo retângulo com ângulo α em B, mostrando cateto oposto, cateto adjacente e hipotenusa"
        role="img"
      >
        {/* Fundo */}
        <rect width="280" height="195" fill="#f8fafc" rx="8" />

        {/* ── Triângulo ── */}
        <polygon
          points={`${B[0]},${B[1]} ${C[0]},${C[1]} ${A[0]},${A[1]}`}
          fill="#fef9ee"
          stroke="#78350f"
          strokeWidth="2"
        />

        {/* Marcador ângulo reto em C */}
        <rect
          x={C[0] - rightAngleSize}
          y={C[1] - rightAngleSize}
          width={rightAngleSize}
          height={rightAngleSize}
          fill="none"
          stroke="#374151"
          strokeWidth="1.5"
        />

        {/* ── Arco do ângulo α em B ── */}
        <path
          d="M 58,162 A 30,30 0 0,0 42,136"
          fill="none"
          stroke="#b45309"
          strokeWidth="2"
        />
        <text x="64" y="157" fontSize="13" fontStyle="italic" fontWeight="bold" fill="#b45309">α</text>

        {/* ── Labels dos lados com fundo colorido ── */}

        {/* Hipotenusa BA — lado mais longo */}
        <text
          x={(B[0] + A[0]) / 2 - 10}
          y={(B[1] + A[1]) / 2 - 10}
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="#1e40af"
          transform={`rotate(-34, ${(B[0] + A[0]) / 2 - 10}, ${(B[1] + A[1]) / 2 - 10})`}
        >Hipotenusa</text>

        {/* Cateto adjacente BC — horizontal (adjacente a α) */}
        <text
          x={(B[0] + C[0]) / 2}
          y={C[1] + 17}
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="#059669"
        >Cateto adjacente</text>

        {/* Cateto oposto AC — vertical (oposto a α) */}
        <text
          x={A[0] + 14}
          y={(A[1] + C[1]) / 2}
          textAnchor="start"
          fontSize="11"
          fontWeight="bold"
          fill="#dc2626"
        >Cateto</text>
        <text
          x={A[0] + 14}
          y={(A[1] + C[1]) / 2 + 14}
          textAnchor="start"
          fontSize="11"
          fontWeight="bold"
          fill="#dc2626"
        >oposto</text>

        {/* ── Legenda das razões ── */}
        <rect x="4" y="4" width="170" height="32" rx="5" fill="#fff7ed" stroke="#d97706" strokeWidth="1" />
        <text x="10" y="16" fontSize="9" fill="#78350f" fontWeight="bold">sen α = oposto / hipotenusa</text>
        <text x="10" y="28" fontSize="9" fill="#78350f" fontWeight="bold">cos α = adjacente / hipotenusa</text>
        <rect x="178" y="4" width="95" height="19" rx="5" fill="#fff7ed" stroke="#d97706" strokeWidth="1" />
        <text x="183" y="16" fontSize="9" fill="#78350f" fontWeight="bold">tg α = oposto / adjacente</text>

        {/* Nota: oposto/adjacente dependem de α */}
        <text x="140" y="188" textAnchor="middle" fontSize="9" fill="#6b7280">
          Oposto e adjacente mudam conforme o ângulo escolhido
        </text>
      </svg>
      <figcaption className="text-center text-xs text-gray-500 mt-1">
        Ângulo reto em C — cateto oposto e adjacente dependem de qual ângulo (α) você usa
      </figcaption>
    </figure>
  )
}
