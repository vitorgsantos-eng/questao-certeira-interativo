import Link from 'next/link'
import { ProgressBar } from '@/components/progress/ProgressBar'
import { MissionCard } from './MissionCard'
import type { MissionWithProgress, StudentSession } from '@/types'

interface MissionMapProps {
  revision: { title: string; grade: string; description: string }
  missions: MissionWithProgress[]
  session: StudentSession
  revisionSlug: string
  overallProgress: number
  diagnosticDone: boolean
}

export function MissionMap({
  revision,
  missions,
  session,
  revisionSlug,
  overallProgress,
  diagnosticDone,
}: MissionMapProps) {
  const completedCount = missions.filter((m) => m.progress?.status === 'completed').length

  return (
    <div className="min-h-screen bg-brand-bg-light">
      {/* Hero */}
      <div className="bg-navy-gradient text-white px-4 pt-6 pb-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <div>
            <span className="badge bg-brand-gold/20 text-brand-gold-light text-xs">
              {revision.grade}
            </span>
            <h1 className="text-xl font-bold mt-2 leading-tight">{revision.title}</h1>
            <p className="text-sm text-white/70 mt-1">{revision.description}</p>
          </div>

          {/* Student + progress */}
          <div className="bg-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/60">Estudante</p>
                <p className="font-bold text-brand-gold">{session.displayName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/60">Progresso geral</p>
                <p className="text-2xl font-black text-white">{overallProgress}%</p>
              </div>
            </div>
            <ProgressBar value={overallProgress} color="gold" size="md" />
            <p className="text-xs text-white/60">
              {completedCount} de {missions.filter((m) => !m.is_optional).length} missões obrigatórias concluídas
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Diagnostic prompt */}
        {!diagnosticDone && (
          <div className="card border-2 border-brand-gold/30 bg-brand-gold/5 space-y-3">
            <div>
              <h2 className="font-bold text-brand-navy">Diagnóstico rápido</h2>
              <p className="text-sm text-brand-gray-mid mt-1">
                São 4 questões para o app indicar onde você deve focar. Leva menos de 5 minutos.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link
                href={`/revisao/${revisionSlug}/diagnostico`}
                className="btn-gold text-sm py-2.5 px-4"
              >
                Começar diagnóstico
              </Link>
              <span className="btn-ghost text-sm py-2.5 px-4 cursor-default text-brand-gray-mid">
                Pular e ir para as missões ↓
              </span>
            </div>
          </div>
        )}

        {/* Missions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="section-title mb-0">Missões</h2>
            <span className="text-xs text-brand-gray-mid">Ordem recomendada</span>
          </div>

          {missions
            .filter((m) => !m.is_optional)
            .sort((a, b) => a.order_index - b.order_index)
            .map((mission, i) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                revisionSlug={revisionSlug}
                index={i}
              />
            ))}
        </div>

        {/* Optional missions */}
        {missions.some((m) => m.is_optional) && (
          <div className="space-y-3">
            <h2 className="section-title mb-0">Desafios extras</h2>
            {missions
              .filter((m) => m.is_optional)
              .map((mission, i) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  revisionSlug={revisionSlug}
                  index={i}
                />
              ))}
          </div>
        )}

        {/* Simulado */}
        <div className="card border-2 border-brand-navy/20 space-y-3">
          <div>
            <h2 className="font-bold text-brand-navy">Simulado final</h2>
            <p className="text-sm text-brand-gray-mid mt-1">
              Questões mistas de todos os assuntos.
              {completedCount < missions.filter((m) => !m.is_optional).length && (
                <span className="block mt-1 text-amber-600 font-medium">
                  Recomendado concluir as missões antes do simulado.
                </span>
              )}
            </p>
          </div>
          <Link
            href={`/revisao/${revisionSlug}/simulado`}
            className="btn-outline text-sm py-2.5 w-full sm:w-auto"
          >
            Ir ao simulado
          </Link>
        </div>

        {/* Report */}
        {overallProgress > 0 && (
          <Link
            href={`/revisao/${revisionSlug}/relatorio`}
            className="block card-hover text-center py-4 text-sm font-semibold text-brand-navy-mid"
          >
            Ver meu relatório de desempenho →
          </Link>
        )}

        {/* Home link */}
        <div className="text-center pt-2 pb-4">
          <Link href="/" className="text-xs text-brand-gray-mid hover:text-brand-navy transition-colors">
            ← Página inicial
          </Link>
        </div>
      </div>
    </div>
  )
}
