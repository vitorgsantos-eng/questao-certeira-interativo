import Link from 'next/link'
import { ProgressBar } from '@/components/progress/ProgressBar'
import { getScoreLabel } from '@/lib/scoring/calculator'
import { cn } from '@/lib/utils'
import type { StudentSession } from '@/types'

interface MissionResult {
  missionId: string
  missionTitle: string
  score: number
  totalQuestions: number
  correctAnswers: number
  errorCategories: string[]
  status: string
}

interface StudentReportProps {
  session: StudentSession
  revision: { title: string; grade: string; description: string }
  missionResults: MissionResult[]
  overallScore: number
  weakTopics: string[]
  revisionSlug: string
}

export function StudentReport({
  session,
  revision,
  missionResults,
  overallScore,
  weakTopics,
  revisionSlug,
}: StudentReportProps) {
  const { label } = getScoreLabel(overallScore)
  const completedCount = missionResults.filter((m) => m.status === 'completed').length

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-12">
      {/* Header */}
      <div className="bg-navy-gradient text-white rounded-3xl p-6 space-y-4">
        <div>
          <p className="text-brand-gold text-xs font-bold uppercase tracking-widest">
            Relatório de desempenho
          </p>
          <h1 className="text-xl font-black mt-1">{revision.title}</h1>
          <p className="text-white/70 text-sm">{session.displayName} · {session.grade}</p>
        </div>

        <div className="grid grid-cols-3 gap-1.5 sm:gap-3 text-center">
          <div className="bg-white/10 rounded-xl p-1.5 sm:p-3 min-w-0">
            <p className="text-xl sm:text-2xl font-black truncate">{overallScore}%</p>
            <p className="text-[10px] sm:text-xs text-white/60 mt-0.5 truncate">Média geral</p>
          </div>
          <div className="bg-white/10 rounded-xl p-1.5 sm:p-3 min-w-0">
            <p className="text-xl sm:text-2xl font-black truncate">{completedCount}</p>
            <p className="text-[10px] sm:text-xs text-white/60 mt-0.5 truncate">Missões concluídas</p>
          </div>
          <div className="bg-white/10 rounded-xl p-1.5 sm:p-3 min-w-0">
            <p className="text-sm sm:text-lg font-black truncate">{label}</p>
            <p className="text-[10px] sm:text-xs text-white/60 mt-0.5 truncate">Resultado</p>
          </div>
        </div>
      </div>

      {/* Weak topics */}
      {weakTopics.length > 0 && (
        <div className="card space-y-3">
          <h2 className="section-title">Pontos a reforçar</h2>
          <div className="flex flex-wrap gap-2">
            {weakTopics.map((t) => (
              <span key={t} className="badge-warning">
                {t}
              </span>
            ))}
          </div>
          <p className="text-xs text-brand-gray-mid">
            Esses foram os principais tipos de erro. Revise as missões relacionadas.
          </p>
        </div>
      )}

      {/* Mission results */}
      <div className="space-y-3">
        <h2 className="section-title">Por missão</h2>
        {missionResults.map((m) => (
          <div key={m.missionId} className="card space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 min-w-0">
              <h3 className="font-bold text-brand-navy text-sm truncate min-w-0 flex-1">{m.missionTitle}</h3>
              <span
                className={cn(
                  'badge flex-shrink-0 self-start sm:self-auto',
                  m.status === 'completed'
                    ? 'badge-success'
                    : m.status === 'in_progress'
                    ? 'badge-warning'
                    : 'badge-neutral'
                )}
              >
                {m.status === 'completed'
                  ? 'Concluída'
                  : m.status === 'in_progress'
                  ? 'Em andamento'
                  : 'Não iniciada'}
              </span>
            </div>

            {m.status !== 'not_started' && (
              <>
                <ProgressBar
                  value={m.score}
                  showPercent
                  size="sm"
                  color={m.score >= 80 ? 'green' : 'navy'}
                />
                {m.totalQuestions > 0 && (
                  <p className="text-xs text-brand-gray-mid">
                    {m.correctAnswers}/{m.totalQuestions} questões corretas
                  </p>
                )}
              </>
            )}

            <Link
              href={`/revisao/${revisionSlug}/missao/${m.missionId}`}
              className="btn-ghost text-xs py-1.5 px-3 w-full text-center"
            >
              {m.status === 'completed' ? 'Refazer missão' : 'Iniciar missão'}
            </Link>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Link
          href={`/revisao/${revisionSlug}/simulado`}
          className="btn-gold w-full text-center block"
        >
          Ir ao simulado final
        </Link>
        <Link
          href={`/revisao/${revisionSlug}`}
          className="btn-outline w-full text-center block"
        >
          Voltar ao mapa de missões
        </Link>
      </div>
    </main>
  )
}
