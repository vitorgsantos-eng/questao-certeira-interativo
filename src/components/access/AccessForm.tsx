'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/layout/Logo'

interface AccessFormProps {
  revisionSlug: string
  revisionTitle: string
  revisionGrade: string
}

export function AccessForm({ revisionSlug, revisionTitle, revisionGrade }: AccessFormProps) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const cleaned = code.toUpperCase().replace(/[^A-Z0-9-]/g, '')
    if (!cleaned) {
      setError('Digite seu código de acesso.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleaned, revisionSlug }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message ?? 'Código inválido. Verifique e tente novamente.')
        setLoading(false)
        return
      }

      router.push(`/revisao/${revisionSlug}`)
    } catch {
      setError('Não foi possível verificar o código. Tente novamente.')
      setLoading(false)
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    let v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (v.length > 2) v = v.slice(0, 2) + '-' + v.slice(2)
    if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5)
    if (v.length > 10) v = v.slice(0, 10)
    setCode(v)
    setError('')
  }

  return (
    <main className="min-h-screen bg-navy-gradient flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-sm w-full space-y-8 animate-slide-up">
        {/* Logo */}
        <div className="text-center">
          <Logo variant="light" size="md" className="justify-center" />
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          {/* Revision info */}
          <div className="text-center">
            <span className="badge-navy text-xs mb-3 inline-block">{revisionGrade}</span>
            <h1 className="text-xl font-bold text-brand-navy leading-tight">
              {revisionTitle}
            </h1>
            <p className="text-sm text-brand-gray-mid mt-1">
              Digite seu código para começar.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="code"
                className="block text-xs font-semibold text-brand-navy mb-1.5 uppercase tracking-wide"
              >
                Código de acesso
              </label>
              <input
                ref={inputRef}
                id="code"
                type="text"
                value={code}
                onChange={handleInput}
                placeholder="QC-AB-1234"
                className="input-field text-center text-xl font-bold tracking-widest uppercase"
                autoComplete="off"
                autoFocus
                maxLength={10}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 font-medium animate-fade-in">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || code.length < 10}
              className="btn-primary w-full text-base py-4"
            >
              {loading ? 'Verificando...' : 'Entrar na revisão'}
            </button>
          </form>

          {/* Help */}
          <p className="text-xs text-center text-brand-gray-mid">
            O código foi enviado pelo seu professor.
            <br />
            Formato: <span className="font-mono font-bold">QC-XX-XXXX</span>
          </p>
        </div>
      </div>
    </main>
  )
}
