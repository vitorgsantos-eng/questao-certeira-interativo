import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth-lite/session'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { DiagnosticPlayer } from '@/components/mission/DiagnosticPlayer'
import type { QuestionWithOptions } from '@/types'

interface Props {
  params: Promise<{ revisionSlug: string }>
}

export default async function DiagnosticoPage({ params }: Props) {
  const { revisionSlug } = await params
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

  // Get one question per mission (skill_tag = 'diagnostic') or first question of each mission
  const { data: missions } = await supabase
    .from('missions')
    .select('id, slug, title')
    .eq('revision_id', revision.id)
    .eq('is_optional', false)
    .order('order_index')
    .limit(4)

  if (!missions || missions.length === 0) {
    redirect(`/revisao/${revisionSlug}`)
  }

  const diagQuestions: QuestionWithOptions[] = []

  for (const m of missions) {
    const { data: q } = await supabase
      .from('questions')
      .select('*, question_options(*)')
      .eq('mission_id', m.id)
      .eq('difficulty', 'basic')
      .limit(1)
      .maybeSingle()

    if (q) {
      diagQuestions.push({
        ...q,
        options: (q.question_options ?? []).sort(
          (a: { order_index: number }, b: { order_index: number }) =>
            a.order_index - b.order_index
        ),
      })
    }
  }

  if (diagQuestions.length === 0) {
    redirect(`/revisao/${revisionSlug}`)
  }

  return (
    <>
      <Header session={session} revisionSlug={revisionSlug} />
      <DiagnosticPlayer
        questions={diagQuestions}
        missions={missions}
        revisionSlug={revisionSlug}
      />
    </>
  )
}
