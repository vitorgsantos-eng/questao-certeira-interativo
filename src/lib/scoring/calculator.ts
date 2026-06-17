import type { AttemptResult, ErrorCategory } from '@/types'

export function calculateScore(attempts: AttemptResult[]): number {
  if (attempts.length === 0) return 0
  const correct = attempts.filter((a) => a.isCorrect).length
  return Math.round((correct / attempts.length) * 100)
}

export function getWeakTopics(attempts: AttemptResult[]): ErrorCategory[] {
  const counts = new Map<ErrorCategory, number>()
  attempts
    .filter((a) => !a.isCorrect && a.errorCategory)
    .forEach((a) => {
      const cat = a.errorCategory
      counts.set(cat, (counts.get(cat) ?? 0) + 1)
    })
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat)
}

export function getScoreLabel(score: number): {
  label: string
  color: string
} {
  if (score >= 80) return { label: 'Excelente', color: 'text-green-600' }
  if (score >= 60) return { label: 'Bom', color: 'text-brand-navy-mid' }
  if (score >= 40) return { label: 'Em desenvolvimento', color: 'text-amber-600' }
  return { label: 'Revisão necessária', color: 'text-red-600' }
}
