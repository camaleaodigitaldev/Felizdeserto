-- Renomeia a categoria "Eventos" para "Turismo e Eventos"
UPDATE news_categories
SET name = 'Turismo e Eventos', slug = 'turismo-e-eventos'
WHERE slug = 'eventos';
