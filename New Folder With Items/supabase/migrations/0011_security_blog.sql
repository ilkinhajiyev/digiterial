-- ============================================================
-- 0011 — Təhlükəsizlik düzəlişləri + bloq sahələri
-- Supabase SQL Editor-da bir dəfə işə salın (idempotentdir).
-- ============================================================

-- 1) Yeni qeydiyyatdan keçən istifadəçi avtomatik "staff" OLMAMALIDIR.
--    Əvvəl hər yeni hesab 'specialist' alırdı — Supabase-də qeydiyyat açıq
--    olduqda istənilən şəxs bütün CRM məlumatlarına çıxış əldə edə bilərdi.
create or replace function handle_new_user() returns trigger as $$
begin
  insert into profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Yeni İstifadəçi'), 'client')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

alter table profiles alter column role set default 'client';

-- Komanda üzvünü staff etmək üçün (email-i dəyişin):
-- update profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'siz@digiterial.com');

-- 2) Profil: istifadəçi öz rolunu dəyişə bilməməlidir
drop policy if exists "profiles_update" on profiles;
create policy "profiles_update" on profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select p.role from profiles p where p.id = auth.uid()));

-- 3) Site settings — yalnız admin/manager yazır
drop policy if exists "settings_staff_write" on site_settings;
create policy "settings_staff_write" on site_settings for all
  using  (auth_role() in ('admin','manager'))
  with check (auth_role() in ('admin','manager'));

-- 4) Portfolio — yalnız staff yazır (0009 hər authenticated-ə icazə verirdi)
drop policy if exists "portfolio_auth_write" on portfolio_items;
drop policy if exists "portfolio_staff_write" on portfolio_items;
create policy "portfolio_staff_write" on portfolio_items for all
  using  (auth_role() in ('admin','manager','specialist'))
  with check (auth_role() in ('admin','manager','specialist'));

-- 5) Storage — anonim yükləmə/silmə bağlanır, yalnız staff
drop policy if exists "portfolio_upload" on storage.objects;
create policy "portfolio_upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio' and auth_role() in ('admin','manager','specialist'));
drop policy if exists "portfolio_delete" on storage.objects;
create policy "portfolio_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio' and auth_role() in ('admin','manager','specialist'));

-- 6) Leads — ictimai insert yalnız "new" mərhələsi ilə, digər sahələrə toxunmadan
drop policy if exists "leads_anon_insert" on leads;
drop policy if exists "leads_public_insert" on leads;
create policy "leads_anon_insert" on leads for insert to anon, authenticated
  with check (stage = 'new' and owner_id is null and client_id is null);

-- 7) Bloq: üz qabığı şəkli + ictimai oxu (yalnız dərc olunmuş yazılar)
alter table content_posts add column if not exists cover_url text;
drop policy if exists "posts_public_read" on content_posts;
create policy "posts_public_read" on content_posts for select
  using (status = 'published');
create index if not exists idx_posts_slug on content_posts(slug);

-- 8) Leads: telefon/büdcə sahələri (köhnə bazalarda yoxdursa)
alter table leads add column if not exists phone text;
alter table leads add column if not exists budget text;
alter table leads add column if not exists message text;
alter table leads add column if not exists email text;

notify pgrst, 'reload schema';
