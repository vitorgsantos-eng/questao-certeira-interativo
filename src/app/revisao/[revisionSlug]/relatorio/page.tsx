import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth-lite/session'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { StudentReport } from '@/components/reports/StudentReport'

interface Props {
  params: Promise<{ revisionSlug: string }>
}

export default async function RelatorioPage({ params }: Props) {
  const { revisionSlug } = await params
  const session = await getSession()

  if (!session || session.revisionSlug !== revisionSlug) {
    redirect(`/acessar/${revisionSlug}`)
  }

  const supabase = await createClient()

  const { data: revision } = await supabase
    .from('revisions')
    .select('id, title, grade, description')
    .eq('slug', revisionSlug)
    .single()

  if (!revision) notFound()

  const { data: missions } = await supabase
    .from('missions')
    .select('id, title, slug, order_index')
    .eq('revision_id', revision.id)
    .order('order_index')

  const { data: missionProgresses } = await supabase
    .from('mission_progress')
    .select('*')
    .eq('student_id', session.studentId)
    .eq('revision_id', revision.id)

  const { data: attempts } = await supabase
    .from('attempts')
    .select('question_id, is_correct, error_category, mission_id')
    .eq('student_id', session.studentId)
    .eq('revision_id', revision.id)

  const missionProgressMap = new Map(
    (missionProgresses ?? []).map((p) => [p.mission_id, p])
  )

  const missionResults = (missions ?? []).map((m) => {
    const progress = missionProgressMap.get(m.id)
    const missionAttempts = (attempts ?? []).filter((a) => a.mission_id === m.id)
    const correct = missionAttempts.filter((a) => a.is_correct).length
    const errorCats = missionAttempts
      .filter((a) => !a.is_correct && a.error_category)
      .map((a) => a.error_category)

    return {
      missionId: m.id,
      missionTitle: m.title,
      score: progress?.score ?? 0,
      totalQuestions: missionAttempts.length,
      correctAnswers: correct,
      errorCategories: errorCats,
      status: progress?.status ?? 'not_started',
    }
  })

  const completedMissions = missionResults.filter((m) => m.status === 'completed')
  const overallScore =
    completedMissions.length > 0
      ? Math.round(
          completedMissions.reduce((acc, m) => acc + m.score, 0) /
            completedMissions.length
        )
      : 0

  const allErrors = (attempts ?? [])
    .filter((a) => !a.is_correct && a.error_category)
    .map((a) => a.error_category as string)

  const errorCounts = allErrors.reduce(
    (acc, cat) => ({ ...acc, [cat]: (acc[cat] ?? 0) + 1 }),
    {} as Record<string, number>
  )

  const weakTopics = Object.entries(errorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat]) => cat)

  return (
    <>
      <Header session={session} revisionSlug={revisionSlug} />
      <StudentReport
        session={session}
        revision={revision}
        missionResults={missionResults}
        overallScore={overallScore}
        weakTopics={weakTopics}
        revisionSlug={revisionSlug}
      />
    </>
  )
}
