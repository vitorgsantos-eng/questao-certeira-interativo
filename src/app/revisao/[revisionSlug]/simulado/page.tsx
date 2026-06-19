import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth-lite/session'
import { createServiceClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { SimuladoFinal } from '@/components/simulado/SimuladoFinal'
import type { QuestionWithOptions } from '@/types'

interface Props {
  params: Promise<{ revisionSlug: string }>
}

export default async function SimuladoPage({ params }: Props) {
  const { revisionSlug } = await params
  const session = await getSession()

  if (!session || session.revisionSlug !== revisionSlug) {
    redirect(`/acessar/${revisionSlug}`)
  }

  const supabase = await createServiceClient()

  const { data: revision } = await supabase
    .from('revisions')
    .select('id, title')
    .eq('slug', revisionSlug)
    .single()

  if (!revision) notFound()

  const { data: missions } = await supabase
    .from('missions')
    .select('id, title, slug')
    .eq('revision_id', revision.id)
    .eq('is_optional', false)

  if (!missions) notFound()

  // Get 2-3 questions per mission, shuffled
  const allQuestions: (QuestionWithOptions & { missionTitle: string })[] = []

  for (const m of missions) {
    const { data: qs } = await supabase
      .from('questions')
      .select('*, question_options(*)')
      .eq('mission_id', m.id)
      .in('difficulty', ['basic', 'intermediate'])
      .limit(3)

    for (const q of qs ?? []) {
      allQuestions.push({
        ...q,
        missionTitle: m.title,
        options: (q.question_options ?? []).sort(
          (a: { order_index: number }, b: { order_index: number }) =>
            a.order_index - b.order_index
        ),
      })
    }
  }

  // Shuffle
  allQuestions.sort(() => Math.random() - 0.5)

  return (
    <>
      <Header session={session} revisionSlug={revisionSlug} />
      <SimuladoFinal
        questions={allQuestions}
        revisionSlug={revisionSlug}
        revisionTitle={revision.title}
      />
    </>
  )
}
