/**
 * Generate individual access codes for students.
 * Usage: tsx scripts/generate-access-codes.ts
 *
 * Configure the STUDENTS array below, then run the script.
 * The script prints the codes to the console (save them to distribute to students).
 */

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

const REVISION_SLUG = 'revisao-9ano-triangulos-sistemas'
const DAYS_VALID = 15

// Configure your students here before running
const STUDENTS: Array<{ displayName: string; grade: string; groupLabel?: string }> = [
  { displayName: 'Aluno Teste', grade: '9º ano', groupLabel: 'Turma A' },
  // Add more students as needed:
  // { displayName: 'Maria S.', grade: '9º ano', groupLabel: 'Turma A' },
]

function generateRawCode(prefix = 'QC'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const part1 = Array.from({ length: 2 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('')
  const part2 = Array.from({ length: 4 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('')
  return `${prefix}-${part1}-${part2}`
}

async function main() {
  const { data: revision } = await supabase
    .from('revisions')
    .select('id')
    .eq('slug', REVISION_SLUG)
    .single()

  if (!revision) {
    console.error(`Revision not found: ${REVISION_SLUG}`)
    console.error('Import the revision first: npm run import-revision')
    process.exit(1)
  }

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + DAYS_VALID)

  console.log('\nGenerating access codes...')
  console.log(`Revision: ${REVISION_SLUG}`)
  console.log(`Expires: ${expiresAt.toLocaleDateString('pt-BR')}\n`)
  console.log('─'.repeat(50))

  const results: Array<{ name: string; code: string }> = []

  for (const student of STUDENTS) {
    // Create student
    const { data: s, error: sErr } = await supabase
      .from('students')
      .insert({
        display_name: student.displayName,
        grade: student.grade,
        group_label: student.groupLabel ?? null,
      })
      .select('id')
      .single()

    if (sErr || !s) {
      console.error(`Error creating student ${student.displayName}:`, sErr?.message)
      continue
    }

    // Generate and hash code
    const rawCode = generateRawCode()
    const codeHash = await bcrypt.hash(rawCode, 10)

    const { error: cErr } = await supabase.from('access_codes').insert({
      student_id: s.id,
      revision_id: revision.id,
      code_hash: codeHash,
      status: 'active',
      expires_at: expiresAt.toISOString(),
    })

    if (cErr) {
      console.error(`Error creating code for ${student.displayName}:`, cErr.message)
      continue
    }

    results.push({ name: student.displayName, code: rawCode })
    console.log(`${student.displayName.padEnd(25)} → ${rawCode}`)
  }

  console.log('─'.repeat(50))
  console.log(`\n${results.length} código(s) gerado(s).`)
  console.log('Guarde esses códigos — eles não ficam salvos no banco em texto puro.')
  console.log(`\nLink de acesso: /acessar/${REVISION_SLUG}`)
}

main().catch(console.error)
