import Link from 'next/link'
import { Logo } from '@/components/layout/Logo'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-brand-ornament px-4 py-8 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col justify-center gap-10 animate-fade-in">
        <section className="grid items-center gap-8 md:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-7">
            <Logo variant="dark" size="lg" />
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-gold">
                Missões que ensinam
              </p>
              <h1 className="max-w-2xl text-4xl font-black leading-tight text-brand-navy sm:text-5xl">
                Aprender com clareza e evoluir com confiança.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-brand-graphite">
                Revisão interativa de Matemática por missões curtas, feedback imediato
                e relatório de desempenho por assunto.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/acessar/revisao-9ano-triangulos-sistemas"
                className="btn-primary py-4 text-base shadow-lg"
              >
                Acessar revisão
              </Link>
              <Link href="/professor" className="btn-outline py-4 text-base">
                Área do professor
              </Link>
            </div>
          </div>

          <div className="card relative overflow-hidden p-5 sm:p-7">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[4rem] bg-brand-gold/10" />
            <div className="relative space-y-5">
              <div className="flex items-center justify-between border-b border-brand-gray-border pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
                    Trilha piloto
                  </p>
                  <h2 className="mt-1 text-xl font-black text-brand-navy">9º ano</h2>
                </div>
                <span className="badge-gold">4 missões</span>
              </div>

              <ul className="space-y-3">
                {[
                  ['01', 'Semelhança de triângulos'],
                  ['02', 'Relações métricas'],
                  ['03', 'Trigonometria no triângulo retângulo'],
                  ['04', 'Sistemas com equações do 2º grau'],
                ].map(([step, label]) => (
                  <li
                    key={step}
                    className="flex items-center gap-3 rounded-xl border border-brand-gray-border bg-brand-bg-light/70 p-3"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-navy text-sm font-black text-white">
                      {step}
                    </span>
                    <span className="text-sm font-semibold text-brand-navy">{label}</span>
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-2 gap-3 pt-1 text-center">
                <div className="rounded-xl border border-brand-gray-border bg-white p-3">
                  <p className="text-2xl font-black text-brand-navy">5-8</p>
                  <p className="text-xs text-brand-gray-mid">min por missão</p>
                </div>
                <div className="rounded-xl border border-brand-gray-border bg-white p-3">
                  <p className="text-2xl font-black text-brand-navy">20</p>
                  <p className="text-xs text-brand-gray-mid">questões piloto</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ul className="grid gap-3 text-sm text-brand-navy sm:grid-cols-4">
          {[
            'Missões que ensinam.',
            'Prática que gera resultados.',
            'Desempenho que evolui.',
            'Confiança que acompanha.',
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 border-t border-brand-gold/40 pt-3 font-semibold"
            >
              <span className="text-brand-gold">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
