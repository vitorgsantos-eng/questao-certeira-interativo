'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { FeedbackBox } from './FeedbackBox'
import type { QuestionWithOptions, AttemptResult } from '@/types'

interface MultipleChoiceQuestionProps {
  question: QuestionWithOptions
  questionNumber: number
  totalQuestions: number
  onAnswer: (result: AttemptResult) => void
}

export function MultipleChoiceQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: MultipleChoiceQuestionProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const selectedOption = question.options.find((o) => o.id === selected)
  const isCorrect = selectedOption?.is_correct ?? false

  function handleSelect(optionId: string) {
    if (submitted) return
    setSelected(optionId)
  }

  function handleSubmit() {
    if (!selected || submitted) return
    setSubmitted(true)
  }

  function handleNext() {
    const correct = question.options.find((o) => o.is_correct)

    onAnswer({
      questionId: question.id,
      isCorrect,
      selectedOption: selected ?? undefined,
      feedback: selectedOption?.feedback ?? '',
      errorCategory: selectedOption?.error_category ?? null,
      correctAnswerText: !isCorrect ? correct?.option_text : undefined,
    })
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Progress indicator */}
      <div className="flex items-center justify-between text-xs text-brand-gray-mid">
        <span className="font-medium">
          Questão {questionNumber} de {totalQuestions}
        </span>
        <span className="badge-navy">{question.difficulty}</span>
      </div>

      {/* Statement */}
      <div className="card py-4">
        <p className="text-brand-navy font-medium leading-relaxed text-sm sm:text-base">
          {question.statement}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((option, idx) => {
          const letter = ['A', 'B', 'C', 'D', 'E'][idx]
          const isSelected = selected === option.id
          const showResult = submitted && isSelected

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={submitted}
              className={cn(
                'w-full text-left flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-200',
                !submitted && !isSelected && 'border-brand-gray-border bg-white hover:border-brand-navy-mid hover:bg-brand-bg-light',
                !submitted && isSelected && 'border-brand-navy bg-brand-navy/5',
                submitted && isSelected && option.is_correct && 'border-green-400 bg-green-50',
                submitted && isSelected && !option.is_correct && 'border-red-400 bg-red-50',
                submitted && !isSelected && option.is_correct && 'border-green-300 bg-green-50/50',
                submitted && !isSelected && !option.is_correct && 'border-brand-gray-border bg-white opacity-50',
              )}
            >
              <span
                className={cn(
                  'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                  !submitted && !isSelected && 'bg-brand-gray-soft text-brand-gray-mid',
                  !submitted && isSelected && 'bg-brand-navy text-white',
                  submitted && isSelected && option.is_correct && 'bg-green-500 text-white',
                  submitted && isSelected && !option.is_correct && 'bg-red-500 text-white',
                  submitted && !isSelected && option.is_correct && 'bg-green-400 text-white',
                )}
              >
                {submitted && isSelected && option.is_correct ? '✓' : ''}
                {submitted && isSelected && !option.is_correct ? '✗' : ''}
                {!showResult ? letter : ''}
              </span>
              <span className="text-sm text-brand-navy leading-relaxed pt-0.5">
                {option.option_text}
              </span>
            </button>
          )
        })}
      </div>

      {/* Submit / feedback */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="btn-gold w-full py-4"
        >
          Confirmar resposta
        </button>
      ) : (
        <FeedbackBox
          isCorrect={isCorrect}
          feedback={selectedOption?.feedback ?? ''}
          errorCategory={selectedOption?.error_category}
          correctAnswerText={
            !isCorrect
              ? question.options.find((o) => o.is_correct)?.option_text
              : undefined
          }
          onNext={handleNext}
          nextLabel={
            questionNumber < totalQuestions ? 'Próxima questão' : 'Concluir missão'
          }
        />
      )}
    </div>
  )
}
