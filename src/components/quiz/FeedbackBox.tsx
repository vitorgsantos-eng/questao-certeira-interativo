import { cn } from '@/lib/utils'
import { MathText } from '@/components/math/MathText'

interface FeedbackBoxProps {
  isCorrect: boolean
  feedback: string
  errorCategory?: string | null
  correctAnswerText?: string
  onNext?: () => void
  nextLabel?: string
}

export function FeedbackBox({
  isCorrect,
  feedback,
  errorCategory,
  correctAnswerText,
  onNext,
  nextLabel = 'Próxima questão',
}: FeedbackBoxProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border-2 p-5 space-y-3 animate-slide-up',
        isCorrect
          ? 'bg-green-50 border-green-300'
          : 'bg-red-50 border-red-300'
      )}
    >
      {/* Status */}
      <div className="flex items-center gap-2">
        <span className={cn('text-2xl', isCorrect ? '' : '')}>
          {isCorrect ? '✓' : '✗'}
        </span>
        <span
          className={cn(
            'font-bold text-sm',
            isCorrect ? 'text-green-700' : 'text-red-700'
          )}
        >
          {isCorrect ? 'Correto.' : 'Ainda não.'}
        </span>
        {!isCorrect && errorCategory && (
          <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
            {errorCategory}
          </span>
        )}
      </div>

      {/* Feedback text */}
      <p
        className={cn(
          'text-sm leading-relaxed',
          isCorrect ? 'text-green-800' : 'text-red-800'
        )}
      >
        <MathText text={feedback} />
      </p>

      {/* Correct answer hint */}
      {!isCorrect && correctAnswerText && (
        <div className="bg-white rounded-lg p-3 border border-red-200">
          <p className="text-xs font-semibold text-brand-navy mb-1">Resposta correta:</p>
          <p className="text-sm font-medium text-brand-navy">
            <MathText text={correctAnswerText} />
          </p>
        </div>
      )}

      {/* Next button */}
      {onNext && (
        <button onClick={onNext} className="btn-primary w-full mt-2">
          {nextLabel}
        </button>
      )}
    </div>
  )
}
