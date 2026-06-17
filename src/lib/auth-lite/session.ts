import { cookies } from 'next/headers'
import type { StudentSession } from '@/types'

const SESSION_COOKIE = 'qci_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 15 // 15 days

export async function getSession(): Promise<StudentSession | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(SESSION_COOKIE)?.value
  if (!raw) return null
  try {
    const session: StudentSession = JSON.parse(
      Buffer.from(raw, 'base64').toString('utf-8')
    )
    if (new Date(session.expiresAt) < new Date()) return null
    return session
  } catch {
    return null
  }
}

export async function setSession(session: StudentSession): Promise<void> {
  const cookieStore = await cookies()
  const encoded = Buffer.from(JSON.stringify(session)).toString('base64')
  cookieStore.set(SESSION_COOKIE, encoded, {
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
