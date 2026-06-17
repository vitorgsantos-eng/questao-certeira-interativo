'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function TeacherLogin() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/professor/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message ?? 'Código incorreto.')
        setLoading(false)
        return
      }

      router.refresh()
    } catch {
      setError('Erro ao verificar código. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 space-y-5">
      <div className="text-center">
        <h2 className="text-xl font-bold text-brand-navy">Acesso restrito</h2>
        <p className="text-sm text-brand-gray-mid mt-1">
          Digite o código de acesso do professor.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setError('')
          }}
          placeholder="Código de acesso"
          className="input-field text-center"
          autoFocus
        />
        {error && (
          <p className="text-sm text-red-600 font-medium text-center">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading || !code}
          className="btn-primary w-full py-4"
        >
          {loading ? 'Verificando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
