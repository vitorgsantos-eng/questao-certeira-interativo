import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { TeacherDashboard } from '@/components/reports/TeacherDashboard'
import { TeacherLogin } from '@/components/reports/TeacherLogin'
import { Logo } from '@/components/layout/Logo'
import { getSecret } from '@/lib/auth-lite/session'
import { deserializeProfessorSession, PROFESSOR_COOKIE } from '@/lib/auth-lite/professor-session'

async function logoutProfessor() {
  'use server'
  const cookieStore = await cookies()
  cookieStore.delete(PROFESSOR_COOKIE)
  redirect('/professor')
}

export default async function ProfessorPage() {
  const cookieStore = await cookies()
  const raw = cookieStore.get(PROFESSOR_COOKIE)?.value
  const professorSession = raw ? deserializeProfessorSession(raw, getSecret()) : null

  if (!professorSession) {
    return (
      <main className="min-h-screen bg-navy-gradient flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <Logo variant="light" size="md" className="justify-center" />
            <p className="text-white/70 text-sm mt-3">Área do professor</p>
          </div>
          <TeacherLogin />
        </div>
      </main>
    )
  }

  const supabase = await createServiceClient()

  const { data: revisions } = await supabase
    .from('revisions')
    .select('id, slug, title, grade, status')
    .order('created_at', { ascending: false })

  const { data: accessCodes } = await supabase
    .from('access_codes')
    .select('id, student_id, revision_id, status, expires_at, last_used_at')

  const { data: students } = await supabase
    .from('students')
    .select('id, display_name, grade, group_label')

  const { data: missionProgresses } = await supabase
    .from('mission_progress')
    .select('*')

  const { data: revisionProgresses } = await supabase
    .from('revision_progress')
    .select('*')

  return (
    <>
      <header className="bg-brand-navy text-white px-4 py-3 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Logo variant="light" size="sm" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-brand-gold font-semibold">Painel do professor</span>
            <form action={logoutProfessor}>
              <button
                type="submit"
                className="text-sm text-white/60 hover:text-white underline underline-offset-2 transition-colors"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      <TeacherDashboard
        revisions={revisions ?? []}
        accessCodes={accessCodes ?? []}
        students={students ?? []}
        missionProgresses={missionProgresses ?? []}
        revisionProgresses={revisionProgresses ?? []}
      />
    </>
  )
}
