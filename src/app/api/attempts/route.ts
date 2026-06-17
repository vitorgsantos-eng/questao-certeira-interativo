import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth-lite/session'
import { createServiceClient } from '@/lib/supabase/server'

const attemptSchema = z.object({
  questionId: z.string().uuid(),
  missionId: z.string().uuid().nullable(),
  answerJson: z.record(z.unknown()),
  isCorrect: z.boolean(),
  errorCategory: z.string().nullable(),
  timeSpentSeconds: z.number().int().min(0).max(3600),
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

  const parsed = attemptSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ message: 'Dados inválidos.' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  const { error } = await supabase.from('attempts').insert({
    student_id: session.studentId,
    revision_id: session.revisionId,
    mission_id: parsed.data.missionId,
    question_id: parsed.data.questionId,
    answer_json: parsed.data.answerJson,
    is_correct: parsed.data.isCorrect,
    error_category: parsed.data.errorCategory,
    time_spent_seconds: parsed.data.timeSpentSeconds,
  })

  if (error) {
    return NextResponse.json({ message: 'Erro ao salvar tentativa.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
