/**
 * Valida um blueprint pedagógico antes de gerar o draft JSON.
 * Uso: npm run pipeline:validate-blueprint -- <blueprint.json>
 */

import fs from 'fs'
import path from 'path'

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

interface QuestionPlan {
  minimumQuestions?: number
  difficulties?: string[]
  skills?: string[]
  commonErrors?: string[]
}

interface WorkedExample {
  problem?: string
  steps?: string[]
  conclusion?: string
}

interface BlueprintMission {
  slug?: string
  title?: string
  shortTitle?: string
  goal?: string
  estimatedMinutes?: number
  concepts?: string[]
  workedExamples?: WorkedExample[]
  questionPlan?: QuestionPlan
}

interface Blueprint {
  blueprintVersion?: string
  targetRevision?: {
    revisionSlug?: string
    title?: string
    grade?: string
    subject?: string
    description?: string
  }
  sourceSummary?: {
    sourceId?: string
    scope?: string
    copyrightRisk?: string
    notes?: string
  }
  learningObjectives?: string[]
  missions?: BlueprintMission[]
  humanReview?: {
    pedagogicalReviewRequired?: boolean
    copyrightReviewRequired?: boolean
    approved?: boolean
    reviewer?: string | null
    reviewDate?: string | null
  }
}

function validateBlueprint(bp: Blueprint) {
  console.log('\nValidando blueprint pedagógico...')
  console.log('─'.repeat(60))

  if (!bp.blueprintVersion) {
    error('blueprintVersion ausente')
  } else {
    ok(`blueprintVersion: ${bp.blueprintVersion}`)
  }

  const rev = bp.targetRevision
  if (!rev) {
    error('targetRevision ausente')
  } else {
    if (!rev.revisionSlug) error('targetRevision.revisionSlug ausente')
    else if (!/^[a-z0-9-]+$/.test(rev.revisionSlug)) error(`revisionSlug inválido: '${rev.revisionSlug}' (use apenas letras minúsculas, números e hífens)`)
    else ok(`revisionSlug: ${rev.revisionSlug}`)

    if (!rev.title) error('targetRevision.title ausente')
    if (!rev.grade) error('targetRevision.grade ausente')
    if (!rev.subject) error('targetRevision.subject ausente')
    if (!rev.description) error('targetRevision.description ausente')

    if (rev.title && rev.grade && rev.subject && rev.description) {
      ok(`targetRevision: ${rev.title} (${rev.grade} — ${rev.subject})`)
    }
  }

  const src = bp.sourceSummary
  if (!src) {
    error('sourceSummary ausente')
  } else {
    if (!src.sourceId) error('sourceSummary.sourceId ausente')
    if (!src.scope) error('sourceSummary.scope ausente')
    if (!src.copyrightRisk) error('sourceSummary.copyrightRisk ausente')
    else if (!['low', 'medium', 'high'].includes(src.copyrightRisk)) {
      error(`copyrightRisk inválido: '${src.copyrightRisk}' (valores aceitos: low, medium, high)`)
    } else {
      if (src.copyrightRisk === 'high') {
        warn('copyrightRisk=high — revisão humana de copyright OBRIGATÓRIA antes de gerar draft')
      }
      ok(`copyrightRisk: ${src.copyrightRisk}`)
    }
  }

  if (!bp.learningObjectives || bp.learningObjectives.length === 0) {
    error('learningObjectives ausente ou vazio')
  } else {
    ok(`${bp.learningObjectives.length} objetivo(s) de aprendizagem`)
  }

  const review = bp.humanReview
  if (!review) {
    error('humanReview ausente')
  } else {
    if (review.approved !== true) {
      error('humanReview.approved é false — blueprint não aprovado. Não gere draft sem aprovação humana.')
    } else {
      ok('humanReview.approved: true')
    }
    if (!review.reviewer) {
      warn('humanReview.reviewer ausente — quem aprovou?')
    }
    if (!review.reviewDate) {
      warn('humanReview.reviewDate ausente')
    }
  }

  if (!bp.missions || bp.missions.length === 0) {
    error('missions ausente ou vazio')
    return
  }

  ok(`${bp.missions.length} missão(ões) encontrada(s)`)

  for (let i = 0; i < bp.missions.length; i++) {
    const m = bp.missions[i]
    console.log(`\n  Missão [${i + 1}]: ${m.title || '(sem título)'}`)

    if (!m.slug) error('slug ausente')
    else if (!/^[a-z0-9-]+$/.test(m.slug)) error(`slug inválido: '${m.slug}'`)

    if (!m.title) error('title ausente')
    if (!m.shortTitle) error('shortTitle ausente')
    if (!m.goal) error('goal ausente')
    if (!m.estimatedMinutes) error('estimatedMinutes ausente')

    if (!m.concepts || m.concepts.length === 0) {
      error('concepts ausente ou vazio — defina pelo menos 1 conceito central')
    } else {
      ok(`${m.concepts.length} conceito(s) definido(s)`)
    }

    if (!m.workedExamples || m.workedExamples.length === 0) {
      error('workedExamples ausente — defina pelo menos 1 exemplo resolvido')
    } else {
      for (let e = 0; e < m.workedExamples.length; e++) {
        const ex = m.workedExamples[e]
        if (!ex.problem) error(`workedExample ${e + 1}: problem ausente`)
        if (!ex.steps || ex.steps.length === 0) error(`workedExample ${e + 1}: steps ausente ou vazio`)
        if (!ex.conclusion) error(`workedExample ${e + 1}: conclusion ausente`)
      }
      ok(`${m.workedExamples.length} exemplo(s) resolvido(s)`)
    }

    const qp = m.questionPlan
    if (!qp) {
      error('questionPlan ausente')
    } else {
      if (!qp.minimumQuestions || qp.minimumQuestions < 5) {
        error(`questionPlan.minimumQuestions deve ser >= 5 (encontrado: ${qp.minimumQuestions ?? 'ausente'})`)
      }

      const validDifficulties = ['basic', 'intermediate', 'challenge']
      if (!qp.difficulties || qp.difficulties.length === 0) {
        error('questionPlan.difficulties ausente')
      } else {
        for (const d of qp.difficulties) {
          if (!validDifficulties.includes(d)) error(`dificuldade inválida: '${d}'`)
        }
        if (!qp.difficulties.includes('basic')) warn('Sem dificuldade "basic" planejada')
        if (!qp.difficulties.includes('challenge')) warn('Sem dificuldade "challenge" planejada')
      }

      if (!qp.skills || qp.skills.length === 0) {
        error('questionPlan.skills ausente — defina ao menos 1 habilidade')
      } else {
        ok(`${qp.skills.length} habilidade(s) mapeada(s)`)
      }

      if (!qp.commonErrors || qp.commonErrors.length === 0) {
        warn('questionPlan.commonErrors ausente — recomendado para melhorar feedbacks')
      }
    }
  }
}

const arg = process.argv[2]
if (!arg) {
  console.error('Uso: npm run pipeline:validate-blueprint -- <blueprint.json>')
  process.exit(1)
}

const fullPath = path.resolve(arg)
if (!fs.existsSync(fullPath)) {
  console.error(`Arquivo não encontrado: ${fullPath}`)
  process.exit(1)
}

const bp: Blueprint = JSON.parse(fs.readFileSync(fullPath, 'utf-8'))
validateBlueprint(bp)

console.log('\n' + '─'.repeat(60))
console.log(`Resultado: ${errors} erro(s), ${warnings} aviso(s)`)

if (errors > 0) {
  console.error('\n✗ Blueprint inválido. Corrija os erros antes de gerar o draft.')
  process.exit(1)
} else {
  console.log('\n✓ Blueprint válido. Pronto para gerar draft JSON.')
}
