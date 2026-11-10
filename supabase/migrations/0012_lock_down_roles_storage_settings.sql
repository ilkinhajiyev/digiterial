-- Təhlükəsizlik: rollar, şəkil anbarı və sayt ayarları yalnız işçilərə açıqdır.
-- 0011 da daxildir (yeni istifadəçi 'client' olur). Mövcud rollara toxunmur.

-- 1) Yeni qeydiyyat işçi rolu almır
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Yeni İstifadəçi'), 'client');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

alter table public.profiles alter column role set default 'client';

-- 2) İstifadəçi öz rolunu (və client_id-ni) dəyişə bilməz; yalnız admin və ya service role/SQL
create or replace function public.protect_profile_role() returns trigger as $$
begin
  if (new.role is distinct from old.role or new.client_id is distinct from old.client_id)
     and auth.uid() is not null
     and coalesce(public.auth_role()::text, '') <> 'admin' then
    raise exception 'Rolu yalnız admin dəyişə bilər';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists protect_profile_role on public.profiles;
create trigger protect_profile_role before update on public.profiles
  for each row execute function public.protect_profile_role();

-- 3) Sayt ayarlarını yalnız işçilər yaza bilər (oxumaq hamıya açıqdır)
drop policy if exists settings_staff_write on public.site_settings;
create policy settings_staff_write on public.site_settings for all
  using (public.auth_role() in ('admin', 'manager', 'specialist'))
  with check (public.auth_role() in ('admin', 'manager', 'specialist'));

-- 4) portfolio şəkil anbarı: oxumaq hamıya, yükləmək/silmək yalnız işçilərə
drop policy if exists portfolio_upload on storage.objects;
drop policy if exists portfolio_delete on storage.objects;
create policy portfolio_upload on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio' and public.auth_role() in ('admin', 'manager', 'specialist'));
create policy portfolio_update on storage.objects for update to authenticated
  using (bucket_id = 'portfolio' and public.auth_role() in ('admin', 'manager', 'specialist'));
create policy portfolio_delete on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio' and public.auth_role() in ('admin', 'manager', 'specialist'));
