-- ============================================================
-- ANALYTICS — registro de pageviews do site público
-- ============================================================

create table if not exists analytics_pageviews (
  id           bigserial primary key,
  path         text not null,
  referrer     text,
  country      text,
  country_code text,
  city         text,
  lat          float,
  lng          float,
  device       text,  -- 'mobile' | 'tablet' | 'desktop'
  browser      text,
  os           text,
  created_at   timestamptz not null default now()
);

create index if not exists analytics_pageviews_created_at_idx
  on analytics_pageviews (created_at desc);

create index if not exists analytics_pageviews_path_idx
  on analytics_pageviews (path);

create index if not exists analytics_pageviews_country_code_idx
  on analytics_pageviews (country_code);

-- RLS
alter table analytics_pageviews enable row level security;

create policy "Anyone can insert pageviews"
  on analytics_pageviews for insert
  with check (true);

create policy "Staff can view analytics"
  on analytics_pageviews for select
  using (is_staff());
