-- ============================================================
-- VIT-31 / VIT-51: Adicionar tipo 'diagram' em content_blocks
-- ============================================================
-- A VIT-51 introduziu blocos do tipo 'diagram' no sistema de
-- conteúdo (src/types/index.ts e scripts/validate-content.ts).
-- O CHECK constraint da migration 001 não incluía esse tipo,
-- o que causaria falha ao importar revisões com blocos diagram.
--
-- Nomes de constraints PostgreSQL inline são gerados como:
--   {table}_{column}_check → content_blocks_type_check

ALTER TABLE content_blocks
  DROP CONSTRAINT IF EXISTS content_blocks_type_check;

ALTER TABLE content_blocks
  ADD CONSTRAINT content_blocks_type_check
  CHECK (type IN (
    'intro',
    'concept',
    'visual_explanation',
    'worked_example',
    'hint',
    'summary',
    'diagram'
  ));
