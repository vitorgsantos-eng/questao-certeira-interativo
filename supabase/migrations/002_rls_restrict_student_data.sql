-- ============================================================
-- VIT-20: Restringir leitura pública de dados de alunos
-- ============================================================
-- Remove políticas anon permissivas para tabelas com dados de alunos.
-- Essas tabelas só devem ser acessadas via service_role (já coberto pela
-- política "Service role full access" criada na migration 001).
-- Pages que precisam desses dados já verificam sessão e devem usar
-- createServiceClient() em vez de createClient().

-- Remover policies anon em mission_progress
DROP POLICY IF EXISTS "Public read mission_progress" ON mission_progress;

-- Remover policies anon em revision_progress
DROP POLICY IF EXISTS "Public read revision_progress" ON revision_progress;

-- Remover policies anon em attempts
DROP POLICY IF EXISTS "Public read attempts" ON attempts;
