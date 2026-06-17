import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth-lite/session'
import { createServiceClient } from '@/lib/supabase/server'

const progressSchema = z.object({
  missionId: z.string().uuid(),
  status: z.enum(['not_started', 'in_progress', 'completed']),
  score: z.number().min(0).max(100),
})

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Requisição inválida.' }, { status: 400 })
  }

  const parsed = progressSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ message: 'Dados inválidos.' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  const { missionId, status, score } = parsed.data
  const now = new Date().toISOString()

  const { error } = await supabase.from('mission_progress').upsert(
    {
      student_id: session.studentId,
      revision_id: session.revisionId,
      mission_id: missionId,
      status,
      score,
      started_at: now,
      completed_at: status === 'completed' ? now : null,
      updated_at: now,
    },
    {
      onConflict: 'student_id,mission_id',
    }
  )

  if (error) {
    return NextResponse.json({ message: 'Erro ao salvar progresso.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
  }

  const supabase = await createServiceClient()

  const { data, error } = await supabase
    .from('mission_progress')
    .select('*')
    .eq('student_id', session.studentId)
    .eq('revision_id', session.revisionId)

  if (error) {
    return NextResponse.json({ message: 'Erro ao buscar progresso.' }, { status: 500 })
  }

  return NextResponse.json({ progress: data })
}
