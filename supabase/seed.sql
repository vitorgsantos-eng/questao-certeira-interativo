-- ============================================================
-- Seed de desenvolvimento — Questão Certeira Interativo
-- ATENÇÃO: apenas para desenvolvimento local / testes
-- ============================================================

-- Revisão piloto (status draft — ative manualmente ou via import-revision.ts)
INSERT INTO revisions (slug, title, grade, description, status)
VALUES (
  'revisao-9ano-triangulos-sistemas',
  'Revisão Interativa — Triângulos e Sistemas',
  '9º ano',
  'Revisão para prova com semelhança de triângulos, relações métricas, trigonometria no triângulo retângulo e sistemas com equações do 2º grau.',
  'draft'
) ON CONFLICT (slug) DO NOTHING;

-- Para popular o conteúdo completo, use:
-- npm run import-revision content/revisions/revisao-9ano-triangulos-sistemas.json
