-- ============================================================
-- Mensagens do formulário "Fale Conosco".
-- As mensagens passam a ser armazenadas no banco e exibidas no
-- painel admin (antes eram enviadas apenas por e-mail).
-- ============================================================

create table if not exists contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  subject     text not null,
  message     text not null,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on contact_messages (created_at desc);

alter table contact_messages enable row level security;

-- Leitura/gestão apenas para staff (contas ativas). A inserção das
-- mensagens do formulário público é feita pela API usando a service
-- role, então NÃO há policy de insert para anon/public.
create policy "Staff read contact messages"   on contact_messages for select using (is_staff());
create policy "Staff update contact messages" on contact_messages for update using (is_staff());
create policy "Staff delete contact messages" on contact_messages for delete using (is_staff());
