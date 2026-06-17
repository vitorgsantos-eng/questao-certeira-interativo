'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MultipleChoiceQuestion } from '@/components/quiz/MultipleChoiceQuestion'
import { ProgressBar } from '@/components/progress/ProgressBar'
import type { QuestionWithOptions, AttemptResult } from '@/types'

interface DiagnosticPlayerProps {
  questions: QuestionWithOptions[]
  missions: { id: string; slug: string; title: string }[]
  revisionSlug: string
}

export function DiagnosticPlayer({
  questions,
  missions,
  revisionSlug,
}: DiagnosticPlayerProps) {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [attempts, setAttempts] = useState<AttemptResult[]>([])
  const [done, setDone] = useState(false)

  const progress = Math.round((current / questions.length) * 100)

  async function handleAnswer(result: AttemptResult) {
    const newAttempts = [...attempts, result]
    setAttempts(newAttempts)

    // Save attempt (mission_id is null for diagnostic)
    try {
      await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: result.questionId,
          missionId: null,
          answerJson: { selected: result.selectedOption, context: 'diagnostic' },
          isCorrect: result.isCorrect,
          errorCategory: result.errorCategory,
          timeSpentSeconds: 0,
        }),
      })
    } catch {
      // non-blocking
    }

    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1)
    } else {
      setDone(true)
    }
  }

  if (done) {
    const correct = attempts.filter((a) => a.isCorrect).length
    const weakMissions = missions.filter((_, i) => !attempts[i]?.isCorrect)

    return (
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
        <div className="bg-navy-gradient text-white rounded-3xl p-6 text-center space-y-2">
          <p className="text-brand-gold text-xs font-bold uppercase tracking-widest">
            Diagnóstico concluído
          </p>
          <h1 className="text-3xl font-black">
            {correct}/{questions.length} corretas
          </h1>
        </div>

        {weakMissions.length > 0 && (
          <div className="card space-y-3">
            <h2 className="font-bold text-brand-navy">
              Foco recomendado
            </h2>
            <p className="text-sm text-brand-gray-mid">
              Com base no diagnóstico, comece por estas missões:
            </p>
            <ul className="space-y-2">
              {weakMissions.map((m) => (
                <li key={m.id}>
                  <span className="text-sm font-medium text-brand-navy flex items-center gap-2">
                    <span className="text-brand-gold">▸</span>
                    {m.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={() => router.push(`/revisao/${revisionSlug}`)}
          className="btn-primary w-full py-4"
        >
          Ir para as missões
        </button>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-brand-navy">Diagnóstico rápido</h1>
          <span className="text-xs text-brand-gray-mid">
            {current + 1}/{questions.length}
          </span>
        </div>
        <ProgressBar value={progress} size="sm" color="gold" />
        <p className="text-xs text-brand-gray-mid">
          Assunto: <span className="font-medium">{missions[current]?.title}</span>
        </p>
      </div>

      <MultipleChoiceQuestion
        key={questions[current].id}
        question={questions[current]}
        questionNumber={current + 1}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
      />
    </main>
  )
}
