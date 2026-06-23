/**
 * Generate individual access codes for students.
 *
 * Usage:
 *   tsx scripts/generate-access-codes.ts [path-to-students-file] [--dry-run]
 *
 * Default file: data/students.local.json  (gitignored — never commit real student data)
 * Template:     data/students.sample.json (safe to commit — no real names)
 *
 * --dry-run  Validates the student file format without connecting to the database,
 *            generating codes, or printing any sensitive data. Safe for CI.
 *
 * File format:
 *   {
 *     "revisionSlug": "revisao-9ano-triangulos-sistemas",
 *     "daysValid": 15,
 *     "students": [
 *       { "displayName": "Nome Exibição", "grade": "9º ano", "groupLabel": "Turma A" }
 *     ]
 *   }
 *
 * The script prints each student's display name and generated code to the terminal.
 * Codes are stored in the database as bcrypt hashes only — the raw code is never saved.
 * Save the printed codes before closing the terminal; they cannot be recovered.
 */

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { generateRawCode } from '../src/lib/validation/code'

// ── Types ─────────────────────────────────────────────────────────────────────

interface StudentEntry {
  displayName: string
  grade: string
  groupLabel?: string
}

interface StudentsFile {
  revisionSlug: string
  daysValid: number
  students: StudentEntry[]
}

// ── Parse CLI args ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const fileArg = args.find((a) => !a.startsWith('--'))
const filePath = fileArg ?? path.resolve('data/students.local.json')

// ── Load student file ─────────────────────────────────────────────────────────

if (!fs.existsSync(filePath)) {
  console.error(`Student file not found: ${filePath}`)
  console.error('')
  console.error('Copy the sample and edit it:')
  console.error('  cp data/students.sample.json data/students.local.json')
  console.error('')
  console.error('data/students.local.json is gitignored and will not be committed.')
  process.exit(1)
}

let studentsFile: StudentsFile
try {
  studentsFile = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as StudentsFile
} catch {
  console.error(`Failed to parse ${filePath}`)
  process.exit(1)
}

// ── File format validation ────────────────────────────────────────────────────

function validateFileFormat(data: StudentsFile): string[] {
  const errs: string[] = []
  if (!data.revisionSlug || typeof data.revisionSlug !== 'string') {
    errs.push('revisionSlug must be a non-empty string')
  }
  if (!data.daysValid || typeof data.daysValid !== 'number' || data.daysValid <= 0) {
    errs.push('daysValid must be a positive number')
  }
  if (!Array.isArray(data.students) || data.students.length === 0) {
    errs.push('students must be a non-empty array')
  } else {
    data.students.forEach((s, i) => {
      if (!s.displayName || typeof s.displayName !== 'string') {
        errs.push(`students[${i}]: displayName must be a non-empty string`)
      }
      if (!s.grade || typeof s.grade !== 'string') {
        errs.push(`students[${i}]: grade must be a non-empty string`)
      }
      if (s.groupLabel !== undefined && typeof s.groupLabel !== 'string') {
        errs.push(`students[${i}]: groupLabel must be a string if provided`)
      }
    })
  }
  return errs
}

const formatErrors = validateFileFormat(studentsFile)
if (formatErrors.length > 0) {
  console.error(`Invalid file format in ${filePath}:`)
  formatErrors.forEach((e) => console.error(`  ✗ ${e}`))
  process.exit(1)
}

// ── Dry-run mode (no Supabase, no codes generated) ────────────────────────────

if (isDryRun) {
  console.log('\n[DRY-RUN] Validating student file — no codes will be generated.\n')
  console.log(`  File        : ${filePath}`)
  console.log(`  revisionSlug: ${studentsFile.revisionSlug}`)
  console.log(`  daysValid   : ${studentsFile.daysValid}`)
  console.log(`  students    : ${studentsFile.students.length} entr${studentsFile.students.length === 1 ? 'y' : 'ies'}`)
  console.log('')
  console.log('[DRY-RUN] File format is valid.')
  console.log('[DRY-RUN] No codes generated. Nothing written to the database.')
  process.exit(0)
}

// ── Production mode: require Supabase credentials ─────────────────────────────

function loadEnvLocal(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return {}
  const vars: Record<string, string> = {}
  for (const raw of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eqIdx = line.indexOf('=')
    if (eqIdx === -1) continue
    const key = line.slice(0, eqIdx).trim()
    const val = line.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
    vars[key] = val
  }
  return vars
}

const _env = loadEnvLocal()
const supabaseUrl = _env['NEXT_PUBLIC_SUPABASE_URL'] || process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = _env['SUPABASE_SERVICE_ROLE_KEY'] || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  console.error('Load your .env.local before running this script.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  const { revisionSlug, daysValid, students } = studentsFile

  const { data: revision } = await supabase
    .from('revisions')
    .select('id')
    .eq('slug', revisionSlug)
    .single()

  if (!revision) {
    console.error(`Revision not found: ${revisionSlug}`)
    console.error('Import the revision first: npm run import-revision')
    process.exit(1)
  }

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + daysValid)

  console.log('\nGenerating access codes...')
  console.log(`Revision : ${revisionSlug}`)
  console.log(`Expires  : ${expiresAt.toLocaleDateString('pt-BR')} (${daysValid} days)`)
  console.log(`Students : ${students.length}`)
  console.log('─'.repeat(50))

  let generated = 0

  for (const student of students) {
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
      console.error(`  ERROR creating student "${student.displayName}": ${sErr?.message}`)
      continue
    }

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
      console.error(`  ERROR creating code for "${student.displayName}": ${cErr.message}`)
      continue
    }

    console.log(`${student.displayName.padEnd(30)} → ${rawCode}`)
    generated++
  }

  console.log('─'.repeat(50))
  console.log(`\n${generated}/${students.length} código(s) gerado(s).`)
  console.log('Guarde esses códigos — eles não ficam salvos no banco em texto puro.')
  console.log(`\nLink de acesso: /acessar/${revisionSlug}`)
}

main().catch(console.error)
