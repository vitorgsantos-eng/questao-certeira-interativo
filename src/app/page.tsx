import Link from 'next/link'
import { Logo } from '@/components/layout/Logo'
import { createServiceClient, hasSupabaseServiceConfig } from '@/lib/supabase/server'
import type { Revision } from '@/types'

async function getActiveRevisions(): Promise<Revision[]> {
  if (!hasSupabaseServiceConfig()) return []
  try {
    const supabase = await createServiceClient()
    const { data } = await supabase
      .from('revisions')
      .select('id, slug, title, grade, description, status, valid_from, valid_until, created_at, schema_version, subject, visual_config')
      .eq('status', 'active')
      .order('created_at')
    return data ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const revisions = await getActiveRevisions()

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
                Revisão interativa por missões curtas, feedback imediato
                e relatório de desempenho por assunto.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {revisions.length === 1 && (
                <Link
                  href={`/acessar/${revisions[0].slug}`}
                  className="btn-primary py-4 text-base shadow-lg"
                >
                  Acessar revisão
                </Link>
              )}
              {revisions.length > 1 && (
                <p className="rounded-xl border border-brand-gray-border bg-white/80 px-4 py-3 text-sm font-semibold text-brand-navy">
                  Use o link da sua revisão para acessar.
                </p>
              )}
              {revisions.length === 0 && (
                <p className="rounded-xl border border-brand-gray-border bg-white/80 px-4 py-3 text-sm font-semibold text-brand-navy">
                  Acesse pelo link enviado pelo seu professor.
                </p>
              )}
              <Link href="/professor" className="btn-outline py-4 text-base">
                Área do professor
              </Link>
            </div>
          </div>

          <div className="card relative overflow-hidden p-5 sm:p-7">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[4rem] bg-brand-gold/10" />
            <div className="relative space-y-5">
              {revisions.length > 0 ? (
                <>
                  <div className="border-b border-brand-gray-border pb-4">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
                      {revisions.length === 1 ? 'Revisão disponível' : 'Revisões disponíveis'}
                    </p>
                  </div>
                  <ul className="space-y-3">
                    {revisions.map((rev) => (
                      <li key={rev.id}>
                        <Link
                          href={`/acessar/${rev.slug}`}
                          className="flex items-center gap-3 rounded-xl border border-brand-gray-border bg-brand-bg-light/70 p-3 transition-colors hover:bg-brand-gold/5"
                        >
                          <span className="flex-1">
                            <span className="block text-sm font-bold text-brand-navy">{rev.title}</span>
                            <span className="text-xs text-brand-graphite">
                              {rev.subject ? `${rev.subject} · ` : ''}{rev.grade}
                              {rev.visual_config?.missionMapBadge ? ` · ${rev.visual_config.missionMapBadge}` : ''}
                            </span>
                          </span>
                          <span className="badge-gold">Acessar</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <div className="border-b border-brand-gray-border pb-4">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
                      Como funciona
                    </p>
                  </div>
                  <ul className="space-y-3">
                    {[
                      ['01', 'Receba o link da revisão'],
                      ['02', 'Digite seu código de acesso'],
                      ['03', 'Complete as missões no seu ritmo'],
                      ['04', 'Veja seu relatório de desempenho'],
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
                      <p className="text-2xl font-black text-brand-navy">100%</p>
                      <p className="text-xs text-brand-gray-mid">feedback pedagógico</p>
                    </div>
                  </div>
                </>
              )}
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
