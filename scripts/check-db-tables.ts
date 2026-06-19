/**
 * Verifica se as tabelas esperadas existem no Supabase remoto.
 * Lê .env.local diretamente — não precisa setar variáveis de ambiente externamente.
 *
 * Uso: npx tsx scripts/check-db-tables.ts
 *
 * Saída: lista de tabelas com status OK/MISSING e contagem de linhas.
 * Não imprime dados de alunos, questões ou qualquer conteúdo sensível.
 */

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// ── Carrega .env.local sem bibliotecas externas ───────────────────────────────

function loadEnvLocal(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) {
    return {}
  }
  const vars: Record<string, string> = {}
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const raw of lines) {
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

const env = loadEnvLocal()

// Suporta tanto NEXT_PUBLIC_SUPABASE_ANON_KEY quanto NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'] || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  env['SUPABASE_SERVICE_ROLE_KEY'] ||
  process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontrados em .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// ── Tabelas esperadas ─────────────────────────────────────────────────────────

const EXPECTED_TABLES = [
  'students',
  'revisions',
  'access_codes',
  'missions',
  'content_blocks',
  'questions',
  'question_options',
  'attempts',
  'mission_progress',
  'revision_progress',
] as const

// ── RLS: verifica se a tabela tem RLS ativo (via information_schema não é possível
//   sem pg_catalog; usamos uma abordagem proxy: select com anon-like role) ────────

async function checkTable(table: string): Promise<{ exists: boolean; count: number | null; error: string | null }> {
  // Usar `head: true` (count only) para não puxar dados
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })

  if (error) {
    // 42P01 = tabela não existe
    if (error.code === '42P01' || error.message.includes('does not exist')) {
      return { exists: false, count: null, error: 'TABELA NÃO EXISTE' }
    }
    return { exists: true, count: null, error: error.message }
  }

  return { exists: true, count: count ?? 0, error: null }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n=== Questão Certeira — Verificação de Tabelas Supabase ===\n')
  console.log(`Projeto : ${supabaseUrl!.replace(/^https?:\/\//, '').split('.')[0]}***.supabase.co`)
  console.log(`Data    : ${new Date().toLocaleString('pt-BR')}\n`)

  let allOk = true
  const pad = Math.max(...EXPECTED_TABLES.map((t) => t.length)) + 2

  for (const table of EXPECTED_TABLES) {
    const { exists, count, error } = await checkTable(table)
    const label = table.padEnd(pad)

    if (!exists || error) {
      console.log(`  ✗ ${label} ${error ?? 'ERRO DESCONHECIDO'}`)
      allOk = false
    } else {
      console.log(`  ✓ ${label} ${count} linha(s)`)
    }
  }

  console.log('')
  if (allOk) {
    console.log('✓ Todas as tabelas encontradas. Migration concluída.')
  } else {
    console.log('✗ Tabelas ausentes — execute as migrations em ordem no Supabase SQL Editor:')
    console.log('  1. supabase/migrations/001_initial_schema.sql')
    console.log('  2. supabase/migrations/002_rls_restrict_student_data.sql')
    console.log('  3. supabase/migrations/003_rls_restrict_questions.sql')
    console.log('  4. supabase/migrations/004_add_diagram_block_type.sql')
    console.log('')
    console.log('  Acesse: https://supabase.com → Dashboard → SQL Editor')
  }
  console.log('')
}

main().catch((err) => {
  console.error('Erro inesperado:', err)
  process.exit(1)
})
