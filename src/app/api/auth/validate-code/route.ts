import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient, hasSupabaseServiceConfig } from '@/lib/supabase/server'
import { verifyCode } from '@/lib/validation/code'
import { setSession, buildSession } from '@/lib/auth-lite/session'
import {
  rateLimitMap,
  MAX_ATTEMPTS,
  LOCKOUT_DURATION,
  getClientIp,
} from '@/lib/auth-lite/rate-limit'

const bodySchema = z.object({
  code: z.string().min(1),
  revisionSlug: z.string().min(1),
})

export async function POST(request: Request) {
  if (!hasSupabaseServiceConfig()) {
    return NextResponse.json(
      { message: 'Ambiente ainda não configurado para validar códigos.' },
      { status: 503 }
    )
  }

  const ip = getClientIp(request)
  const record = rateLimitMap.get(ip)

  if (record && record.attempts >= MAX_ATTEMPTS && Date.now() < record.blockedUntil) {
    const retryAfter = Math.ceil((record.blockedUntil - Date.now()) / 1000)
    return NextResponse.json(
      { message: 'Muitas tentativas. Tente novamente mais tarde.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
        },
      }
    )
  }

  const registerFailure = () => {
    const current = rateLimitMap.get(ip) || { attempts: 0, blockedUntil: 0 }
    current.attempts += 1
    if (current.attempts >= MAX_ATTEMPTS) {
      current.blockedUntil = Date.now() + LOCKOUT_DURATION
    }
    rateLimitMap.set(ip, current)
  }

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

  const { code, revisionSlug } = parsed.data
  const supabase = await createServiceClient()

  const { data: revision } = await supabase
    .from('revisions')
    .select('id, title, grade, status')
    .eq('slug', revisionSlug)
    .eq('status', 'active')
    .single()

  if (!revision) {
    registerFailure()
    return NextResponse.json({ message: 'Revisão não encontrada.' }, { status: 404 })
  }

  const { data: codes } = await supabase
    .from('access_codes')
    .select('id, student_id, code_hash, status, expires_at')
    .eq('revision_id', revision.id)
    .eq('status', 'active')

  if (!codes || codes.length === 0) {
    registerFailure()
    return NextResponse.json(
      { message: 'Código inválido. Verifique e tente novamente.' },
      { status: 401 }
    )
  }

  let matchedCode: (typeof codes)[0] | null = null
  for (const c of codes) {
    const match = await verifyCode(code, c.code_hash)
    if (match) {
      matchedCode = c
      break
    }
  }

  if (!matchedCode) {
    registerFailure()
    return NextResponse.json(
      { message: 'Código inválido. Verifique e tente novamente.' },
      { status: 401 }
    )
  }

  if (new Date(matchedCode.expires_at) < new Date()) {
    await supabase
      .from('access_codes')
      .update({ status: 'expired' })
      .eq('id', matchedCode.id)
    registerFailure()
    return NextResponse.json(
      { message: 'Este código expirou. Solicite um novo ao professor.' },
      { status: 403 }
    )
  }

  const { data: student } = await supabase
    .from('students')
    .select('id, display_name, grade')
    .eq('id', matchedCode.student_id)
    .single()

  if (!student) {
    registerFailure()
    return NextResponse.json({ message: 'Estudante não encontrado.' }, { status: 404 })
  }

  await supabase
    .from('access_codes')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', matchedCode.id)

  await setSession(
    buildSession({
      studentId: student.id,
      revisionId: revision.id,
      revisionSlug,
      displayName: student.display_name,
      grade: student.grade,
      codeExpiresAt: matchedCode.expires_at,
    })
  )

  rateLimitMap.delete(ip)

  return NextResponse.json({ ok: true })
}
