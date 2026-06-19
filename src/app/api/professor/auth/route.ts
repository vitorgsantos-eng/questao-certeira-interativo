import { NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { getSecret } from '@/lib/auth-lite/session'
import {
  buildProfessorPayload,
  serializeProfessorSession,
  PROFESSOR_COOKIE,
  PROFESSOR_MAX_AGE,
} from '@/lib/auth-lite/professor-session'

const bodySchema = z.object({
  code: z.string().min(1),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Requisição inválida.' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ message: 'Dados inválidos.' }, { status: 400 })
  }

  const expected = process.env.PROFESSOR_ACCESS_CODE
  if (!expected) {
    return NextResponse.json(
      { message: 'Acesso de professor não configurado.' },
      { status: 500 }
    )
  }

  if (parsed.data.code !== expected) {
    return NextResponse.json({ message: 'Código incorreto.' }, { status: 401 })
  }

  const payload = buildProfessorPayload()
  const cookieValue = serializeProfessorSession(payload, getSecret())

  const cookieStore = await cookies()
  cookieStore.set(PROFESSOR_COOKIE, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: PROFESSOR_MAX_AGE,
    path: '/',
  })

  return NextResponse.json({ ok: true })
}
