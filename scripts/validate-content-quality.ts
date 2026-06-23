#!/usr/bin/env tsx
/**
 * validate-content-quality.ts
 *
 * Validador de qualidade pedagógica para revisões do Questão Certeira Interativo.
 * Complementa validate-content.ts (estrutura) com critérios pedagógicos.
 *
 * Critérios verificados:
 *  - Presença de elemento visual (diagram ou visual_explanation) por missão
 *  - Mínimo de 2 worked_example por missão em revisões de Matemática
 *  - Presença de hint e summary por missão
 *  - Presença de [PLACEHOLDER] em qualquer texto (erro)
 *  - Feedbacks muito curtos (< 40 chars)
 *  - Fórmulas prováveis sem delimitadores $...$ (texto com ^, sqrt, sen, cos etc.)
 *  - Ausência de dificuldades basic e challenge nas questões
 *  - Questões de múltipla escolha sem feedback pedagógico
 *
 * Uso:
 *   tsx scripts/validate-content-quality.ts content/revisions/
 *   tsx scripts/validate-content-quality.ts content/revisions/revisao-9ano.json
 */

import fs from 'fs'
import path from 'path'

// ── Thresholds ─────────────────────────────────────────────────────────────────

const MIN_FEEDBACK_LENGTH = 40
const MIN_WORKED_EXAMPLES_MATH = 2
const PLACEHOLDER_RE = /\[PLACEHOLDER[^\]]*\]/i

// Padrões suspeitos de fórmula sem $...$
// (não captura o que já está dentro de $...$)
const FORMULA_HINT_RE = /(?<!\$)[a-zA-Z]\^[0-9]|sqrt\s*\(|\\frac|\\sqrt|(?<!\$)sen\s*\(|(?<!\$)cos\s*\(|(?<!\$)tg\s*\(/

// ── Types (minimal) ────────────────────────────────────────────────────────────

interface Block {
  type: string
  text?: string
  title?: string
  highlight?: string
  items?: string[]
  problem?: string
  steps?: string[]
  conclusion?: string
  points?: string[]
}

interface Option {
  text?: string
  isCorrect?: boolean
  feedback?: string
  errorCategory?: unknown
}

interface Question {
  type?: string
  difficulty?: string
  statement?: string
  options?: Option[]
  numericFeedbackCorrect?: string
  numericFeedbackWrong?: string
}

interface Mission {
  slug?: string
  title?: string
  blocks?: Block[]
  questions?: Question[]
}

interface Revision {
  revisionSlug?: string
  title?: string
  subject?: string
  missions?: Mission[]
}

// ── Result accumulation ────────────────────────────────────────────────────────

interface Result {
  errors: string[]
  warnings: string[]
}

function err(r: Result, msg: string) { r.errors.push(msg) }
function warn(r: Result, msg: string) { r.warnings.push(msg) }

// ── Text collectors ────────────────────────────────────────────────────────────

function allBlockTexts(block: Block): string[] {
  const texts: string[] = []
  if (block.text) texts.push(block.text)
  if (block.title) texts.push(block.title)
  if (block.highlight) texts.push(block.highlight)
  if (block.problem) texts.push(block.problem)
  if (block.conclusion) texts.push(block.conclusion)
  if (block.items) texts.push(...block.items)
  if (block.steps) texts.push(...block.steps)
  if (block.points) texts.push(...block.points)
  return texts
}

function allQuestionTexts(q: Question): string[] {
  const texts: string[] = []
  if (q.statement) texts.push(q.statement)
  if (q.numericFeedbackCorrect) texts.push(q.numericFeedbackCorrect)
  if (q.numericFeedbackWrong) texts.push(q.numericFeedbackWrong)
  if (q.options) {
    for (const opt of q.options) {
      if (opt.text) texts.push(opt.text)
      if (opt.feedback) texts.push(opt.feedback)
    }
  }
  return texts
}

// ── Checks stripped of $...$ content ──────────────────────────────────────────

function stripDollarContent(text: string): string {
  return text.replace(/\$[^$]+\$/g, '')
}

function hasPlaceholder(texts: string[]): boolean {
  return texts.some(t => PLACEHOLDER_RE.test(t))
}

function hasSuspectedFormula(texts: string[]): boolean {
  return texts.some(t => {
    const stripped = stripDollarContent(t)
    return FORMULA_HINT_RE.test(stripped)
  })
}

// ── Main mission validation ────────────────────────────────────────────────────

function validateMission(mission: Mission, missionIndex: number, isMath: boolean, r: Result) {
  const label = `Missão [${missionIndex + 1}] "${mission.title ?? mission.slug ?? '?'}"`
  const blocks = mission.blocks ?? []
  const questions = mission.questions ?? []

  // 1. Elemento visual
  const hasVisual = blocks.some(b => b.type === 'diagram' || b.type === 'visual_explanation')
  if (!hasVisual) {
    warn(r, `${label}: sem bloco 'diagram' ou 'visual_explanation'. Cada missão deve ter ao menos um elemento visual.`)
  }

  // 2. Worked examples em revisão de Matemática
  if (isMath) {
    const workedExamples = blocks.filter(b => b.type === 'worked_example')
    if (workedExamples.length < MIN_WORKED_EXAMPLES_MATH) {
      warn(r, `${label}: apenas ${workedExamples.length} worked_example(s). Missões de Matemática devem ter no mínimo ${MIN_WORKED_EXAMPLES_MATH}.`)
    }
  }

  // 3. hint e summary
  if (!blocks.some(b => b.type === 'hint')) {
    warn(r, `${label}: sem bloco 'hint'. Adicione uma dica antes das questões.`)
  }
  if (!blocks.some(b => b.type === 'summary')) {
    warn(r, `${label}: sem bloco 'summary'. Adicione um resumo ao final da lição.`)
  }

  // 4. [PLACEHOLDER] em blocos
  for (const block of blocks) {
    const texts = allBlockTexts(block)
    if (hasPlaceholder(texts)) {
      err(r, `${label}: bloco '${block.type}' contém [PLACEHOLDER]. Preencha o conteúdo antes de importar.`)
    }
    if (hasSuspectedFormula(texts)) {
      warn(r, `${label}: bloco '${block.type}' parece ter fórmula sem $...$. Envolva expressões matemáticas em delimitadores KaTeX.`)
    }
  }

  // 5. Questões — dificuldades
  const difficulties = new Set(questions.map(q => q.difficulty))
  if (!difficulties.has('basic')) {
    warn(r, `${label}: sem questão de dificuldade 'basic'. Adicione ao menos uma questão básica.`)
  }
  if (!difficulties.has('challenge')) {
    warn(r, `${label}: sem questão de dificuldade 'challenge'. Adicione ao menos uma questão desafio.`)
  }

  // 6. Questões — feedbacks e placeholders
  for (let qi = 0; qi < questions.length; qi++) {
    const q = questions[qi]
    const qLabel = `${label} Q[${qi + 1}]`

    const allTexts = allQuestionTexts(q)
    if (hasPlaceholder(allTexts)) {
      err(r, `${qLabel}: contém [PLACEHOLDER]. Preencha antes de importar.`)
    }

    if (q.type === 'multiple_choice' && q.options) {
      for (let oi = 0; oi < q.options.length; oi++) {
        const opt = q.options[oi]
        const feedback = opt.feedback ?? ''
        if (feedback.length < MIN_FEEDBACK_LENGTH) {
          warn(r, `${qLabel} opção [${oi + 1}]: feedback muito curto (${feedback.length} chars). Feedbacks devem ter ao menos ${MIN_FEEDBACK_LENGTH} caracteres para ser pedagógicos.`)
        }
        if (hasPlaceholder([feedback])) {
          err(r, `${qLabel} opção [${oi + 1}]: feedback contém [PLACEHOLDER].`)
        }
      }
    }

    if (q.type === 'numeric') {
      const correctFb = q.numericFeedbackCorrect ?? ''
      const wrongFb = q.numericFeedbackWrong ?? ''
      if (correctFb.length < MIN_FEEDBACK_LENGTH) {
        warn(r, `${qLabel}: numericFeedbackCorrect muito curto (${correctFb.length} chars).`)
      }
      if (wrongFb.length < MIN_FEEDBACK_LENGTH) {
        warn(r, `${qLabel}: numericFeedbackWrong muito curto (${wrongFb.length} chars).`)
      }
    }
  }
}

// ── File validation ────────────────────────────────────────────────────────────

function validateFile(filePath: string): Result {
  const r: Result = { errors: [], warnings: [] }
  let raw: string
  let revision: Revision

  try {
    raw = fs.readFileSync(filePath, 'utf-8')
  } catch {
    err(r, `Não foi possível ler o arquivo: ${filePath}`)
    return r
  }

  try {
    revision = JSON.parse(raw) as Revision
  } catch {
    err(r, `JSON inválido: ${filePath}`)
    return r
  }

  const isMath = (revision.subject ?? '').toLowerCase().includes('matem')
  const missions = revision.missions ?? []

  if (missions.length === 0) {
    warn(r, `Revisão sem missões: ${revision.revisionSlug ?? filePath}`)
    return r
  }

  missions.forEach((mission, i) => validateMission(mission, i, isMath, r))

  return r
}

// ── CLI ────────────────────────────────────────────────────────────────────────

function collectFiles(target: string): string[] {
  const stat = fs.statSync(target)
  if (stat.isDirectory()) {
    return fs.readdirSync(target)
      .filter(f => f.endsWith('.json'))
      .map(f => path.join(target, f))
  }
  return [target]
}

function main() {
  const arg = process.argv[2]
  if (!arg) {
    console.error('Uso: tsx scripts/validate-content-quality.ts <arquivo-ou-diretório>')
    process.exit(1)
  }

  const targetPath = path.resolve(arg)
  if (!fs.existsSync(targetPath)) {
    console.error(`Caminho não encontrado: ${targetPath}`)
    process.exit(1)
  }

  const files = collectFiles(targetPath)
  if (files.length === 0) {
    console.log('Nenhum arquivo .json encontrado.')
    process.exit(0)
  }

  console.log(`\nValidando qualidade pedagógica de ${files.length} arquivo(s)...\n`)

  let totalErrors = 0
  let totalWarnings = 0
  let filesWithIssues = 0

  for (const file of files) {
    const { errors, warnings } = validateFile(file)
    const shortName = path.relative(process.cwd(), file)

    if (errors.length > 0 || warnings.length > 0) {
      filesWithIssues++
      console.log(`\n${shortName}`)
      console.log('─'.repeat(50))
      for (const e of errors) console.log(`  ✗ ERRO    ${e}`)
      for (const w of warnings) console.log(`  ⚠ WARNING ${w}`)
    } else {
      console.log(`✓ ${shortName}`)
    }

    totalErrors += errors.length
    totalWarnings += warnings.length
  }

  console.log('\n' + '═'.repeat(50))
  console.log(`Qualidade: ${totalErrors} erro(s), ${totalWarnings} warning(s) em ${filesWithIssues}/${files.length} arquivo(s).\n`)

  if (totalErrors > 0) {
    console.error('✗ Erros críticos encontrados. Corrija antes de importar.')
    process.exit(1)
  }

  if (totalWarnings > 0) {
    console.log('⚠ Warnings encontrados. Revise antes de usar em produção.')
    process.exit(0)
  }

  console.log('✓ Qualidade pedagógica validada.')
}

main()
