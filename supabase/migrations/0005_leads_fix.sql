-- leads cədvəlinə çatışmayan sütunlar əlavə et
alter table leads add column if not exists message text;
alter table leads add column if not exists budget  text;

-- Köhnə leads policy-ləri sil
drop policy if exists "staff_all_leads"   on leads;
drop policy if exists "leads_public_insert" on leads;
drop policy if exists "leads_select"      on leads;

-- Saytdan gələn formlar üçün ictimai insert (RLS bypass etmədən)
create policy "leads_public_insert" on leads
  for insert with check (true);

-- Staff hamısını görür və idarə edir
create policy "leads_staff_all" on leads
  for all
  using  (auth_role() in ('admin','manager','specialist'))
  with check (auth_role() in ('admin','manager','specialist'));

notify pgrst, 'reload schema';
