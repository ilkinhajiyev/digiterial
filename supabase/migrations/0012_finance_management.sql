-- Digiterial Finance OS: maliyyə uçotu, büdcə, rol və audit strukturu
alter table public.profiles
  add column if not exists finance_role text not null default 'employee'
  check (finance_role in ('administrator', 'accountant', 'manager', 'executive', 'employee'));

create table if not exists public.finance_accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null, type text not null check (type in ('bank', 'kassa')),
  currency text not null default 'AZN' check (currency = 'AZN'),
  balance numeric(16,2) not null default 0, active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.finance_income (
  id uuid primary key default gen_random_uuid(), client_name text not null, project_name text not null,
  service_type text not null, contract_no text not null default '', invoice_no text not null unique,
  net_amount numeric(16,2) not null check (net_amount >= 0), tax_amount numeric(16,2) not null default 0 check (tax_amount >= 0),
  total_amount numeric(16,2) generated always as (net_amount + tax_amount) stored,
  paid_amount numeric(16,2) not null default 0 check (paid_amount >= 0), payment_date date, due_date date not null,
  payment_method text not null check (payment_method in ('bank', 'kart', 'nağd')),
  status text not null check (status in ('gözlənilir', 'qismən ödənilib', 'ödənilib', 'gecikib')),
  responsible_id uuid references public.profiles(id) on delete set null, responsible_name text not null,
  note text, document_url text, recurring boolean not null default false,
  recurrence_day smallint check (recurrence_day between 1 and 28), agency_revenue boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.finance_expenses (
  id uuid primary key default gen_random_uuid(), supplier_name text not null, category text not null,
  project_name text, client_name text, net_amount numeric(16,2) not null check (net_amount >= 0),
  tax_amount numeric(16,2) not null default 0 check (tax_amount >= 0),
  total_amount numeric(16,2) generated always as (net_amount + tax_amount) stored,
  paid_amount numeric(16,2) not null default 0 check (paid_amount >= 0), expense_date date not null, due_date date,
  payment_method text not null check (payment_method in ('bank', 'kart', 'nağd')),
  status text not null check (status in ('gözlənilir', 'qismən ödənilib', 'ödənilib', 'gecikib')),
  responsible_id uuid references public.profiles(id) on delete set null, responsible_name text not null,
  note text, document_url text, recurring boolean not null default false, planned boolean not null default false,
  is_client_ad_budget boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.finance_budgets (
  id uuid primary key default gen_random_uuid(), period text not null,
  scope_type text not null check (scope_type in ('ümumi', 'müştəri', 'layihə', 'xidmət')),
  scope_name text not null, category text not null, revenue_plan numeric(16,2) not null default 0,
  expense_limit numeric(16,2) not null default 0, margin_target numeric(6,2) not null default 0,
  scenario text not null check (scenario in ('optimist', 'real', 'pessimist')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (period, scope_type, scope_name, category, scenario)
);

create table if not exists public.finance_tax_settings (
  id uuid primary key default gen_random_uuid(), name text not null default 'ƏDV',
  vat_rate numeric(6,3) not null default 18 check (vat_rate >= 0), calculation_rules jsonb not null default '{}'::jsonb,
  active boolean not null default true, created_at timestamptz not null default now(), updated_by uuid references public.profiles(id)
);

create table if not exists public.finance_month_closings (
  id uuid primary key default gen_random_uuid(), period text not null unique,
  checklist jsonb not null default '{}'::jsonb, closed boolean not null default false,
  closed_by uuid references public.profiles(id), closed_at timestamptz, created_at timestamptz not null default now()
);

create table if not exists public.finance_audit_log (
  id uuid primary key default gen_random_uuid(), actor_id uuid references public.profiles(id) on delete set null,
  user_name text not null default 'Sistem', action text not null, entity text not null, entity_id text,
  old_data jsonb, new_data jsonb, created_at timestamptz not null default now()
);

create index if not exists finance_income_due_idx on public.finance_income(due_date, status);
create index if not exists finance_income_client_idx on public.finance_income(client_name, project_name);
create index if not exists finance_expenses_date_idx on public.finance_expenses(expense_date, status);
create index if not exists finance_expenses_project_idx on public.finance_expenses(client_name, project_name);
create index if not exists finance_budgets_period_idx on public.finance_budgets(period, scenario);
create index if not exists finance_audit_created_idx on public.finance_audit_log(created_at desc);

create or replace function public.current_finance_role()
returns text language sql stable security definer set search_path = '' as $$
  select case
    when p.role = 'admin' then 'administrator'
    when p.role = 'manager' and p.finance_role = 'employee' then 'manager'
    else p.finance_role
  end from public.profiles p where p.id = auth.uid()
$$;

grant execute on function public.current_finance_role() to authenticated;

alter table public.finance_accounts enable row level security;
alter table public.finance_income enable row level security;
alter table public.finance_expenses enable row level security;
alter table public.finance_budgets enable row level security;
alter table public.finance_tax_settings enable row level security;
alter table public.finance_month_closings enable row level security;
alter table public.finance_audit_log enable row level security;

create policy finance_read on public.finance_income for select to authenticated
  using (public.current_finance_role() in ('administrator','accountant','executive','manager') or responsible_id = auth.uid());
create policy finance_read on public.finance_expenses for select to authenticated
  using (public.current_finance_role() in ('administrator','accountant','executive','manager') or responsible_id = auth.uid());
create policy finance_read on public.finance_accounts for select to authenticated
  using (public.current_finance_role() in ('administrator','accountant','executive','manager'));
create policy finance_read on public.finance_budgets for select to authenticated
  using (public.current_finance_role() in ('administrator','accountant','executive','manager'));
create policy finance_read on public.finance_tax_settings for select to authenticated
  using (public.current_finance_role() in ('administrator','accountant','executive','manager'));
create policy finance_read on public.finance_month_closings for select to authenticated
  using (public.current_finance_role() in ('administrator','accountant','executive','manager'));
create policy finance_read on public.finance_audit_log for select to authenticated
  using (public.current_finance_role() in ('administrator','accountant','executive'));

create policy finance_income_write on public.finance_income for all to authenticated
  using (public.current_finance_role() in ('administrator','accountant') or responsible_id = auth.uid())
  with check (public.current_finance_role() in ('administrator','accountant') or responsible_id = auth.uid());
create policy finance_expense_write on public.finance_expenses for all to authenticated
  using (public.current_finance_role() in ('administrator','accountant') or responsible_id = auth.uid())
  with check (public.current_finance_role() in ('administrator','accountant') or responsible_id = auth.uid());

do $$
declare table_name text;
begin
  foreach table_name in array array['finance_accounts','finance_budgets','finance_tax_settings','finance_month_closings']
  loop
    execute format('create policy finance_admin_write on public.%I for all to authenticated using (public.current_finance_role() in (''administrator'',''accountant'')) with check (public.current_finance_role() in (''administrator'',''accountant''))', table_name);
  end loop;
end $$;

insert into public.finance_tax_settings (name, vat_rate, active)
select 'ƏDV', 18, true where not exists (select 1 from public.finance_tax_settings);

insert into public.finance_accounts (name, type, balance)
select * from (values ('Kapital Bank — AZN','bank',48250::numeric),('ABB — AZN','bank',19800::numeric),('Baş kassa','kassa',3450::numeric)) v(name,type,balance)
where not exists (select 1 from public.finance_accounts);

comment on table public.finance_income is 'Agentliyin xidmət gəlirləri; agency_revenue=false tranzit vəsaitləri real gəlirdən ayırır.';
comment on column public.finance_expenses.is_client_ad_budget is 'true olduqda müştəri reklam büdcəsidir və agentlik mənfəətindən çıxılmır.';
