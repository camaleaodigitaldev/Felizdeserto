-- ============================================================
-- PREFEITURA MUNICIPAL DE FELIZ DESERTO/AL
-- Schema inicial do banco de dados Supabase
-- ============================================================

-- EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ============================================================
-- ENUMS
-- ============================================================
create type user_role as enum ('admin', 'editor');
create type news_status as enum ('draft', 'scheduled', 'published', 'archived');
create type edital_status as enum ('aberto', 'encerrado', 'suspenso', 'anulado', 'homologado');
create type edital_category as enum (
  'licitacao',
  'pregao',
  'dispensa',
  'inexigibilidade',
  'chamamento_publico',
  'concurso_publico',
  'processo_seletivo',
  'outro'
);

-- ============================================================
-- PROFILES (estende auth.users do Supabase)
-- ============================================================
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  role        user_role not null default 'editor',
  avatar_url  text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Trigger: cria perfil automaticamente ao criar usuário
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    'editor'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- CATEGORIAS DE NOTÍCIAS
-- ============================================================
create table news_categories (
  id          serial primary key,
  name        text not null unique,
  slug        text not null unique,
  color       text not null default '#16a34a',
  created_at  timestamptz not null default now()
);

-- ============================================================
-- NOTÍCIAS
-- ============================================================
create table news (
  id               uuid primary key default uuid_generate_v4(),
  title            text not null,
  slug             text not null unique,
  summary          text,
  body             text not null default '',
  cover_image_url  text,
  category_id      integer references news_categories(id) on delete set null,
  author_id        uuid references profiles(id) on delete set null,
  status           news_status not null default 'draft',
  published_at     timestamptz,
  scheduled_for    timestamptz,
  views            integer not null default 0,
  tags             text[] default '{}',
  meta_title       text,
  meta_description text,
  og_image_url     text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_news_slug      on news(slug);
create index idx_news_status    on news(status);
create index idx_news_published on news(published_at desc) where status = 'published';
create index idx_news_category  on news(category_id);
create index idx_news_search    on news using gin(
  to_tsvector('portuguese', title || ' ' || coalesce(summary, '') || ' ' || body)
);

-- Auto-publica notícias agendadas (chamar via cron ou Edge Function)
create or replace function publish_scheduled_news()
returns void language plpgsql as $$
begin
  update news
  set status = 'published', published_at = now()
  where status = 'scheduled' and scheduled_for <= now();
end;
$$;

-- ============================================================
-- SECRETARIAS
-- ============================================================
create table secretarias (
  id                  serial primary key,
  name                text not null,
  slug                text not null unique,
  short_name          text,
  secretary_name      text not null,
  secretary_photo_url text,
  description         text,
  phone               text,
  email               text,
  address             text,
  hours               text,
  display_order       integer not null default 0,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ============================================================
-- EDITAIS E LICITAÇÕES
-- ============================================================
create table editais (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  number       text not null,
  category     edital_category not null default 'licitacao',
  status       edital_status not null default 'aberto',
  description  text,
  pdf_url      text,
  pdf_filename text,
  opening_date date,
  closing_date date,
  value        numeric(15,2),
  published_by uuid references profiles(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_editais_status   on editais(status);
create index idx_editais_category on editais(category);
create index idx_editais_date     on editais(created_at desc);

-- ============================================================
-- VÍDEOS (YouTube)
-- ============================================================
create table videos (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  description   text,
  youtube_url   text not null,
  youtube_id    text not null,
  thumbnail_url text,
  is_featured   boolean not null default false,
  display_order integer not null default 0,
  published_by  uuid references profiles(id) on delete set null,
  created_at    timestamptz not null default now()
);

create index idx_videos_featured on videos(is_featured) where is_featured = true;
create index idx_videos_order    on videos(display_order, created_at desc);

-- ============================================================
-- TELEFONES ÚTEIS
-- ============================================================
create table useful_phones (
  id            serial primary key,
  category      text not null,
  name          text not null,
  phone         text not null,
  notes         text,
  display_order integer not null default 0,
  is_active     boolean not null default true
);

-- ============================================================
-- CACHE DO INSTAGRAM
-- ============================================================
create table instagram_cache (
  id         serial primary key,
  post_id    text not null unique,
  caption    text,
  media_url  text not null,
  permalink  text not null,
  media_type text not null,
  timestamp  timestamptz not null,
  cached_at  timestamptz not null default now()
);

create index idx_instagram_cached on instagram_cache(cached_at desc);

-- ============================================================
-- BANNERS / HERO SLIDER
-- ============================================================
create table banners (
  id            serial primary key,
  title         text not null,
  subtitle      text,
  image_url     text not null,
  link_url      text,
  link_label    text,
  display_order integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- CONFIGURAÇÕES DO SITE
-- ============================================================
create table site_settings (
  key           text primary key,
  value         text,
  label         text not null,
  setting_group text not null default 'geral',
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table profiles        enable row level security;
alter table news            enable row level security;
alter table news_categories enable row level security;
alter table secretarias     enable row level security;
alter table editais         enable row level security;
alter table videos          enable row level security;
alter table useful_phones   enable row level security;
alter table instagram_cache enable row level security;
alter table banners         enable row level security;
alter table site_settings   enable row level security;

-- Helpers
create or replace function is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin' and is_active = true
  );
$$;

create or replace function is_staff()
returns boolean language sql security definer as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and is_active = true
  );
$$;

-- PROFILES
create policy "Users can view own profile"        on profiles for select using (id = auth.uid());
create policy "Admin can view all profiles"       on profiles for select using (is_admin());
create policy "Admin can update profiles"         on profiles for update using (is_admin());

-- NEWS
create policy "Published news visible to all"     on news for select using (status = 'published');
create policy "Staff can view all news"           on news for select using (is_staff());
create policy "Staff can insert news"             on news for insert with check (is_staff());
create policy "Admin can update any news"         on news for update using (is_admin());
create policy "Editor can update own news"        on news for update using (author_id = auth.uid());
create policy "Admin can delete news"             on news for delete using (is_admin());

-- CATEGORIES (public read)
create policy "Public read categories"            on news_categories for select using (true);
create policy "Admin manage categories"           on news_categories for all    using (is_admin());

-- SECRETARIAS
create policy "Public read secretarias"           on secretarias for select using (is_active = true);
create policy "Admin manage secretarias"          on secretarias for all    using (is_admin());

-- EDITAIS
create policy "Public read editais"               on editais for select using (true);
create policy "Staff manage editais"              on editais for all    using (is_staff());

-- VIDEOS
create policy "Public read videos"                on videos for select using (true);
create policy "Staff manage videos"               on videos for all    using (is_staff());

-- USEFUL PHONES
create policy "Public read phones"                on useful_phones for select using (is_active = true);
create policy "Admin manage phones"               on useful_phones for all    using (is_admin());

-- INSTAGRAM CACHE
create policy "Public read instagram_cache"       on instagram_cache for select using (true);
create policy "Admin manage instagram_cache"      on instagram_cache for all    using (is_admin());

-- BANNERS
create policy "Public read banners"               on banners for select using (is_active = true);
create policy "Admin manage banners"              on banners for all    using (is_admin());

-- SETTINGS
create policy "Public read settings"              on site_settings for select using (true);
create policy "Admin manage settings"             on site_settings for all    using (is_admin());
