-- ============================================================
-- MINI-SITE DE SECRETARIAS
-- Adiciona campos de personalização e vinculo com categorias de notícias
-- ============================================================

ALTER TABLE secretarias
  ADD COLUMN IF NOT EXISTS cover_image_url   TEXT,
  ADD COLUMN IF NOT EXISTS accent_color      TEXT NOT NULL DEFAULT '#1a3a6b',
  ADD COLUMN IF NOT EXISTS logo_url          TEXT,
  ADD COLUMN IF NOT EXISTS mission           TEXT,
  ADD COLUMN IF NOT EXISTS news_category_id  INTEGER REFERENCES news_categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_secretarias_category ON secretarias(news_category_id);

COMMENT ON COLUMN secretarias.cover_image_url  IS 'Imagem de fundo do hero do mini-site';
COMMENT ON COLUMN secretarias.accent_color     IS 'Cor de destaque do mini-site (hex)';
COMMENT ON COLUMN secretarias.logo_url         IS 'Logo opcional da secretaria';
COMMENT ON COLUMN secretarias.mission          IS 'Frase/missão curta da secretaria';
COMMENT ON COLUMN secretarias.news_category_id IS 'Categoria de notícias vinculada — exibida no mini-site';
