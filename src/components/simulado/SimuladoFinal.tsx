'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MultipleChoiceQuestion } from '@/components/quiz/MultipleChoiceQuestion'
import { ProgressBar } from '@/components/progress/ProgressBar'
import { getScoreLabel } from '@/lib/scoring/calculator'
import type { QuestionWithOptions, AttemptResult } from '@/types'

interface SimuladoFinalProps {
  questions: (QuestionWithOptions & { missionTitle: string })[]
  revisionSlug: string
  revisionTitle: string
}

export function SimuladoFinal({ questions, revisionSlug, revisionTitle }: SimuladoFinalProps) {
  const router = useRouter()
  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [attempts, setAttempts] = useState<AttemptResult[]>([])
  const [done, setDone] = useState(false)

  const progress = Math.round((current / questions.length) * 100)

  async function handleAnswer(result: AttemptResult) {
    const newAttempts = [...attempts, result]
    setAttempts(newAttempts)

    try {
      await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: result.questionId,
          missionId: null,
          answerJson: { selected: result.selectedOption, entered: result.enteredValue, context: 'simulado' },
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

  if (!started) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
        <div className="bg-navy-gradient text-white rounded-3xl p-6 space-y-3">
          <p className="text-brand-gold text-xs font-bold uppercase tracking-widest">
            Simulado Final
          </p>
          <h1 className="text-2xl font-black">{revisionTitle}</h1>
          <p className="text-white/70 text-sm">
            {questions.length} questões mistas de todos os assuntos.
          </p>
        </div>

        <div className="card space-y-2">
          <p className="text-sm text-brand-navy font-medium">Assuntos abordados:</p>
          <ul className="space-y-1">
            {Array.from(new Set(questions.map((q) => q.missionTitle))).map((t) => (
              <li key={t} className="text-sm text-brand-gray-mid flex items-center gap-2">
                <span className="text-brand-gold">▸</span> {t}
              </li>
            ))}
          </ul>
        </div>

        <button onClick={() => setStarted(true)} className="btn-gold w-full py-4 text-base">
          Começar simulado
        </button>
        <button
          onClick={() => router.push(`/revisao/${revisionSlug}`)}
          className="btn-ghost w-full"
        >
          Voltar às missões
        </button>
      </main>
    )
  }

  if (done) {
    const correct = attempts.filter((a) => a.isCorrect).length
    const score = Math.round((correct / questions.length) * 100)
    const { label, color } = getScoreLabel(score)

    // Score by topic
    const topics = Array.from(new Set(questions.map((q) => q.missionTitle)))
    const topicScores = topics.map((topic) => {
      const topicQs = questions.filter((q) => q.missionTitle === topic)
      const topicAttempts = attempts.filter((a) =>
        topicQs.some((q) => q.id === a.questionId)
      )
      const topicCorrect = topicAttempts.filter((a) => a.isCorrect).length
      return {
        topic,
        score: Math.round((topicCorrect / topicQs.length) * 100),
        correct: topicCorrect,
        total: topicQs.length,
      }
    })

    return (
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
        <div className="bg-navy-gradient text-white rounded-3xl p-6 text-center space-y-3">
          <p className="text-brand-gold text-xs font-bold uppercase tracking-widest">
            Simulado concluído
          </p>
          <h1 className="text-5xl font-black">{score}%</h1>
          <p className={`font-bold text-lg ${color.replace('text-brand-', 'text-')}`}>
            {label}
          </p>
          <ProgressBar value={score} color={score >= 80 ? 'green' : 'gold'} />
          <p className="text-white/70 text-sm">
            {correct} de {questions.length} questões corretas
          </p>
        </div>

        {/* By topic */}
        <div className="card space-y-4">
          <h2 className="section-title">Resultado por assunto</h2>
          {topicScores.map((ts) => (
            <div key={ts.topic} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-brand-navy">{ts.topic}</span>
                <span className="text-xs font-bold text-brand-navy">
                  {ts.correct}/{ts.total} — {ts.score}%
                </span>
              </div>
              <ProgressBar
                value={ts.score}
                size="sm"
                color={ts.score >= 70 ? 'green' : 'navy'}
              />
              {ts.score < 70 && (
                <p className="text-xs text-amber-600">Revisão recomendada</p>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push(`/revisao/${revisionSlug}/relatorio`)}
            className="btn-gold w-full"
          >
            Ver relatório completo
          </button>
          <button
            onClick={() => router.push(`/revisao/${revisionSlug}`)}
            className="btn-outline w-full"
          >
            Voltar às missões
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-brand-navy">Simulado final</h1>
          <span className="text-xs text-brand-gray-mid">
            {current + 1}/{questions.length}
          </span>
        </div>
        <ProgressBar value={progress} size="sm" color="gold" />
        <p className="text-xs text-brand-gray-mid">
          Assunto: <span className="font-medium">{questions[current].missionTitle}</span>
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
