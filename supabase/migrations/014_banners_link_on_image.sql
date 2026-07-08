-- ============================================================
-- Opção de tornar a imagem inteira do banner clicável, abrindo o
-- link de destino (link_url) ao clicar em qualquer parte do banner.
-- Padrão false para não alterar o comportamento dos banners atuais.
-- ============================================================

alter table banners
  add column if not exists link_on_image boolean not null default false;
