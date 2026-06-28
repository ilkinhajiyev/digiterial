create table if not exists site_settings (id int primary key default 1, data jsonb not null default '{}');
insert into site_settings (id, data) values (1, '{}') on conflict (id) do nothing;
alter table site_settings enable row level security;
create policy "settings_public_read" on site_settings for select using (true);
create policy "settings_staff_write" on site_settings for all
  using (auth_role() in ('admin','manager','specialist')) with check (auth_role() in ('admin','manager','specialist'));
