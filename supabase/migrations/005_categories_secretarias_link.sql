-- ============================================================
-- CATEGORIAS DE NOTÍCIAS: adiciona as faltantes e vincula secretarias
-- ============================================================

-- 1. Insere categorias que ainda não existem
INSERT INTO news_categories (name, slug, color) VALUES
  ('Administração',          'administracao',     '#6366f1'),
  ('Finanças',               'financas',          '#f59e0b'),
  ('Planejamento e Gestão',  'planejamento-gestao','#8b5cf6'),
  ('Esporte e Cultura',      'esporte-cultura',   '#ec4899')
ON CONFLICT (slug) DO NOTHING;

-- 2. Vincula cada secretaria à sua categoria usando ILIKE no nome
UPDATE secretarias SET news_category_id = (
  SELECT id FROM news_categories WHERE slug = 'educacao' LIMIT 1
) WHERE name ILIKE '%Educação%' AND news_category_id IS NULL;

UPDATE secretarias SET news_category_id = (
  SELECT id FROM news_categories WHERE slug = 'saude' LIMIT 1
) WHERE name ILIKE '%Saúde%' AND news_category_id IS NULL;

UPDATE secretarias SET news_category_id = (
  SELECT id FROM news_categories WHERE slug = 'assistencia-social' LIMIT 1
) WHERE name ILIKE '%Assistência Social%' AND news_category_id IS NULL;

UPDATE secretarias SET news_category_id = (
  SELECT id FROM news_categories WHERE slug = 'administracao' LIMIT 1
) WHERE name ILIKE '%Administração%' AND news_category_id IS NULL;

UPDATE secretarias SET news_category_id = (
  SELECT id FROM news_categories WHERE slug = 'financas' LIMIT 1
) WHERE name ILIKE '%Finanças%' AND news_category_id IS NULL;

UPDATE secretarias SET news_category_id = (
  SELECT id FROM news_categories WHERE slug = 'agricultura' LIMIT 1
) WHERE name ILIKE '%Agricultura%' AND news_category_id IS NULL;

UPDATE secretarias SET news_category_id = (
  SELECT id FROM news_categories WHERE slug = 'obras' LIMIT 1
) WHERE name ILIKE '%Obras%' AND news_category_id IS NULL;

UPDATE secretarias SET news_category_id = (
  SELECT id FROM news_categories WHERE slug = 'turismo-e-eventos' LIMIT 1
) WHERE (name ILIKE '%Turismo%' OR name ILIKE '%Eventos%') AND news_category_id IS NULL;

UPDATE secretarias SET news_category_id = (
  SELECT id FROM news_categories WHERE slug = 'planejamento-gestao' LIMIT 1
) WHERE name ILIKE '%Planejamento%' AND news_category_id IS NULL;

UPDATE secretarias SET news_category_id = (
  SELECT id FROM news_categories WHERE slug = 'esporte-cultura' LIMIT 1
) WHERE (name ILIKE '%Esporte%' OR name ILIKE '%Cultura%') AND news_category_id IS NULL;
