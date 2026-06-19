-- ============================================================
-- VIT-20 (complemento): Restringir leitura pública de questões
-- ============================================================
-- SECURITY.md declara: "Questões, opções e feedbacks só são retornados
-- após validação de sessão." As policies abaixo contradizem isso.
-- Pages que precisam de questions/question_options já verificam sessão
-- e devem usar createServiceClient().
--
-- content_blocks e missions permanecem anon-readable por decisão de MVP:
-- são conteúdo pedagógico público que não contém respostas, feedback
-- ou dados de alunos. Ver SECURITY.md §RLS.

-- Remover leitura anon de questions
DROP POLICY IF EXISTS "Public read questions" ON questions;

-- Remover leitura anon de question_options
-- (contém is_correct, feedback, error_category — dados sensíveis de avaliação)
DROP POLICY IF EXISTS "Public read question_options" ON question_options;
