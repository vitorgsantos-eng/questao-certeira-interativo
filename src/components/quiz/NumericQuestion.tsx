'use client'

import { useState } from 'react'
import { FeedbackBox } from './FeedbackBox'
import { MathText } from '@/components/math/MathText'
import type { QuestionWithOptions, AttemptResult } from '@/types'

interface NumericQuestionProps {
  question: QuestionWithOptions & {
    correct_answer_json: {
      value: number
      tolerance?: number
      feedbackCorrect?: string
      feedbackWrong?: string
    }
  }
  questionNumber: number
  totalQuestions: number
  onAnswer: (result: AttemptResult) => void
}

export function NumericQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: NumericQuestionProps) {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const { value: correct, tolerance = 0.01, feedbackCorrect, feedbackWrong } =
    question.correct_answer_json

  function handleSubmit() {
    if (!value || submitted) return
    const num = parseFloat(value.replace(',', '.'))
    if (isNaN(num)) return
    const ok = Math.abs(num - correct) <= Math.abs(correct * tolerance) + 0.001
    setIsCorrect(ok)
    setSubmitted(true)
  }

  function handleNext() {
    onAnswer({
      questionId: question.id,
      isCorrect,
      enteredValue: value,
      feedback: isCorrect
        ? (feedbackCorrect ?? 'Resposta correta!')
        : (feedbackWrong ?? `O resultado esperado é ${correct}.`),
      errorCategory: isCorrect ? null : 'cálculo numérico',
      correctAnswerText: !isCorrect ? String(correct) : undefined,
    })
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between text-xs text-brand-gray-mid">
        <span className="font-medium">
          Questão {questionNumber} de {totalQuestions}
        </span>
        <span className="badge-navy">{question.difficulty}</span>
      </div>

      <div className="card py-4">
        <p className="text-brand-navy font-medium leading-relaxed text-sm sm:text-base">
          <MathText text={question.statement} />
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide">
          Sua resposta
        </label>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => {
            if (!submitted) setValue(e.target.value)
          }}
          placeholder="Digite o valor numérico"
          className="input-field text-center text-xl font-bold"
          disabled={submitted}
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="btn-gold w-full py-4"
        >
          Confirmar resposta
        </button>
      ) : (
        <FeedbackBox
          isCorrect={isCorrect}
          feedback={
            isCorrect
              ? (feedbackCorrect ?? 'Resposta correta!')
              : (feedbackWrong ?? `O resultado esperado é ${correct}.`)
          }
          correctAnswerText={!isCorrect ? String(correct) : undefined}
          onNext={handleNext}
          nextLabel={
            questionNumber < totalQuestions ? 'Próxima questão' : 'Concluir missão'
          }
        />
      )}
    </div>
  )
}
