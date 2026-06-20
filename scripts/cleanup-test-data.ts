/**
 * Limpeza supervisionada de dados fictícios de teste.
 *
 * Remove apenas registros claramente marcados como teste pelo campo
 * display_name = 'Aluno Teste Visual'. Nunca apaga dados de alunos reais.
 *
 * MODOS:
 *   npx tsx scripts/cleanup-test-data.ts            → dry-run (padrão, seguro)
 *   npx tsx scripts/cleanup-test-data.ts --confirm  → executa limpeza real
 *
 * SEGURANÇA:
 *   - Não imprime códigos brutos, hashes, secrets ou IDs completos.
 *   - Só apaga registros de alunos com display_name exato 'Aluno Teste Visual'.
 *   - Cascata: access_codes, attempts, mission_progress, revision_progress
 *     referenciados pelo student_id são removidos junto.
 *   - Em dry-run, imprime o que seria removido sem alterar o banco.
 */

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const CONFIRM = process.argv.includes('--confirm')
const TEST_DISPLAY_NAME = 'Aluno Teste Visual'

// ── Carrega .env.local ─────────────────────────────────────────────────────────

function loadEnvLocal(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return {}
  const vars: Record<string, string> = {}
  for (const raw of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eqIdx = line.indexOf('=')
    if (eqIdx === -1) continue
    vars[line.slice(0, eqIdx).trim()] = line.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
  }
  return vars
}

const env = loadEnvLocal()
const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL']
const serviceKey = env['SUPABASE_SERVICE_ROLE_KEY']

if (!supabaseUrl || !serviceKey) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontrados em .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const mode = CONFIRM ? 'LIMPEZA REAL' : 'DRY-RUN (nenhuma alteração será feita)'
  console.log(`\n=== Questão Certeira — Limpeza de Dados de Teste ===`)
  console.log(`Modo    : ${mode}`)
  console.log(`Critério: display_name = '${TEST_DISPLAY_NAME}'\n`)

  // 1. Localizar alunos de teste
  const { data: testStudents, error: stuErr } = await supabase
    .from('students')
    .select('id')
    .eq('display_name', TEST_DISPLAY_NAME)

  if (stuErr) {
    console.error('ERROR ao consultar students:', stuErr.message)
    process.exit(1)
  }

  if (!testStudents || testStudents.length === 0) {
    console.log(`✓ Nenhum aluno com display_name '${TEST_DISPLAY_NAME}' encontrado. Banco já está limpo.\n`)
    return
  }

  const studentIds = testStudents.map((s) => s.id)
  console.log(`Alunos de teste encontrados : ${studentIds.length}`)

  // 2. Contar registros dependentes (sem imprimir IDs completos)
  const tables = [
    { name: 'access_codes', column: 'student_id' },
    { name: 'attempts', column: 'student_id' },
    { name: 'mission_progress', column: 'student_id' },
    { name: 'revision_progress', column: 'student_id' },
  ] as const

  const counts: Record<string, number> = {}
  for (const { name, column } of tables) {
    const { count, error } = await supabase
      .from(name)
      .select('*', { count: 'exact', head: true })
      .in(column, studentIds)
    if (error) {
      console.error(`ERROR ao contar ${name}:`, error.message)
      process.exit(1)
    }
    counts[name] = count ?? 0
  }

  console.log(`\nRegistros que serão removidos:`)
  console.log(`  students          : ${studentIds.length}`)
  for (const [table, count] of Object.entries(counts)) {
    console.log(`  ${table.padEnd(20)}: ${count}`)
  }
  console.log('')

  if (!CONFIRM) {
    console.log('DRY-RUN: Nenhuma alteração foi feita.')
    console.log('Para executar a limpeza real, rode:')
    console.log('  npx tsx scripts/cleanup-test-data.ts --confirm\n')
    return
  }

  // 3. Limpeza real — ordem importa por causa das FKs
  //    (access_codes, attempts, mission_progress, revision_progress → students)
  console.log('Iniciando limpeza...')

  for (const { name, column } of tables) {
    const { error } = await supabase
      .from(name)
      .delete()
      .in(column, studentIds)
    if (error) {
      console.error(`  ✗ Erro ao apagar ${name}:`, error.message)
      process.exit(1)
    }
    console.log(`  ✓ ${name} limpo (${counts[name]} registro(s))`)
  }

  const { error: stuDelErr } = await supabase
    .from('students')
    .delete()
    .in('id', studentIds)
  if (stuDelErr) {
    console.error('  ✗ Erro ao apagar students:', stuDelErr.message)
    process.exit(1)
  }
  console.log(`  ✓ students limpo (${studentIds.length} registro(s))`)

  console.log('\n✓ Limpeza concluída. Banco pronto para piloto com dados reais.\n')
}

main().catch((err) => {
  console.error('Erro inesperado:', err)
  process.exit(1)
})
