-- leads cədvəlinin bütün policy-lərini sil və yenidən yaz
do $$ declare r record;
begin
  for r in select policyname from pg_policies where schemaname='public' and tablename='leads'
  loop
    execute format('drop policy if exists %I on leads', r.policyname);
  end loop;
end $$;

-- Saytdan anonim insert (RLS bypass yox, policy ilə)
create policy "leads_anon_insert" on leads
  for insert
  to anon, authenticated
  with check (true);

-- Staff oxu + idarəetmə
create policy "leads_staff_select" on leads
  for select
  to authenticated
  using (auth_role() in ('admin','manager','specialist'));

create policy "leads_staff_update" on leads
  for update
  to authenticated
  using  (auth_role() in ('admin','manager','specialist'))
  with check (auth_role() in ('admin','manager','specialist'));

create policy "leads_staff_delete" on leads
  for delete
  to authenticated
  using (auth_role() in ('admin','manager','specialist'));

notify pgrst, 'reload schema';
