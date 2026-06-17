import Link from 'next/link'
import { Logo } from '@/components/layout/Logo'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-navy-gradient flex flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6 max-w-sm animate-fade-in">
        <Logo variant="light" size="md" className="justify-center" />
        <div>
          <h1 className="text-6xl font-black text-white">404</h1>
          <p className="text-white/70 mt-2">Página não encontrada.</p>
        </div>
        <Link href="/" className="btn-gold inline-block">
          Voltar ao início
        </Link>
      </div>
    </main>
  )
}
