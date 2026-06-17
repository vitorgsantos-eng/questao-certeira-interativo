import { ProgressBar } from '@/components/progress/ProgressBar'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Props {
  revisions: { id: string; slug: string; title: string; grade: string; status: string }[]
  accessCodes: {
    id: string
    student_id: string
    revision_id: string
    status: string
    expires_at: string
    last_used_at: string | null
  }[]
  students: {
    id: string
    display_name: string
    grade: string
    group_label: string | null
  }[]
  missionProgresses: {
    student_id: string
    mission_id: string
    revision_id: string
    status: string
    score: number
    updated_at: string
  }[]
  revisionProgresses: {
    student_id: string
    revision_id: string
    status: string
    diagnostic_score: number | null
    final_score: number | null
  }[]
}

export function TeacherDashboard({
  revisions,
  accessCodes,
  students,
  missionProgresses,
  revisionProgresses,
}: Props) {
  const studentMap = new Map(students.map((s) => [s.id, s]))

  const studentRows = accessCodes.map((code) => {
    const student = studentMap.get(code.student_id)
    const studentMissions = missionProgresses.filter(
      (p) => p.student_id === code.student_id && p.revision_id === code.revision_id
    )
    const revProgress = revisionProgresses.find(
      (p) => p.student_id === code.student_id && p.revision_id === code.revision_id
    )
    const completed = studentMissions.filter((p) => p.status === 'completed').length
    const avgScore =
      completed > 0
        ? Math.round(
            studentMissions
              .filter((p) => p.status === 'completed')
              .reduce((acc, p) => acc + p.score, 0) / completed
          )
        : 0

    const lastActivity = studentMissions
      .map((p) => p.updated_at)
      .sort()
      .reverse()[0]

    const revision = revisions.find((r) => r.id === code.revision_id)

    return {
      student,
      code,
      completed,
      avgScore,
      lastActivity,
      revision,
      revProgress,
    }
  })

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-12">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-black text-brand-navy">{students.length}</p>
          <p className="text-xs text-brand-gray-mid mt-1">Estudantes</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-black text-brand-navy">
            {accessCodes.filter((c) => c.status === 'active').length}
          </p>
          <p className="text-xs text-brand-gray-mid mt-1">Códigos ativos</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-black text-brand-navy">
            {missionProgresses.filter((p) => p.status === 'completed').length}
          </p>
          <p className="text-xs text-brand-gray-mid mt-1">Missões concluídas</p>
        </div>
      </div>

      {/* Revisions */}
      <div className="space-y-3">
        <h2 className="section-title">Revisões</h2>
        {revisions.map((r) => (
          <div key={r.id} className="card flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-brand-navy text-sm">{r.title}</h3>
              <p className="text-xs text-brand-gray-mid">{r.grade}</p>
            </div>
            <span
              className={cn(
                'badge',
                r.status === 'active'
                  ? 'badge-success'
                  : r.status === 'draft'
                  ? 'badge-warning'
                  : 'badge-neutral'
              )}
            >
              {r.status}
            </span>
          </div>
        ))}
      </div>

      {/* Students */}
      <div className="space-y-3">
        <h2 className="section-title">Alunos e progresso</h2>
        {studentRows.map((row, i) => (
          <div key={i} className="card space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-brand-navy text-sm">
                  {row.student?.display_name ?? 'Aluno sem nome'}
                </h3>
                <p className="text-xs text-brand-gray-mid">
                  {row.student?.grade}
                  {row.student?.group_label ? ` · ${row.student.group_label}` : ''}
                  {' · '}
                  {row.revision?.title}
                </p>
              </div>
              <span
                className={cn(
                  'badge flex-shrink-0',
                  row.code.status === 'active'
                    ? 'badge-success'
                    : row.code.status === 'expired'
                    ? 'badge-error'
                    : 'badge-neutral'
                )}
              >
                {row.code.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="font-bold text-brand-navy text-base">{row.completed}</p>
                <p className="text-brand-gray-mid">missões</p>
              </div>
              <div>
                <p className="font-bold text-brand-navy text-base">{row.avgScore}%</p>
                <p className="text-brand-gray-mid">média</p>
              </div>
              <div>
                <p className="font-bold text-brand-navy text-sm">
                  {row.lastActivity ? formatDate(row.lastActivity) : '—'}
                </p>
                <p className="text-brand-gray-mid">última atividade</p>
              </div>
            </div>

            {row.completed > 0 && (
              <ProgressBar value={row.avgScore} size="sm" showPercent />
            )}

            <div className="text-xs text-brand-gray-mid flex items-center gap-2">
              <span>Expira: {formatDate(row.code.expires_at)}</span>
              {row.code.last_used_at && (
                <span>· Último acesso: {formatDate(row.code.last_used_at)}</span>
              )}
            </div>
          </div>
        ))}

        {studentRows.length === 0 && (
          <div className="card text-center py-8">
            <p className="text-brand-gray-mid text-sm">
              Nenhum aluno cadastrado ainda.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
