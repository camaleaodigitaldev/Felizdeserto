-- Adiciona campo de experiência/bio do secretário(a)
ALTER TABLE secretarias
  ADD COLUMN IF NOT EXISTS secretary_bio TEXT;

COMMENT ON COLUMN secretarias.secretary_bio IS 'Resumo da experiência/trajetória do secretário(a) — exibido abaixo do nome no mini-site';
