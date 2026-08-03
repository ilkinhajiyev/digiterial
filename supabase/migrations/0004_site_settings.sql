create table if not exists site_settings (
  id   int  primary key default 1,
  data jsonb not null default '{}'::jsonb,
  constraint single_row check (id = 1)
);

insert into site_settings (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

alter table site_settings enable row level security;

drop policy if exists "settings_public_read" on site_settings;
drop policy if exists "settings_staff_write" on site_settings;

-- auth_role() olmadan — authenticated istifadəçi yaza bilir
create policy "settings_public_read" on site_settings
  for select using (true);

create policy "settings_staff_write" on site_settings
  for all
  using  (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

notify pgrst, 'reload schema';
