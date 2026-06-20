/**
 * Testa o comportamento da API de validação com:
 *   1. Código expirado  → espera HTTP 403 com mensagem de expiração
 *   2. Código revogado  → espera HTTP 401 (filtrado antes do bcrypt)
 *
 * O script gera códigos fictícios descartáveis, insere registros temporários
 * no banco (apenas para este teste), chama o servidor local e limpa tudo ao final.
 *
 * SEGURANÇA:
 *   - Os códigos brutos são gerados aleatoriamente aqui e nunca gravados em log.
 *   - Não usa nem altera dados de alunos reais.
 *   - Limpa os registros inseridos ao final — mesmo em caso de erro.
 */

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

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
    const key = line.slice(0, eqIdx).trim()
    const val = line.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
    vars[key] = val
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function assert(condition: boolean, message: string, results: { passed: number; failed: number }) {
  if (condition) {
    console.log(`  [PASS] ${message}`)
    results.passed++
  } else {
    console.error(`  [FAIL] ${message}`)
    results.failed++
  }
}

async function callValidateCode(code: string, revisionSlug: string) {
  const res = await fetch('http://localhost:3010/api/auth/validate-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, revisionSlug }),
  })
  const body = await res.json().catch(() => ({})) as Record<string, unknown>
  return { status: res.status, body }
}

// ── Main ──────────────────────────────────────────────────────────────────────

const insertedIds: string[] = []

async function cleanup() {
  if (insertedIds.length === 0) return
  const { error } = await supabase.from('access_codes').delete().in('id', insertedIds)
  if (error) console.warn('  [WARN] Limpeza parcial:', error.message)
  else console.log(`  [OK] ${insertedIds.length} registro(s) temporário(s) removido(s) do banco.`)
}

async function main() {
  console.log('\n=== TESTE: Código Expirado e Revogado ===\n')

  const results = { passed: 0, failed: 0 }

  // ── 1. Buscar IDs necessários ──────────────────────────────────────────────
  const { data: revision, error: revErr } = await supabase
    .from('revisions')
    .select('id')
    .eq('slug', 'revisao-9ano-triangulos-sistemas')
    .eq('status', 'active')
    .single()

  if (revErr || !revision) {
    console.error('ERROR: Revisão piloto não encontrada no banco. Execute VIT-32 primeiro.')
    process.exit(1)
  }

  const { data: students, error: stuErr } = await supabase
    .from('students')
    .select('id')
    .limit(1)

  if (stuErr || !students || students.length === 0) {
    console.error('ERROR: Nenhum aluno fictício encontrado. Execute generate-codes primeiro.')
    process.exit(1)
  }

  const studentId = students[0].id
  const revisionId = revision.id
  const revisionSlug = 'revisao-9ano-triangulos-sistemas'

  // ── 2. Teste 1 — Código EXPIRADO ───────────────────────────────────────────
  console.log('--- Teste 1: Código Expirado ---')

  // normalizeCode() no servidor faz .toUpperCase() antes do bcrypt.compare
  const rawExpired = crypto.randomBytes(8).toString('hex').toUpperCase() // nunca logado
  const hashExpired = await bcrypt.hash(rawExpired, 10)
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const { data: insertedExpired, error: insExpErr } = await supabase
    .from('access_codes')
    .insert({
      student_id: studentId,
      revision_id: revisionId,
      code_hash: hashExpired,
      status: 'active',
      expires_at: yesterday,
    })
    .select('id')
    .single()

  if (insExpErr || !insertedExpired) {
    console.error('ERROR: Falha ao inserir código expirado de teste:', insExpErr?.message)
    await cleanup()
    process.exit(1)
  }

  insertedIds.push(insertedExpired.id)

  const res1 = await callValidateCode(rawExpired, revisionSlug)
  assert(res1.status === 403, `Código expirado retorna HTTP 403 (obteve ${res1.status})`, results)
  assert(
    typeof res1.body.message === 'string' && (res1.body.message as string).toLowerCase().includes('expirou'),
    `Mensagem contém "expirou" (obteve: "${res1.body.message}")`,
    results
  )
  assert(
    res1.body.ok !== true,
    'Sessão NÃO criada (ok !== true)',
    results
  )
  console.log(`  [INFO] Mensagem da API: "${res1.body.message}"`)

  // ── 3. Teste 2 — Código REVOGADO ───────────────────────────────────────────
  console.log('\n--- Teste 2: Código Revogado ---')

  const rawRevoked = crypto.randomBytes(8).toString('hex').toUpperCase() // nunca logado
  const hashRevoked = await bcrypt.hash(rawRevoked, 10)
  const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()

  const { data: insertedRevoked, error: insRevErr } = await supabase
    .from('access_codes')
    .insert({
      student_id: studentId,
      revision_id: revisionId,
      code_hash: hashRevoked,
      status: 'revoked',
      expires_at: nextYear,
    })
    .select('id')
    .single()

  if (insRevErr || !insertedRevoked) {
    console.error('ERROR: Falha ao inserir código revogado de teste:', insRevErr?.message)
    await cleanup()
    process.exit(1)
  }

  insertedIds.push(insertedRevoked.id)

  const res2 = await callValidateCode(rawRevoked, revisionSlug)
  assert(res2.status === 401, `Código revogado retorna HTTP 401 (obteve ${res2.status})`, results)
  assert(
    typeof res2.body.message === 'string' && (res2.body.message as string).toLowerCase().includes('inválido'),
    `Mensagem contém "inválido" (obteve: "${res2.body.message}")`,
    results
  )
  assert(
    res2.body.ok !== true,
    'Sessão NÃO criada (ok !== true)',
    results
  )
  console.log(`  [INFO] Mensagem da API: "${res2.body.message}"`)

  // ── 4. Diferença entre os dois fluxos ─────────────────────────────────────
  console.log('\n--- Teste 3: Diferença entre expirado e revogado ---')
  assert(
    res1.status !== res2.status,
    `Códigos expirado (${res1.status}) e revogado (${res2.status}) retornam status HTTP diferentes`,
    results
  )
  assert(
    res1.body.message !== res2.body.message,
    'Mensagens de erro são distintas (expirado vs revogado)',
    results
  )

  // ── Limpeza ────────────────────────────────────────────────────────────────
  console.log('')
  await cleanup()

  // ── Resultado ─────────────────────────────────────────────────────────────
  console.log(`\n=== RESULTS: ${results.passed} Passed, ${results.failed} Failed ===\n`)
  if (results.failed > 0) process.exit(1)
}

main().catch(async (err) => {
  console.error('Erro inesperado:', err)
  await cleanup()
  process.exit(1)
})
