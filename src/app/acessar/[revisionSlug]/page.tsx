import { notFound } from 'next/navigation'
import { createClient, hasSupabaseConfig } from '@/lib/supabase/server'
import { AccessForm } from '@/components/access/AccessForm'

interface Props {
  params: Promise<{ revisionSlug: string }>
}

export default async function AcessarPage({ params }: Props) {
  const { revisionSlug } = await params

  if (!hasSupabaseConfig()) {
    return (
      <AccessForm
        revisionSlug={revisionSlug}
        revisionTitle="Revisão Interativa — Triângulos e Sistemas"
        revisionGrade="9º ano"
      />
    )
  }

  const supabase = await createClient()

  const { data: revision } = await supabase
    .from('revisions')
    .select('id, title, grade, status')
    .eq('slug', revisionSlug)
    .eq('status', 'active')
    .single()

  if (!revision) notFound()

  return (
    <AccessForm
      revisionSlug={revisionSlug}
      revisionTitle={revision.title}
      revisionGrade={revision.grade}
    />
  )
}
