'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { LessonBlock } from './LessonBlock'
import { MultipleChoiceQuestion } from '@/components/quiz/MultipleChoiceQuestion'
import { NumericQuestion } from '@/components/quiz/NumericQuestion'
import { ProgressBar } from '@/components/progress/ProgressBar'
import { MathText } from '@/components/math/MathText'
import { calculateScore } from '@/lib/scoring/calculator'
import type {
  ContentBlockData,
  QuestionWithOptions,
  AttemptResult,
  Mission,
} from '@/types'

type Phase = 'lesson' | 'quiz' | 'result'

interface MissionPlayerProps {
  mission: Mission
  blocks: ContentBlockData[]
  questions: QuestionWithOptions[]
  revisionSlug: string
  studentId: string
  revisionId: string
}

export function MissionPlayer({
  mission,
  blocks,
  questions,
  revisionSlug,
}: MissionPlayerProps) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('lesson')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [attempts, setAttempts] = useState<AttemptResult[]>([])
  const [saving, setSaving] = useState(false)

  const score = calculateScore(attempts)

  const saveAttempt = useCallback(async (result: AttemptResult) => {
    try {
      await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: result.questionId,
          missionId: mission.id,
          answerJson: {
            selected: result.selectedOption,
            entered: result.enteredValue,
          },
          isCorrect: result.isCorrect,
          errorCategory: result.errorCategory,
          timeSpentSeconds: 0,
        }),
      })
    } catch {
      // non-blocking — continue even if saving fails
    }
  }, [mission.id])

  const saveProgress = useCallback(async (finalScore: number) => {
    setSaving(true)
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionId: mission.id,
          status: 'completed',
          score: finalScore,
        }),
      })
    } catch {
      // non-blocking
    } finally {
      setSaving(false)
    }
  }, [mission.id])

  const handleAnswer = useCallback(
    async (result: AttemptResult) => {
      const newAttempts = [...attempts, result]
      setAttempts(newAttempts)
      await saveAttempt(result)

      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion((q) => q + 1)
      } else {
        // Completed all questions
        const finalScore = calculateScore(newAttempts)
        await saveProgress(finalScore)
        setPhase('result')
      }
    },
    [attempts, currentQuestion, questions.length, saveAttempt, saveProgress]
  )

  if (phase === 'lesson') {
    return (
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5 pb-24">
        {/* Mission header */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-brand-gold uppercase tracking-widest">
            Missão
          </p>
          <h1 className="text-2xl font-black text-brand-navy">{mission.title}</h1>
          <p className="text-sm text-brand-gray-mid">{mission.goal}</p>
        </div>

        {/* Lesson blocks */}
        {blocks.map((block, i) => (
          <LessonBlock key={i} block={block} />
        ))}

        {/* Start quiz */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-gray-soft p-4">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setPhase('quiz')}
              className="btn-gold w-full py-4 text-base"
            >
              Iniciar questões ({questions.length} questões)
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (phase === 'quiz') {
    const q = questions[currentQuestion]
    const progress = Math.round(((currentQuestion) / questions.length) * 100)

    return (
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Quiz progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-brand-navy">{mission.short_title}</h2>
            <span className="text-xs text-brand-gray-mid">
              {currentQuestion + 1}/{questions.length}
            </span>
          </div>
          <ProgressBar value={progress} size="sm" color="gold" />
        </div>

        {q.type === 'multiple_choice' ? (
          <MultipleChoiceQuestion
            key={q.id}
            question={q}
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
          />
        ) : (
          <NumericQuestion
            key={q.id}
            question={q as Parameters<typeof NumericQuestion>[0]['question']}
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
          />
        )}
      </main>
    )
  }

  // Result phase
  const correctCount = attempts.filter((a) => a.isCorrect).length
  const weakTopics = attempts
    .filter((a) => !a.isCorrect && a.errorCategory)
    .map((a) => a.errorCategory)

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      {/* Score card */}
      <div className="bg-navy-gradient text-white rounded-3xl p-6 text-center space-y-3">
        <p className="text-brand-gold text-xs font-bold uppercase tracking-widest">
          Missão concluída
        </p>
        <h1 className="text-4xl font-black">{score}%</h1>
        <p className="text-white/80 text-sm">
          {correctCount} de {questions.length} questões corretas
        </p>
        <ProgressBar value={score} color={score >= 80 ? 'green' : 'gold'} />
      </div>

      {/* Weak topics */}
      {weakTopics.length > 0 && (
        <div className="card space-y-2">
          <h2 className="section-title">Pontos a revisar</h2>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(weakTopics)).map((t) => (
              <span key={String(t)} className="badge-warning">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Error review */}
      {attempts.some((a) => !a.isCorrect) && (
        <div className="card space-y-4">
          <h2 className="section-title">Revisão dos erros</h2>
          {attempts
            .filter((a) => !a.isCorrect)
            .map((a, i) => {
              const q = questions.find((q) => q.id === a.questionId)
              return (
                <div
                  key={i}
                  className="border border-red-100 rounded-xl p-4 space-y-2 bg-red-50/50"
                >
                  <p className="text-sm font-medium text-brand-navy">
                    <MathText text={q?.statement ?? ''} />
                  </p>
                  <p className="text-xs text-red-700">
                    <MathText text={a.feedback} />
                  </p>
                  {a.correctAnswerText && (
                    <p className="text-xs font-bold text-brand-navy">
                      Resposta correta: <MathText text={a.correctAnswerText} />
                    </p>
                  )}
                </div>
              )
            })}
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={() => {
            setPhase('lesson')
            setCurrentQuestion(0)
            setAttempts([])
          }}
          className="btn-outline w-full"
        >
          Refazer missão
        </button>
        <button
          onClick={() => router.push(`/revisao/${revisionSlug}`)}
          disabled={saving}
          className="btn-primary w-full"
        >
          {saving ? 'Salvando...' : 'Voltar ao mapa de missões'}
        </button>
      </div>
    </main>
  )
}
