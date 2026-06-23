/**
 * Gera um draft JSON de revisão a partir de um blueprint pedagógico aprovado.
 * Uso: npm run pipeline:blueprint-to-revision -- <blueprint.json> [output.json]
 *
 * O draft gerado deve ser:
 * 1. Validado com: npm run validate-content -- <draft.json>
 * 2. Revisado e completado pelo autor (questões são placeholders que precisam ser reescritas)
 * 3. Promovido para content/revisions/ SOMENTE após checklist autoral
 * 4. Importado para Supabase SOMENTE após revisão humana completa
 */

import fs from 'fs'
import path from 'path'

interface QuestionPlan {
  minimumQuestions: number
  difficulties: string[]
  skills: string[]
  commonErrors?: string[]
}

interface WorkedExample {
  problem: string
  steps: string[]
  conclusion: string
}

interface BlueprintMission {
  slug: string
  title: string
  shortTitle: string
  goal: string
  estimatedMinutes: number
  prerequisites?: string[]
  concepts: string[]
  workedExamples: WorkedExample[]
  questionPlan: QuestionPlan
}

interface Blueprint {
  blueprintVersion: string
  targetRevision: {
    revisionSlug: string
    title: string
    grade: string
    subject: string
    description: string
  }
  sourceSummary: {
    sourceId: string
    copyrightRisk: string
  }
  learningObjectives: string[]
  missions: BlueprintMission[]
  humanReview: {
    approved: boolean
    reviewer: string | null
    reviewDate: string | null
    copyrightReviewRequired: boolean
  }
}

// ContentRevisionJSON-compatible types
interface QuestionOption {
  text: string
  isCorrect: boolean
  feedback: string
  errorCategory: string | null
}

interface ContentBlock {
  type: string
  title?: string
  text?: string
  highlight?: string
  problem?: string
  steps?: string[]
  conclusion?: string
  points?: string[]
}

interface ContentQuestion {
  type: 'multiple_choice'
  difficulty: string
  skillTag: string
  statement: string
  options: QuestionOption[]
}

interface ContentMission {
  slug: string
  title: string
  shortTitle: string
  goal: string
  estimatedMinutes: number
  isOptional: boolean
  prerequisites: string[]
  blocks: ContentBlock[]
  questions: ContentQuestion[]
}

interface ContentRevision {
  schemaVersion: string
  revisionSlug: string
  title: string
  grade: string
  subject: string
  description: string
  visualConfig: {
    subtitle: string
    subject: string
    tone: string
    missionMapBadge: string
  }
  missions: ContentMission[]
}

function generateQuestionsFromPlan(mission: BlueprintMission): ContentQuestion[] {
  const plan = mission.questionPlan
  const { skills, commonErrors = [], difficulties } = plan
  const questions: ContentQuestion[] = []

  // We generate placeholder questions that are syntactically valid but semantically incomplete.
  // The author MUST rewrite each question before promoting the draft to content/revisions/.
  const targetDifficulties: string[] = []

  if (difficulties.includes('basic')) targetDifficulties.push('basic')
  if (difficulties.includes('intermediate')) targetDifficulties.push('intermediate')
  if (difficulties.includes('challenge')) targetDifficulties.push('challenge')

  // Ensure at least 5 questions with at least 1 basic and 1 challenge
  const required = Math.max(plan.minimumQuestions, 5)
  let diffIdx = 0

  for (let i = 0; i < required; i++) {
    const difficulty = targetDifficulties[diffIdx % targetDifficulties.length]
    diffIdx++

    const skill = skills[i % skills.length]
    const commonError = commonErrors[i % Math.max(commonErrors.length, 1)] || 'conceito base'

    const validErrorCategory = isValidErrorCategory(commonError)
      ? commonError
      : 'conceito base'

    questions.push({
      type: 'multiple_choice',
      difficulty,
      skillTag: skill,
      statement: `[PLACEHOLDER ${i + 1}] Questão sobre "${mission.title}" — habilidade: ${skill}. REESCREVA esta questão antes de importar.`,
      options: [
        {
          text: 'Alternativa correta (reescreva)',
          isCorrect: true,
          feedback: 'Correto. Explique aqui por que esta resposta está certa.',
          errorCategory: null,
        },
        {
          text: 'Alternativa incorreta A (reescreva)',
          isCorrect: false,
          feedback: `Não. ${validErrorCategory} — explique o erro típico aqui.`,
          errorCategory: validErrorCategory,
        },
        {
          text: 'Alternativa incorreta B (reescreva)',
          isCorrect: false,
          feedback: 'Não. Explique o raciocínio correto aqui.',
          errorCategory: 'interpretação',
        },
      ],
    })
  }

  // Ensure at least 1 challenge if not already present
  if (!questions.some((q) => q.difficulty === 'challenge') && targetDifficulties.includes('challenge')) {
    questions[questions.length - 1].difficulty = 'challenge'
  }

  // Ensure at least 1 basic if not already present
  if (!questions.some((q) => q.difficulty === 'basic') && targetDifficulties.includes('basic')) {
    questions[0].difficulty = 'basic'
  }

  return questions
}

const VALID_ERROR_CATEGORIES = [
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

function isValidErrorCategory(val: string): boolean {
  return VALID_ERROR_CATEGORIES.includes(val)
}

function blueprintToRevision(bp: Blueprint): ContentRevision {
  const rev = bp.targetRevision

  const missions: ContentMission[] = bp.missions.map((m) => {
    const blocks: ContentBlock[] = [
      {
        type: 'intro',
        title: m.title,
        text: m.goal,
      },
      {
        type: 'concept',
        title: 'Conceito central',
        text: m.concepts.join(' '),
        highlight: m.concepts[0],
      },
      ...m.workedExamples.map((ex) => ({
        type: 'worked_example' as const,
        problem: ex.problem,
        steps: ex.steps,
        conclusion: ex.conclusion,
      })),
      {
        type: 'summary',
        title: 'Resumo',
        points: m.concepts,
      },
    ]

    const questions = generateQuestionsFromPlan(m)

    return {
      slug: m.slug,
      title: m.title,
      shortTitle: m.shortTitle,
      goal: m.goal,
      estimatedMinutes: m.estimatedMinutes,
      isOptional: false,
      prerequisites: m.prerequisites || [],
      blocks,
      questions,
    }
  })

  return {
    schemaVersion: '1.0',
    revisionSlug: rev.revisionSlug,
    title: rev.title,
    grade: rev.grade,
    subject: rev.subject,
    description: rev.description,
    visualConfig: {
      subtitle: rev.description.slice(0, 60),
      subject: rev.subject,
      tone: 'performance',
      missionMapBadge: `${missions.length} missão${missions.length !== 1 ? 'ões' : ''}`,
    },
    missions,
  }
}

function checkWarnings(bp: Blueprint) {
  if (!bp.humanReview.approved) {
    console.error('\n✗ Blueprint não aprovado (humanReview.approved = false). Abortando.')
    process.exit(1)
  }
  if (bp.humanReview.copyrightReviewRequired && !bp.humanReview.reviewer) {
    console.error('\n✗ Revisão de copyright obrigatória mas humanReview.reviewer está vazio. Abortando.')
    process.exit(1)
  }

  for (const m of bp.missions) {
    if (!m.workedExamples || m.workedExamples.length === 0) {
      console.warn(`  ⚠ Missão "${m.slug}": sem exemplos resolvidos`)
    }
    if (!m.questionPlan.skills || m.questionPlan.skills.length === 0) {
      console.warn(`  ⚠ Missão "${m.slug}": sem habilidades definidas`)
    }
    if (!m.questionPlan.commonErrors || m.questionPlan.commonErrors.length === 0) {
      console.warn(`  ⚠ Missão "${m.slug}": sem erros comuns mapeados`)
    }
    if ((m.questionPlan.minimumQuestions ?? 0) < 5) {
      console.warn(`  ⚠ Missão "${m.slug}": minimumQuestions < 5`)
    }
  }

  if (bp.sourceSummary.copyrightRisk === 'high') {
    console.warn('\n  ⚠ copyrightRisk = high. Certifique-se de que o conteúdo final é autoral.')
  }
}

const arg = process.argv[2]
const outputArg = process.argv[3]

if (!arg) {
  console.error('Uso: npm run pipeline:blueprint-to-revision -- <blueprint.json> [output.json]')
  process.exit(1)
}

const inputPath = path.resolve(arg)
if (!fs.existsSync(inputPath)) {
  console.error(`Blueprint não encontrado: ${inputPath}`)
  process.exit(1)
}

const bp: Blueprint = JSON.parse(fs.readFileSync(inputPath, 'utf-8'))

console.log(`\nGerando draft a partir de: ${inputPath}`)
console.log('─'.repeat(60))

checkWarnings(bp)

const revision = blueprintToRevision(bp)

// Default output path
const defaultOutputDir = path.resolve('content/pipeline/drafts/examples')
const defaultOutputFile = path.join(defaultOutputDir, `${revision.revisionSlug}.json`)
const outputPath = outputArg ? path.resolve(outputArg) : defaultOutputFile

// Ensure output dir exists
const outputDir = path.dirname(outputPath)
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

fs.writeFileSync(outputPath, JSON.stringify(revision, null, 2), 'utf-8')

console.log(`\n✓ Draft gerado: ${outputPath}`)
console.log('\n⚠  ATENÇÃO: As questões são PLACEHOLDERS. Reescreva cada questão antes de promover o draft.')
console.log('   Valide o draft: npm run validate-content -- ' + outputPath)
console.log('   Revise a autoria: content/pipeline/reviews/checklist-autoral-template.md')
console.log('   Só promova para content/revisions/ após checklist autoral completo.')
