import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth-lite/session'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { MissionPlayer } from '@/components/mission/MissionPlayer'
import type { ContentBlockData, QuestionWithOptions } from '@/types'

interface Props {
  params: Promise<{ revisionSlug: string; missionSlug: string }>
}

export default async function MissaoPage({ params }: Props) {
  const { revisionSlug, missionSlug } = await params
  const session = await getSession()

  if (!session || session.revisionSlug !== revisionSlug) {
    redirect(`/acessar/${revisionSlug}`)
  }

  const supabase = await createClient()

  const { data: revision } = await supabase
    .from('revisions')
    .select('id')
    .eq('slug', revisionSlug)
    .single()

  if (!revision) notFound()

  const { data: mission } = await supabase
    .from('missions')
    .select('*')
    .eq('revision_id', revision.id)
    .eq('slug', missionSlug)
    .single()

  if (!mission) notFound()

  const { data: blocksRaw } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('mission_id', mission.id)
    .order('order_index')

  const { data: questionsRaw } = await supabase
    .from('questions')
    .select('*, question_options(*)')
    .eq('mission_id', mission.id)
    .order('order_index')

  const blocks: ContentBlockData[] = (blocksRaw ?? []).map((b) => b.content_json)

  const questions: QuestionWithOptions[] = (questionsRaw ?? []).map((q) => ({
    ...q,
    options: (q.question_options ?? []).sort(
      (a: { order_index: number }, b: { order_index: number }) =>
        a.order_index - b.order_index
    ),
  }))

  return (
    <>
      <Header session={session} revisionSlug={revisionSlug} />
      <MissionPlayer
        mission={mission}
        blocks={blocks}
        questions={questions}
        revisionSlug={revisionSlug}
        studentId={session.studentId}
        revisionId={session.revisionId}
      />
    </>
  )
}
