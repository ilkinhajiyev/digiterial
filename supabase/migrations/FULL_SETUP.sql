-- ============================================================
-- Digiterial — tam verilənlər bazası sxemi (0001 + 0002 + 0003 + 0004 + 0005)
-- Supabase SQL Editor-da bütün bu kodu seçib Run basın
-- ============================================================

-- ENUMS (əgər artıq varsa keçir)
do $$ begin
  create type app_role        as enum ('admin','manager','specialist','client');
exception when duplicate_object then null; end $$;
do $$ begin
  create type lead_stage      as enum ('new','contacted','proposal','negotiation','won','lost');
exception when duplicate_object then null; end $$;
do $$ begin
  create type lead_source     as enum ('organic','paid','social','referral','direct');
exception when duplicate_object then null; end $$;
do $$ begin
  create type project_status  as enum ('planning','in_progress','review','on_hold','completed','cancelled');
exception when duplicate_object then null; end $$;
do $$ begin
  create type task_status     as enum ('backlog','in_progress','review','done');
exception when duplicate_object then null; end $$;
do $$ begin
  create type invoice_status  as enum ('draft','sent','paid','overdue','void');
exception when duplicate_object then null; end $$;
do $$ begin
  create type post_status     as enum ('draft','scheduled','published');
exception when duplicate_object then null; end $$;
do $$ begin
  create type ticket_priority as enum ('low','medium','high','urgent');
exception when duplicate_object then null; end $$;
do $$ begin
  create type ticket_status   as enum ('open','in_progress','resolved','closed');
exception when duplicate_object then null; end $$;
do $$ begin
  create type campaign_channel as enum ('google','meta','tiktok','other');
exception when duplicate_object then null; end $$;
do $$ begin
  create type page_status     as enum ('draft','published');
exception when duplicate_object then null; end $$;
do $$ begin
  create type client_status   as enum ('active','negotiation','paused','archived');
exception when duplicate_object then null; end $$;
do $$ begin
  create type portfolio_category as enum ('web','smm');
exception when duplicate_object then null; end $$;

-- PROFILES
create table if not exists profiles (
  id          uuid primary key references auth.users on delete cascade,
  full_name   text,
  role        app_role not null default 'specialist',
  avatar_url  text,
  client_id   uuid,
  created_at  timestamptz not null default now()
);

-- CLIENTS
create table if not exists clients (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  industry      text,
  status        client_status not null default 'active',
  website       text,
  contact_email text,
  contact_phone text,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- LEADS
create table if not exists leads (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  company    text,
  email      text,
  phone      text,
  service    text,
  value      numeric(12,2) default 0,
  stage      lead_stage not null default 'new',
  source     lead_source default 'organic',
  message    text,
  budget     text,
  owner_id   uuid references profiles(id),
  client_id  uuid references clients(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- PROJECTS
create table if not exists projects (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  client_id  uuid references clients(id) on delete set null,
  type       text,
  status     project_status not null default 'planning',
  progress   int default 0 check (progress between 0 and 100),
  budget     numeric(12,2),
  due_date   date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_members (
  project_id uuid references projects(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  primary key (project_id, profile_id)
);

-- TASKS
create table if not exists tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  project_id  uuid references projects(id) on delete cascade,
  assignee_id uuid references profiles(id),
  area        text,
  status      task_status not null default 'backlog',
  due_date    date,
  position    int default 0,
  created_at  timestamptz not null default now()
);

-- CAMPAIGNS
create table if not exists campaigns (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  client_id   uuid references clients(id) on delete cascade,
  channel     campaign_channel not null,
  spend       numeric(12,2) default 0,
  conversions int default 0,
  roas        numeric(6,2),
  status      text default 'active',
  external_id text,
  synced_at   timestamptz,
  created_at  timestamptz not null default now()
);

-- KEYWORDS
create table if not exists keywords (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid references clients(id) on delete cascade,
  keyword    text not null,
  position   int,
  volume     int,
  difficulty text,
  tracked_at timestamptz default now()
);

-- INVOICES
create table if not exists invoices (
  id         uuid primary key default gen_random_uuid(),
  number     text unique not null,
  client_id  uuid references clients(id),
  amount     numeric(12,2) not null,
  status     invoice_status not null default 'draft',
  issue_date date default current_date,
  due_date   date,
  stripe_id  text,
  created_at timestamptz not null default now()
);

-- CONTENT
create table if not exists content_posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text unique not null,
  locale       text default 'az',
  body         text,
  excerpt      text,
  author_id    uuid references profiles(id),
  keyword      text,
  seo_score    int,
  status       post_status not null default 'draft',
  published_at timestamptz,
  created_at   timestamptz not null default now()
);

-- TICKETS
create table if not exists tickets (
  id         uuid primary key default gen_random_uuid(),
  subject    text not null,
  client_id  uuid references clients(id),
  priority   ticket_priority default 'medium',
  status     ticket_status default 'open',
  created_at timestamptz not null default now()
);

-- DOMAINS
create table if not exists domains (
  id         uuid primary key default gen_random_uuid(),
  domain     text not null,
  client_id  uuid references clients(id),
  ssl_active boolean default true,
  expires_at date,
  created_at timestamptz not null default now()
);

-- PAGES (builder)
create table if not exists pages (
  id         uuid primary key default gen_random_uuid(),
  key        text not null,
  locale     text not null default 'az',
  seo_title  text,
  slug       text not null,
  meta_desc  text,
  blocks     jsonb not null default '[]',
  status     page_status not null default 'draft',
  updated_by uuid references profiles(id),
  updated_at timestamptz not null default now(),
  unique (key, locale)
);

-- PORTFOLIO
create table if not exists portfolio_items (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  category    portfolio_category not null default 'web',
  slug        text,
  client      text,
  description text,
  body        text,
  url         text,
  image_url   text,
  gallery     jsonb default '[]',
  tags        text,
  metric      text,
  featured    boolean default false,
  position    int default 0,
  created_at  timestamptz not null default now()
);
create unique index if not exists portfolio_slug_uq on portfolio_items(slug) where slug is not null;

-- SITE SETTINGS
create table if not exists site_settings (
  id   int primary key default 1,
  data jsonb not null default '{}'::jsonb,
  constraint single_row check (id = 1)
);
insert into site_settings (id, data) values (1, '{}'::jsonb)
  on conflict (id) do nothing;

-- ACTIVITY LOG
create table if not exists activity_log (
  id         uuid primary key default gen_random_uuid(),
  actor_id   uuid references profiles(id),
  action     text, entity text, entity_id uuid, meta jsonb,
  created_at timestamptz not null default now()
);

-- İNDEKSLƏR
create index if not exists idx_leads_stage        on leads(stage);
create index if not exists idx_tasks_status       on tasks(status);
create index if not exists idx_tasks_project      on tasks(project_id);
create index if not exists idx_invoices_status    on invoices(status);
create index if not exists idx_campaigns_client   on campaigns(client_id);
create index if not exists idx_posts_status       on content_posts(status, locale);
create index if not exists idx_portfolio_category on portfolio_items(category);

-- TRIGGERS
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists t_clients_upd  on clients;
drop trigger if exists t_leads_upd    on leads;
drop trigger if exists t_projects_upd on projects;
create trigger t_clients_upd  before update on clients  for each row execute function set_updated_at();
create trigger t_leads_upd    before update on leads    for each row execute function set_updated_at();
create trigger t_projects_upd before update on projects for each row execute function set_updated_at();

-- YENİ İSTİFADƏÇİ → PROFİL
create or replace function handle_new_user() returns trigger as $$
begin
  insert into profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name','Yeni İstifadəçi'), 'specialist');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ROL KÖMƏKÇİ FUNKSİYA
create or replace function auth_role() returns app_role as $$
  select role from profiles where id = auth.uid();
$$ language sql stable security definer;

-- ============ RLS ============
do $$ declare t text;
begin
  foreach t in array array[
    'profiles','clients','leads','projects','tasks','campaigns',
    'keywords','invoices','content_posts','tickets','domains',
    'pages','portfolio_items','site_settings','activity_log'
  ] loop
    execute format('alter table %I enable row level security', t);
  end loop;
end $$;

-- Köhnə policy-ləri sil (idempotent)
do $$ declare r record;
begin
  for r in select policyname, tablename from pg_policies where schemaname = 'public'
  loop
    execute format('drop policy if exists %I on %I', r.policyname, r.tablename);
  end loop;
end $$;

-- PROFILES
create policy "profiles_select" on profiles for select
  using (id = auth.uid() or auth_role() in ('admin','manager','specialist'));
create policy "profiles_update" on profiles for update
  using (id = auth.uid());

-- STAFF FULL ACCESS (clients, leads, projects, tasks, campaigns, keywords, content_posts, tickets, domains, pages, activity_log)
do $$ declare t text;
begin
  foreach t in array array[
    'clients','leads','projects','tasks','campaigns','keywords',
    'content_posts','tickets','domains','pages','activity_log'
  ] loop
    execute format($f$
      create policy "staff_all_%1$s" on %1$s for all
      using  (auth_role() in ('admin','manager','specialist'))
      with check (auth_role() in ('admin','manager','specialist'));
    $f$, t);
  end loop;
end $$;

-- PORTFOLIO — ictimai oxu, staff yazır
create policy "portfolio_public_read" on portfolio_items
  for select using (true);
create policy "portfolio_staff_write" on portfolio_items for all
  using  (auth_role() in ('admin','manager','specialist'))
  with check (auth_role() in ('admin','manager','specialist'));

-- INVOICES — yalnız admin/manager
create policy "finance_rw" on invoices for all
  using  (auth_role() in ('admin','manager'))
  with check (auth_role() in ('admin','manager'));

-- SITE SETTINGS — ictimai oxu, staff yazır
create policy "settings_public_read" on site_settings
  for select using (true);
create policy "settings_staff_write" on site_settings for all
  using  (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- CLIENT PORTAL — öz layihələrini görür
create policy "client_read_projects" on projects for select
  using (
    auth_role() = 'client'
    and client_id = (select client_id from profiles where id = auth.uid())
  );

-- LEADS — saytdan gələn formlar üçün ictimai insert
create policy "leads_public_insert" on leads
  for insert with check (true);

-- Schema cache yenilə
notify pgrst, 'reload schema';
