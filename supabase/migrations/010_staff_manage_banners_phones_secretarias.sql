-- ============================================================
-- Allow staff (any active profile) to manage banners, phones
-- and secretarias — previously restricted to admins only.
-- This lets editor accounts create/edit these from the admin
-- panel without hitting row-level security errors.
-- ============================================================

-- BANNERS
drop policy if exists "Admin manage banners" on banners;
create policy "Staff manage banners" on banners for all using (is_staff());

-- USEFUL PHONES
drop policy if exists "Admin manage phones" on useful_phones;
create policy "Staff manage phones" on useful_phones for all using (is_staff());

-- SECRETARIAS
drop policy if exists "Admin manage secretarias" on secretarias;
create policy "Staff manage secretarias" on secretarias for all using (is_staff());
