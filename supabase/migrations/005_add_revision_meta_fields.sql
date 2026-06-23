-- ============================================================
-- VIT-52: Adicionar campos de metadados à tabela revisions
-- (schema_version, subject, visual_config)
--
-- Compatível com dados existentes via DEFAULT:
--   schema_version → '1.0'
--   subject        → NULL
--   visual_config  → '{}'::jsonb
-- ============================================================

ALTER TABLE revisions
  ADD COLUMN IF NOT EXISTS schema_version TEXT NOT NULL DEFAULT '1.0',
  ADD COLUMN IF NOT EXISTS subject TEXT,
  ADD COLUMN IF NOT EXISTS visual_config JSONB NOT NULL DEFAULT '{}'::jsonb;
