import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth-lite/session'
import { MissionMap } from '@/components/mission/MissionMap'
import { Header } from '@/components/layout/Header'
import type { MissionWithProgress, MissionProgress } from '@/types'

interface Props {
  params: Promise<{ revisionSlug: string }>
}

export default async function RevisaoPage({ params }: Props) {
  const { revisionSlug } = await params
  const session = await getSession()

  if (!session) {
    redirect(`/acessar/${revisionSlug}`)
  }

  if (session.revisionSlug !== revisionSlug) {
    redirect(`/acessar/${revisionSlug}`)
  }

  const supabase = await createClient()

  const { data: revision } = await supabase
    .from('revisions')
    .select('id, title, grade, description, status')
    .eq('slug', revisionSlug)
    .eq('status', 'active')
    .single()

  if (!revision) notFound()

  const { data: missionsRaw } = await supabase
    .from('missions')
    .select('*')
    .eq('revision_id', revision.id)
    .order('order_index')

  const { data: progressRaw } = await supabase
    .from('mission_progress')
    .select('*')
    .eq('student_id', session.studentId)
    .eq('revision_id', revision.id)

  const progressMap = new Map<string, MissionProgress>(
    (progressRaw ?? []).map((p) => [p.mission_id, p])
  )

  const missions: MissionWithProgress[] = (missionsRaw ?? []).map((m) => ({
    ...m,
    progress: progressMap.get(m.id) ?? null,
  }))

  const completed = missions.filter((m) => m.progress?.status === 'completed')
  const mandatory = missions.filter((m) => !m.is_optional)
  const overallProgress =
    mandatory.length > 0
      ? Math.round((completed.filter((m) => !m.is_optional).length / mandatory.length) * 100)
      : 0

  // Check if diagnostic was done — diagnostic attempts are tagged
  // answer_json.context = 'diagnostic' to distinguish from simulado (both have null mission_id)
  const { data: diagAttempts } = await supabase
    .from('attempts')
    .select('id')
    .eq('student_id', session.studentId)
    .eq('revision_id', revision.id)
    .is('mission_id', null)
    .eq('answer_json->>context', 'diagnostic')
    .limit(1)

  const diagnosticDone = (diagAttempts?.length ?? 0) > 0

  return (
    <>
      <Header session={session} revisionSlug={revisionSlug} />
      <MissionMap
        revision={revision}
        missions={missions}
        session={session}
        revisionSlug={revisionSlug}
        overallProgress={overallProgress}
        diagnosticDone={diagnosticDone}
      />
    </>
  )
}
