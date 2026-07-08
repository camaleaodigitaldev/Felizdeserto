-- ============================================================
-- Adiciona a opção de exibir (ou não) o gradiente escuro sobre
-- a imagem do banner/hero. Padrão true para manter o
-- comportamento atual dos banners já cadastrados.
-- ============================================================

alter table banners
  add column if not exists show_gradient boolean not null default true;
