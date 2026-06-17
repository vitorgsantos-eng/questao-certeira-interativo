import bcrypt from 'bcryptjs'

const CODE_REGEX = /^QC-[A-Z0-9]{2}-[A-Z0-9]{4}$/

export function isValidCodeFormat(code: string): boolean {
  return CODE_REGEX.test(code.toUpperCase().trim())
}

export function normalizeCode(code: string): string {
  return code.toUpperCase().trim()
}

export async function hashCode(code: string): Promise<string> {
  return bcrypt.hash(normalizeCode(code), 10)
}

export async function verifyCode(code: string, hash: string): Promise<boolean> {
  return bcrypt.compare(normalizeCode(code), hash)
}

export function generateRawCode(prefix = 'QC'): string {
  const part1 = randomAlphaNum(2)
  const part2 = randomAlphaNum(4)
  return `${prefix}-${part1}-${part2}`
}

function randomAlphaNum(length: number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('')
}
