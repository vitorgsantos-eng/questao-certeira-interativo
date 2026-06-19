import { sign, verify } from './session'

const PROFESSOR_COOKIE = 'qci_professor'
const PROFESSOR_MAX_AGE = 60 * 60 * 8 // 8 hours

interface ProfessorPayload {
  role: 'professor'
  issuedAt: string
  expiresAt: string
}

export function buildProfessorPayload(): ProfessorPayload {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + PROFESSOR_MAX_AGE * 1000)
  return {
    role: 'professor',
    issuedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  }
}

export function serializeProfessorSession(payload: ProfessorPayload, secret: string): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64')
  const signature = sign(encoded, secret)
  return `${encoded}.${signature}`
}

export function deserializeProfessorSession(cookieValue: string, secret: string): ProfessorPayload | null {
  try {
    const parts = cookieValue.split('.')
    if (parts.length !== 2) return null
    const [encoded, signature] = parts
    if (!verify(encoded, signature, secret)) return null
    const payload: ProfessorPayload = JSON.parse(Buffer.from(encoded, 'base64').toString('utf-8'))
    if (payload.role !== 'professor') return null
    if (new Date(payload.expiresAt) < new Date()) return null
    return payload
  } catch {
    return null
  }
}

export { PROFESSOR_COOKIE, PROFESSOR_MAX_AGE }
