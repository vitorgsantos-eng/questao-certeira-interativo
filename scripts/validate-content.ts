/**
 * Validate content JSON files before importing.
 * Usage: tsx scripts/validate-content.ts content/revisions/revisao-9ano-triangulos-sistemas.json
 */

import fs from 'fs'
import path from 'path'
import type { ContentRevisionJSON } from '../src/types'

const VALID_BLOCK_TYPES = [
  'intro', 'concept', 'visual_explanation', 'worked_example', 'hint', 'summary',
]
const VALID_QUESTION_TYPES = ['multiple_choice', 'numeric']
const VALID_DIFFICULTIES = ['basic', 'intermediate', 'challenge']

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

function validateRevision(content: ContentRevisionJSON) {
  console.log(`\nValidating: ${content.title}`)
  console.log('─'.repeat(50))

  if (!content.revisionSlug) error('Missing revisionSlug')
  if (!content.title) error('Missing title')
  if (!content.grade) error('Missing grade')
  if (!content.missions || content.missions.length === 0) error('No missions found')
  else ok(`${content.missions.length} missions found`)

  for (let i = 0; i < (content.missions ?? []).length; i++) {
    const m = content.missions[i]
    console.log(`\n  Mission [${i + 1}]: ${m.title}`)

    if (!m.slug) error('Missing slug')
    if (!m.title) error('Missing title')
    if (!m.shortTitle) error('Missing shortTitle')
    if (!m.goal) error('Missing goal')
    if (!m.estimatedMinutes) error('Missing estimatedMinutes')

    if (!m.blocks || m.blocks.length === 0) {
      warn('No content blocks')
    } else {
      for (let b = 0; b < m.blocks.length; b++) {
        const block = m.blocks[b]
        if (!VALID_BLOCK_TYPES.includes(block.type)) {
          error(`Block ${b}: invalid type '${block.type}'`)
        }
      }
      ok(`${m.blocks.length} blocks`)
    }

    if (!m.questions || m.questions.length === 0) {
      error('No questions')
    } else {
      if (m.questions.length < 5) {
        warn(`Only ${m.questions.length} questions (minimum 5 recommended)`)
      }

      for (let q = 0; q < m.questions.length; q++) {
        const question = m.questions[q]

        if (!VALID_QUESTION_TYPES.includes(question.type)) {
          error(`Question ${q}: invalid type '${question.type}'`)
        }
        if (!VALID_DIFFICULTIES.includes(question.difficulty)) {
          error(`Question ${q}: invalid difficulty '${question.difficulty}'`)
        }
        if (!question.statement) {
          error(`Question ${q}: missing statement`)
        }

        if (question.type === 'multiple_choice') {
          if (!question.options || question.options.length < 2) {
            error(`Question ${q}: multiple_choice needs at least 2 options`)
          } else {
            const correctCount = question.options.filter((o) => o.isCorrect).length
            if (correctCount !== 1) {
              error(`Question ${q}: must have exactly 1 correct option (found ${correctCount})`)
            }
            for (const opt of question.options) {
              if (!opt.feedback) {
                warn(`Question ${q}: option missing feedback`)
              }
            }
          }
        }

        if (question.type === 'numeric') {
          if (question.correctNumericAnswer === undefined || question.correctNumericAnswer === null) {
            error(`Question ${q}: numeric question missing correctNumericAnswer`)
          }
        }
      }

      ok(`${m.questions.length} questions validated`)
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
