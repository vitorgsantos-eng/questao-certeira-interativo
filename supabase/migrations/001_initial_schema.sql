-- ============================================================
-- Questão Certeira Interativo — Schema inicial
-- ============================================================

-- Students
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  grade TEXT NOT NULL,
  group_label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Revisions
CREATE TABLE IF NOT EXISTS revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  grade TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Access codes
CREATE TABLE IF NOT EXISTS access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  revision_id UUID NOT NULL REFERENCES revisions(id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  expires_at TIMESTAMPTZ NOT NULL,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_access_codes_revision ON access_codes(revision_id, status);

-- Missions
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revision_id UUID NOT NULL REFERENCES revisions(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  short_title TEXT NOT NULL,
  goal TEXT NOT NULL DEFAULT '',
  prerequisites TEXT[] NOT NULL DEFAULT '{}',
  estimated_minutes INTEGER NOT NULL DEFAULT 8,
  is_optional BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(revision_id, slug)
);

-- Content blocks
CREATE TABLE IF NOT EXISTS content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('intro', 'concept', 'visual_explanation', 'worked_example', 'hint', 'summary')),
  content_json JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Questions
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('multiple_choice', 'numeric')),
  statement TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'basic' CHECK (difficulty IN ('basic', 'intermediate', 'challenge')),
  skill_tag TEXT NOT NULL DEFAULT '',
  content_json JSONB NOT NULL DEFAULT '{}',
  correct_answer_json JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Question options (for multiple_choice)
CREATE TABLE IF NOT EXISTS question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  feedback TEXT NOT NULL DEFAULT '',
  error_category TEXT
);

-- Attempts
CREATE TABLE IF NOT EXISTS attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  revision_id UUID NOT NULL REFERENCES revisions(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES missions(id) ON DELETE SET NULL,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_json JSONB NOT NULL DEFAULT '{}',
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  error_category TEXT,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_attempts_student_revision ON attempts(student_id, revision_id);

-- Mission progress
CREATE TABLE IF NOT EXISTS mission_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  revision_id UUID NOT NULL REFERENCES revisions(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  score INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, mission_id)
);

-- Revision progress
CREATE TABLE IF NOT EXISTS revision_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  revision_id UUID NOT NULL REFERENCES revisions(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  diagnostic_score INTEGER,
  final_score INTEGER,
  weak_topics_json TEXT[] NOT NULL DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, revision_id)
);

-- Row Level Security (RLS) — enable but allow anon reads for content
ALTER TABLE revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_progress ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (used by API routes with service key)
CREATE POLICY "Service role full access" ON revisions FOR ALL TO service_role USING (TRUE);
CREATE POLICY "Service role full access" ON missions FOR ALL TO service_role USING (TRUE);
CREATE POLICY "Service role full access" ON content_blocks FOR ALL TO service_role USING (TRUE);
CREATE POLICY "Service role full access" ON questions FOR ALL TO service_role USING (TRUE);
CREATE POLICY "Service role full access" ON question_options FOR ALL TO service_role USING (TRUE);
CREATE POLICY "Service role full access" ON students FOR ALL TO service_role USING (TRUE);
CREATE POLICY "Service role full access" ON access_codes FOR ALL TO service_role USING (TRUE);
CREATE POLICY "Service role full access" ON attempts FOR ALL TO service_role USING (TRUE);
CREATE POLICY "Service role full access" ON mission_progress FOR ALL TO service_role USING (TRUE);
CREATE POLICY "Service role full access" ON revision_progress FOR ALL TO service_role USING (TRUE);

-- Allow anon to read active revisions/missions/content (for SSR pages using anon key)
CREATE POLICY "Public read active revisions" ON revisions FOR SELECT TO anon USING (status = 'active');
CREATE POLICY "Public read missions" ON missions FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read content_blocks" ON content_blocks FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read questions" ON questions FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read question_options" ON question_options FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read mission_progress" ON mission_progress FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read revision_progress" ON revision_progress FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public read attempts" ON attempts FOR SELECT TO anon USING (TRUE);
