-- Portfolio (manual qeydlər): Veb sayt + SMM
create type portfolio_category as enum ('web','smm');

create table portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category portfolio_category not null default 'web',
  client text,
  description text,
  url text,
  image_url text,
  tags text,
  metric text,
  featured boolean default false,
  position int default 0,
  created_at timestamptz not null default now()
);
create index on portfolio_items(category);

alter table portfolio_items enable row level security;
-- ictimai oxuna bilər (sayt göstərir)
create policy "portfolio_public_read" on portfolio_items for select using (true);
-- yalnız personal yaza bilər
create policy "portfolio_staff_write" on portfolio_items for all
  using (auth_role() in ('admin','manager','specialist'))
  with check (auth_role() in ('admin','manager','specialist'));
