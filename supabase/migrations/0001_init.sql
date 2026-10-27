-- ============================================================
-- Digiterial Agency OS — initial schema
-- ============================================================

-- ENUMS
create type app_role        as enum ('admin','manager','specialist','client');
create type lead_stage       as enum ('new','contacted','proposal','negotiation','won','lost');
create type lead_source      as enum ('organic','paid','social','referral','direct');
create type project_status   as enum ('planning','in_progress','review','on_hold','completed','cancelled');
create type task_status      as enum ('backlog','in_progress','review','done');
create type invoice_status   as enum ('draft','sent','paid','overdue','void');
create type post_status      as enum ('draft','scheduled','published');
create type ticket_priority  as enum ('low','medium','high','urgent');
create type ticket_status    as enum ('open','in_progress','resolved','closed');
create type campaign_channel as enum ('google','meta','tiktok','other');
create type page_status      as enum ('draft','published');
create type client_status    as enum ('active','negotiation','paused','archived');

-- PROFILES
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  role app_role not null default 'specialist',
  avatar_url text,
  client_id uuid,
  created_at timestamptz not null default now()
);

-- CLIENTS
create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  status client_status not null default 'active',
  website text,
  contact_email text,
  contact_phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- LEADS
create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text,
  phone text,
  service text,
  value numeric(12,2) default 0,
  stage lead_stage not null default 'new',
  source lead_source default 'organic',
  message text,
  owner_id uuid references profiles(id),
  client_id uuid references clients(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- PROJECTS
create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client_id uuid references clients(id) on delete set null,
  type text,
  status project_status not null default 'planning',
  progress int default 0 check (progress between 0 and 100),
  budget numeric(12,2),
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table project_members (
  project_id uuid references projects(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  primary key (project_id, profile_id)
);

-- TASKS
create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  project_id uuid references projects(id) on delete cascade,
  assignee_id uuid references profiles(id),
  area text,
  status task_status not null default 'backlog',
  due_date date,
  position int default 0,
  created_at timestamptz not null default now()
);

-- CAMPAIGNS
create table campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client_id uuid references clients(id) on delete cascade,
  channel campaign_channel not null,
  spend numeric(12,2) default 0,
  conversions int default 0,
  roas numeric(6,2),
  status text default 'active',
  external_id text,
  synced_at timestamptz,
  created_at timestamptz not null default now()
);

-- KEYWORDS
create table keywords (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  keyword text not null,
  position int,
  volume int,
  difficulty text,
  tracked_at timestamptz default now()
);

-- INVOICES
create table invoices (
  id uuid primary key default gen_random_uuid(),
  number text unique not null,
  client_id uuid references clients(id),
  amount numeric(12,2) not null,
  status invoice_status not null default 'draft',
  issue_date date default current_date,
  due_date date,
  stripe_id text,
  created_at timestamptz not null default now()
);

-- CONTENT
create table content_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  locale text default 'az',
  body text,
  excerpt text,
  author_id uuid references profiles(id),
  keyword text,
  seo_score int,
  status post_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- TICKETS
create table tickets (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  client_id uuid references clients(id),
  priority ticket_priority default 'medium',
  status ticket_status default 'open',
  created_at timestamptz not null default now()
);

-- DOMAINS
create table domains (
  id uuid primary key default gen_random_uuid(),
  domain text not null,
  client_id uuid references clients(id),
  ssl_active boolean default true,
  expires_at date,
  created_at timestamptz not null default now()
);

-- PAGES (builder)
create table pages (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  locale text not null default 'az',
  seo_title text,
  slug text not null,
  meta_desc text,
  blocks jsonb not null default '[]',
  status page_status not null default 'draft',
  updated_by uuid references profiles(id),
  updated_at timestamptz not null default now(),
  unique (key, locale)
);

-- ACTIVITY LOG
create table activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id),
  action text, entity text, entity_id uuid, meta jsonb,
  created_at timestamptz not null default now()
);

-- INDEXES
create index on leads(stage);
create index on tasks(status);
create index on tasks(project_id);
create index on invoices(status);
create index on campaigns(client_id);
create index on content_posts(status, locale);

-- updated_at trigger
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;
create trigger t_clients_upd  before update on clients  for each row execute function set_updated_at();
create trigger t_leads_upd    before update on leads    for each row execute function set_updated_at();
create trigger t_projects_upd before update on projects for each row execute function set_updated_at();

-- new user -> profile
create or replace function handle_new_user() returns trigger as $$
begin
  insert into profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name','Yeni İstifadəçi'), 'specialist');
  return new;
end; $$ language plpgsql security definer;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- role helper
create or replace function auth_role() returns app_role as $$
  select role from profiles where id = auth.uid();
$$ language sql stable security definer;

-- ============ RLS ============
alter table profiles      enable row level security;
alter table clients       enable row level security;
alter table leads         enable row level security;
alter table projects      enable row level security;
alter table tasks         enable row level security;
alter table campaigns     enable row level security;
alter table keywords      enable row level security;
alter table invoices      enable row level security;
alter table content_posts enable row level security;
alter table tickets       enable row level security;
alter table domains       enable row level security;
alter table pages         enable row level security;
alter table activity_log  enable row level security;

-- profiles: hər kəs öz profilini görür; personal hamısını
create policy "profiles_self" on profiles for select using (id = auth.uid() or auth_role() in ('admin','manager','specialist'));
create policy "profiles_upd_self" on profiles for update using (id = auth.uid());

-- staff full access helper-policy (hər cədvəl üçün)
do $$
declare t text;
begin
  foreach t in array array['clients','leads','projects','tasks','campaigns','keywords','content_posts','tickets','domains','pages','activity_log']
  loop
    execute format($f$
      create policy "staff_all_%1$s" on %1$s for all
      using (auth_role() in ('admin','manager','specialist'))
      with check (auth_role() in ('admin','manager','specialist'));
    $f$, t);
  end loop;
end $$;

-- finance: yalnız admin/manager
create policy "finance_rw" on invoices for all
  using (auth_role() in ('admin','manager'))
  with check (auth_role() in ('admin','manager'));

-- müştəri portalı: öz layihələrini oxuyur
create policy "client_read_projects" on projects for select
  using (auth_role() = 'client' and client_id = (select client_id from profiles where id = auth.uid()));
