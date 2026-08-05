-- Security hardening: least-privilege admin access and safe public policies.
begin;

create or replace function public.auth_role() returns public.app_role
language sql stable security definer
set search_path = ''
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- A newly-created authenticated account must not inherit staff access.
do $$ declare t text; r record;
begin
  foreach t in array array[
    'clients','leads','projects','tasks','campaigns','keywords',
    'content_posts','tickets','domains','pages','activity_log'
  ] loop
    for r in select policyname from pg_policies where schemaname = 'public' and tablename = t
    loop
      if r.policyname like 'staff_all_%' or r.policyname like 'admin_manager_all_%' then
        execute format('drop policy if exists %I on public.%I', r.policyname, t);
      end if;
    end loop;
    execute format($policy$
      create policy "admin_manager_all_%1$s" on public.%1$s for all
      to authenticated
      using (public.auth_role() in ('admin','manager'))
      with check (public.auth_role() in ('admin','manager'))
    $policy$, t);
  end loop;
end $$;

-- Users may edit only harmless profile fields, never their own role.
drop policy if exists "profiles_self" on public.profiles;
drop policy if exists "profiles_select" on public.profiles;
drop policy if exists "profiles_upd_self" on public.profiles;
drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_read_own_or_admin" on public.profiles for select
  to authenticated using (id = auth.uid() or public.auth_role() in ('admin','manager'));
create policy "profiles_update_own" on public.profiles for update
  to authenticated using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from authenticated;
grant update (full_name, avatar_url) on public.profiles to authenticated;

-- Site settings may be read publicly but changed only by privileged staff.
drop policy if exists "settings_staff_write" on public.site_settings;
drop policy if exists "settings_admin_write" on public.site_settings;
create policy "settings_admin_write" on public.site_settings for all
  to authenticated
  using (public.auth_role() in ('admin','manager'))
  with check (public.auth_role() in ('admin','manager'));

-- Portfolio content is public to read; writes are restricted to admin/manager.
drop policy if exists "portfolio_auth_write" on public.portfolio_items;
drop policy if exists "portfolio_staff_write" on public.portfolio_items;
drop policy if exists "portfolio_admin_write" on public.portfolio_items;
create policy "portfolio_admin_write" on public.portfolio_items for all
  to authenticated
  using (public.auth_role() in ('admin','manager'))
  with check (public.auth_role() in ('admin','manager'));

-- Public leads can only enter the initial unprivileged state.
drop policy if exists "leads_public_insert" on public.leads;
drop policy if exists "leads_anon_insert" on public.leads;
drop policy if exists "leads_staff_select" on public.leads;
drop policy if exists "leads_staff_update" on public.leads;
drop policy if exists "leads_staff_delete" on public.leads;
create policy "leads_public_insert_limited" on public.leads for insert
  to anon, authenticated
  with check (
    stage = 'new' and source = 'organic' and coalesce(value, 0) = 0
    and owner_id is null and client_id is null
  );

-- Storage was previously writable/deletable by any visitor.
drop policy if exists "portfolio_upload" on storage.objects;
drop policy if exists "portfolio_delete" on storage.objects;
drop policy if exists "portfolio_admin_upload" on storage.objects;
drop policy if exists "portfolio_admin_delete" on storage.objects;
create policy "portfolio_admin_upload" on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio' and public.auth_role() in ('admin','manager'));
create policy "portfolio_admin_delete" on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio' and public.auth_role() in ('admin','manager'));

notify pgrst, 'reload schema';
commit;
