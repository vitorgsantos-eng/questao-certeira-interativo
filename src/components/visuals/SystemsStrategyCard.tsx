// Cartão visual da estratégia para sistemas com equações do 2º grau
// M4 — Mostra: fluxo (isole → substitua → simplifique → verifique)
//              e estratégia soma/produto (t² − St + P = 0)

export function SystemsStrategyCard() {
  const steps = [
    { icon: '①', label: 'Isole', sub: 'na equação mais simples' },
    { icon: '②', label: 'Substitua', sub: 'na equação do 2º grau' },
    { icon: '③', label: 'Simplifique', sub: 'e resolva a equação' },
    { icon: '④', label: 'Verifique', sub: 'nas equações originais' },
  ]

  return (
    <div className="space-y-3" aria-label="Estratégia para sistemas com equações do 2º grau">
      {/* Fluxo de etapas */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Estratégia de resolução
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {steps.map((s, i) => (
            <div key={i} className="relative">
              <div className="bg-white rounded-lg p-2.5 border border-slate-200 text-center space-y-0.5 h-full">
                <span className="block text-lg font-black text-indigo-700">{s.icon}</span>
                <span className="block text-xs font-bold text-slate-800">{s.label}</span>
                <span className="block text-xs text-slate-500 leading-tight">{s.sub}</span>
              </div>
              {/* Seta entre os itens (exceto o último) */}
              {i < steps.length - 1 && (
                <span
                  className="hidden sm:block absolute top-1/2 -right-3 -translate-y-1/2 text-slate-400 font-bold text-sm z-10"
                  aria-hidden="true"
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Estratégia soma/produto */}
      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
        <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
          Atalho — soma e produto conhecidos
        </p>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="bg-white rounded-lg p-2 border border-amber-200">
            <p className="text-xs text-slate-500 mb-0.5">Se você sabe</p>
            <p className="font-bold text-amber-800">
              x + y = S
            </p>
            <p className="font-bold text-amber-800">
              x · y = P
            </p>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-amber-500 font-black text-xl">→</span>
          </div>
          <div className="bg-white rounded-lg p-2 border border-amber-200">
            <p className="text-xs text-slate-500 mb-0.5">Monte e resolva</p>
            <p className="font-bold text-amber-800">
              t² − St + P = 0
            </p>
          </div>
        </div>
        <p className="text-xs text-amber-700 mt-2 text-center">
          x e y são as raízes dessa equação
        </p>
      </div>
    </div>
  )
}
