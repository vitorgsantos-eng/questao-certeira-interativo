import { cookies } from 'next/headers'
import type { StudentSession } from '@/types'
import { createHmac, timingSafeEqual, createHash } from 'crypto'
import { cache } from 'react'
import { createServiceClient, hasSupabaseServiceConfig } from '@/lib/supabase/server'

const SESSION_COOKIE = 'qci_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 15 // 15 days

export function getSecret(): string {
  return process.env.SESSION_SECRET || 'dev-secret-default-key-for-development'
}

export function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64')
}

export function timingSafeEqualStrings(a: string, b: string): boolean {
  const aHash = createHash('sha256').update(a).digest()
  const bHash = createHash('sha256').update(b).digest()
  return timingSafeEqual(aHash, bHash)
}

export function verify(payload: string, signature: string, secret: string): boolean {
  const expectedSig = sign(payload, secret)
  return timingSafeEqualStrings(signature, expectedSig)
}

export function serializeSession(session: StudentSession, secret: string): string {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64')
  const signature = sign(payload, secret)
  return `${payload}.${signature}`
}

export function deserializeSession(cookieValue: string, secret: string): StudentSession | null {
  try {
    const parts = cookieValue.split('.')
    if (parts.length !== 2) return null
    const [payload, signature] = parts
    if (!verify(payload, signature, secret)) {
      return null
    }
    const session: StudentSession = JSON.parse(
      Buffer.from(payload, 'base64').toString('utf-8')
    )
    if (new Date(session.expiresAt) < new Date()) return null
    return session
  } catch {
    return null
  }
}

export const getSession = cache(async function getSession(): Promise<StudentSession | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(SESSION_COOKIE)?.value
  if (!raw) return null
  try {
    const session = deserializeSession(raw, getSecret())
    if (!session) return null

    if (hasSupabaseServiceConfig()) {
      const supabase = await createServiceClient()
      const { data: code } = await supabase
        .from('access_codes')
        .select('id, status, expires_at')
        .eq('student_id', session.studentId)
        .eq('revision_id', session.revisionId)
        .eq('status', 'active')
        .maybeSingle()

      if (!code) {
        return null
      }

      if (new Date(code.expires_at) < new Date()) {
        await supabase
          .from('access_codes')
          .update({ status: 'expired' })
          .eq('id', code.id)
        return null
      }
    }

    return session
  } catch {
    return null
  }
})

export async function setSession(session: StudentSession): Promise<void> {
  if (process.env.NODE_ENV === 'test') return
  const cookieStore = await cookies()
  const cookieValue = serializeSession(session, getSecret())
  cookieStore.set(SESSION_COOKIE, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export function buildSession(opts: {
  studentId: string
  revisionId: string
  revisionSlug: string
  displayName: string
  grade: string
  codeExpiresAt: string
}): StudentSession {
  return {
    studentId: opts.studentId,
    revisionId: opts.revisionId,
    revisionSlug: opts.revisionSlug,
    displayName: opts.displayName,
    grade: opts.grade,
    expiresAt: opts.codeExpiresAt,
  }
}
