-- ============================================================
-- Hardening de segurança (Supabase advisors)
-- ============================================================

-- 1) Corrige search_path mutável e qualifica referências (lint 0011)
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and is_active = true
  );
$$;

create or replace function public.is_staff()
returns boolean language sql security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active = true
  );
$$;

create or replace function public.publish_scheduled_news()
returns void language plpgsql set search_path = '' as $$
begin
  update public.news
  set status = 'published', published_at = now()
  where status = 'scheduled' and scheduled_for <= now();
end;
$$;

-- 2) Funções de trigger/manutenção não devem ser chamáveis via
--    PostgREST RPC por anon/authenticated. service_role e postgres
--    mantêm o execute (trigger de novo usuário e cron continuam ok).
--    Obs.: is_admin()/is_staff() NÃO são revogadas de propósito —
--    são usadas nas policies RLS e revogá-las quebra o RLS.
revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.publish_scheduled_news() from anon, authenticated, public;

-- 3) Remove insert público direto em analytics_pageviews (lint 0024).
--    Os pageviews continuam sendo gravados pela API /api/analytics/track
--    usando a service role (que ignora RLS).
drop policy if exists "Anyone can insert pageviews" on analytics_pageviews;
