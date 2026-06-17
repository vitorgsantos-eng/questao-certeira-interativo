import { NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'

const TEACHER_SESSION_COOKIE = 'qci_professor'

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

  const cookieStore = await cookies()
  cookieStore.set(TEACHER_SESSION_COOKIE, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  })

  return NextResponse.json({ ok: true })
}
