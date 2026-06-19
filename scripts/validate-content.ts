/**
 * Validate content JSON files before importing.
 * Usage: tsx scripts/validate-content.ts <path-to-json>
 */

import fs from 'fs'
import path from 'path'
import type { ContentRevisionJSON, ContentQuestionJSON, ErrorCategory } from '../src/types'

const VALID_BLOCK_TYPES = [
  'intro', 'concept', 'visual_explanation', 'worked_example', 'hint', 'summary',
]
const VALID_QUESTION_TYPES = ['multiple_choice', 'numeric']
const VALID_DIFFICULTIES = ['basic', 'intermediate', 'challenge']

// Must match ErrorCategory type (non-null values only)
const VALID_ERROR_CATEGORIES: Array<Exclude<ErrorCategory, null>> = [
  'interpretação',
  'fórmula inadequada',
  'identificação de elementos',
  'operação algébrica',
  'sinal',
  'cálculo numérico',
  'conceito base',
  'pressa/chute',
  'unidade de medida',
  'proporção',
]

let errors = 0
let warnings = 0

function error(msg: string) {
  console.error(`  ✗ ERROR: ${msg}`)
  errors++
}

function warn(msg: string) {
  console.warn(`  ⚠ WARNING: ${msg}`)
  warnings++
}

function ok(msg: string) {
  console.log(`  ✓ ${msg}`)
}

function validateQuestion(q: ContentQuestionJSON, idx: number) {
  const label = `Question ${idx + 1}`

  if (!VALID_QUESTION_TYPES.includes(q.type)) {
    error(`${label}: invalid type '${q.type}'`)
  }
  if (!VALID_DIFFICULTIES.includes(q.difficulty)) {
    error(`${label}: invalid difficulty '${q.difficulty}'`)
  }
  if (!q.statement) {
    error(`${label}: missing statement`)
  }
  if (!q.skillTag) {
    warn(`${label}: missing skillTag`)
  }

  if (q.type === 'multiple_choice') {
    if (!q.options || q.options.length < 2) {
      error(`${label}: multiple_choice needs at least 2 options`)
      return
    }

    const correctCount = q.options.filter((o) => o.isCorrect).length
    if (correctCount !== 1) {
      error(`${label}: must have exactly 1 correct option (found ${correctCount})`)
    }

    for (let i = 0; i < q.options.length; i++) {
      const opt = q.options[i]
      const optLabel = `${label} option ${i + 1}`

      if (!opt.feedback) {
        warn(`${optLabel}: missing feedback`)
      }

      if (opt.isCorrect) {
        // Correct option must NOT have an errorCategory
        if (opt.errorCategory !== null) {
          error(`${optLabel}: correct option must have errorCategory null (found '${opt.errorCategory}')`)
        }
      } else {
        // Incorrect options must have a valid errorCategory
        if (opt.errorCategory === null || opt.errorCategory === undefined) {
          error(`${optLabel}: incorrect option must have a non-null errorCategory`)
        } else if (!VALID_ERROR_CATEGORIES.includes(opt.errorCategory as Exclude<ErrorCategory, null>)) {
          error(`${optLabel}: invalid errorCategory '${opt.errorCategory}' (must be one of: ${VALID_ERROR_CATEGORIES.join(', ')})`)
        }
      }
    }
  }

  if (q.type === 'numeric') {
    if (q.correctNumericAnswer === undefined || q.correctNumericAnswer === null) {
      error(`${label}: numeric question missing correctNumericAnswer`)
    }
    if (!q.numericFeedbackCorrect) {
      warn(`${label}: numeric question missing numericFeedbackCorrect`)
    }
    if (!q.numericFeedbackWrong) {
      warn(`${label}: numeric question missing numericFeedbackWrong`)
    }
  }
}

function validateRevision(content: ContentRevisionJSON) {
  console.log(`\nValidating: ${content.title}`)
  console.log('─'.repeat(50))

  if (!content.revisionSlug) error('Missing revisionSlug')
  if (!content.title) error('Missing title')
  if (!content.grade) error('Missing grade')
  if (!content.missions || content.missions.length === 0) {
    error('No missions found')
    return
  }
  ok(`${content.missions.length} missions found`)

  for (let i = 0; i < content.missions.length; i++) {
    const m = content.missions[i]
    console.log(`\n  Mission [${i + 1}]: ${m.title}`)

    if (!m.slug) error('Missing slug')
    if (!m.title) error('Missing title')
    if (!m.shortTitle) error('Missing shortTitle')
    if (!m.goal) error('Missing goal')
    if (!m.estimatedMinutes) error('Missing estimatedMinutes')

    // Block validation
    if (!m.blocks || m.blocks.length === 0) {
      warn('No content blocks')
    } else {
      for (let b = 0; b < m.blocks.length; b++) {
        const block = m.blocks[b]
        if (!VALID_BLOCK_TYPES.includes(block.type)) {
          error(`Block ${b + 1}: invalid type '${block.type}'`)
        }
      }

      // Pedagogical structure requirements
      const blockTypes = m.blocks.map((b) => b.type)
      if (!blockTypes.includes('concept')) {
        error('Mission must have at least one "concept" block')
      }
      if (!blockTypes.includes('worked_example')) {
        error('Mission must have at least one "worked_example" block')
      }

      ok(`${m.blocks.length} blocks (concept ✓, worked_example ✓)`)
    }

    // Question validation
    if (!m.questions || m.questions.length === 0) {
      error('No questions')
    } else {
      if (m.questions.length < 5) {
        warn(`Only ${m.questions.length} questions (minimum 5 recommended)`)
      }

      const difficulties = m.questions.map((q) => q.difficulty)
      if (!difficulties.includes('challenge')) {
        warn('No challenge-difficulty question in mission')
      }
      if (!difficulties.includes('basic')) {
        warn('No basic-difficulty question in mission')
      }

      m.questions.forEach((q, qi) => validateQuestion(q, qi))

      ok(`${m.questions.length} questions validated`)
    }

    // Challenge questions (optional section)
    if (m.challengeQuestions && m.challengeQuestions.length > 0) {
      for (const q of m.challengeQuestions) {
        if (q.difficulty !== 'challenge') {
          warn(`challengeQuestions section contains a non-challenge question`)
        }
      }
      m.challengeQuestions.forEach((q, qi) => validateQuestion(q, qi))
      ok(`${m.challengeQuestions.length} challenge question(s) validated`)
    }
  }
}

const arg = process.argv[2]
if (!arg) {
  console.error('Usage: tsx scripts/validate-content.ts <path-to-json>')
  process.exit(1)
}

const fullPath = path.resolve(arg)
if (!fs.existsSync(fullPath)) {
  console.error(`File not found: ${fullPath}`)
  process.exit(1)
}

const content: ContentRevisionJSON = JSON.parse(fs.readFileSync(fullPath, 'utf-8'))
validateRevision(content)

console.log('\n─'.repeat(50))
console.log(`\nResult: ${errors} error(s), ${warnings} warning(s)`)
if (errors > 0) {
  console.error('\nFix errors before importing.')
  process.exit(1)
} else {
  console.log('\n✓ Content is valid. Ready to import.')
}
