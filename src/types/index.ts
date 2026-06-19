// ─── Domain types ─────────────────────────────────────────────────────────────

export type AccessCodeStatus = 'active' | 'expired' | 'revoked'
export type RevisionStatus = 'draft' | 'active' | 'archived'
export type MissionProgressStatus = 'not_started' | 'in_progress' | 'completed'
export type RevisionProgressStatus = 'not_started' | 'in_progress' | 'completed'
export type QuestionType = 'multiple_choice' | 'numeric'
export type QuestionDifficulty = 'basic' | 'intermediate' | 'challenge'
export type ContentBlockType =
  | 'intro'
  | 'concept'
  | 'visual_explanation'
  | 'worked_example'
  | 'hint'
  | 'summary'
  | 'diagram'

export type ErrorCategory =
  | 'interpretação'
  | 'fórmula inadequada'
  | 'identificação de elementos'
  | 'operação algébrica'
  | 'sinal'
  | 'cálculo numérico'
  | 'conceito base'
  | 'pressa/chute'
  | 'unidade de medida'
  | 'proporção'
  | null

// ─── Database row types ────────────────────────────────────────────────────────

export interface Student {
  id: string
  display_name: string
  grade: string
  group_label: string | null
  created_at: string
}

export interface AccessCode {
  id: string
  student_id: string
  revision_id: string
  code_hash: string
  status: AccessCodeStatus
  expires_at: string
  last_used_at: string | null
  created_at: string
}

export interface Revision {
  id: string
  slug: string
  title: string
  grade: string
  description: string
  status: RevisionStatus
  valid_from: string | null
  valid_until: string | null
  created_at: string
}

export interface Mission {
  id: string
  revision_id: string
  slug: string
  order_index: number
  title: string
  short_title: string
  goal: string
  prerequisites: string[]
  estimated_minutes: number
  is_optional: boolean
  created_at: string
}

export interface ContentBlock {
  id: string
  mission_id: string
  order_index: number
  type: ContentBlockType
  content_json: ContentBlockData
  created_at: string
}

export interface Question {
  id: string
  mission_id: string
  order_index: number
  type: QuestionType
  statement: string
  difficulty: QuestionDifficulty
  skill_tag: string
  content_json: Record<string, unknown>
  correct_answer_json: Record<string, unknown>
  created_at: string
}

export interface QuestionOption {
  id: string
  question_id: string
  order_index: number
  option_text: string
  is_correct: boolean
  feedback: string
  error_category: ErrorCategory
}

export interface Attempt {
  id: string
  student_id: string
  revision_id: string
  mission_id: string | null
  question_id: string
  answer_json: Record<string, unknown>
  is_correct: boolean
  error_category: ErrorCategory
  time_spent_seconds: number
  created_at: string
}

export interface MissionProgress {
  id: string
  student_id: string
  revision_id: string
  mission_id: string
  status: MissionProgressStatus
  score: number
  started_at: string | null
  completed_at: string | null
  updated_at: string
}

export interface RevisionProgress {
  id: string
  student_id: string
  revision_id: string
  status: RevisionProgressStatus
  diagnostic_score: number | null
  final_score: number | null
  weak_topics_json: string[]
  completed_at: string | null
  updated_at: string
}

// ─── Content block data shapes ─────────────────────────────────────────────────

export interface IntroBlock {
  type: 'intro'
  title: string
  text: string
}

export interface ConceptBlock {
  type: 'concept'
  title: string
  text: string
  highlight?: string
}

export interface VisualExplanationBlock {
  type: 'visual_explanation'
  title: string
  text: string
  items?: string[]
}

export interface WorkedExampleBlock {
  type: 'worked_example'
  problem: string
  steps: string[]
  conclusion?: string
}

export interface HintBlock {
  type: 'hint'
  text: string
}

export interface SummaryBlock {
  type: 'summary'
  title: string
  points: string[]
}

export type DiagramId =
  | 'similar-triangles'
  | 'metric-relations'
  | 'trigonometry'
  | 'systems-strategy'

export interface DiagramBlock {
  type: 'diagram'
  diagramId: DiagramId
  caption?: string
}

export type ContentBlockData =
  | IntroBlock
  | ConceptBlock
  | VisualExplanationBlock
  | WorkedExampleBlock
  | HintBlock
  | SummaryBlock
  | DiagramBlock

// ─── Session / auth-lite types ─────────────────────────────────────────────────

export interface StudentSession {
  studentId: string
  revisionId: string
  revisionSlug: string
  displayName: string
  grade: string
  expiresAt: string
}

// ─── UI / view model types ─────────────────────────────────────────────────────

export interface MissionWithProgress extends Mission {
  progress: MissionProgress | null
}

export interface QuestionWithOptions extends Question {
  options: QuestionOption[]
}

export interface AttemptResult {
  questionId: string
  isCorrect: boolean
  selectedOption?: string
  enteredValue?: string
  feedback: string
  errorCategory: ErrorCategory
  correctAnswerText?: string
}

export interface MissionResult {
  missionId: string
  missionTitle: string
  score: number
  totalQuestions: number
  correctAnswers: number
  errorCategories: ErrorCategory[]
  attempts: AttemptResult[]
}

export interface StudentReportData {
  student: Student
  revision: Revision
  missionResults: MissionResult[]
  overallScore: number
  weakTopics: string[]
  simuladoCompleted: boolean
  simuladoScore: number | null
}

export interface TeacherStudentRow {
  student: Student
  accessCode: Pick<AccessCode, 'status' | 'expires_at' | 'last_used_at'>
  revisionProgress: RevisionProgress | null
  missionProgresses: MissionProgress[]
}

// ─── JSON content schema types (for importing) ─────────────────────────────────

export interface ContentRevisionJSON {
  revisionSlug: string
  title: string
  grade: string
  description: string
  missions: ContentMissionJSON[]
}

export interface ContentMissionJSON {
  slug: string
  title: string
  shortTitle: string
  goal: string
  estimatedMinutes: number
  isOptional?: boolean
  prerequisites?: string[]
  blocks: ContentBlockData[]
  questions: ContentQuestionJSON[]
  challengeQuestions?: ContentQuestionJSON[]
}

export interface ContentQuestionJSON {
  type: QuestionType
  difficulty: QuestionDifficulty
  skillTag: string
  statement: string
  options?: ContentOptionJSON[]
  correctNumericAnswer?: number
  tolerance?: number
  numericFeedbackCorrect?: string
  numericFeedbackWrong?: string
}

export interface ContentOptionJSON {
  text: string
  isCorrect: boolean
  feedback: string
  errorCategory: ErrorCategory
}
