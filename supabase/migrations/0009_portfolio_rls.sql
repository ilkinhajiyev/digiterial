-- Portfolio yazma: service client onsuz da bypass edir,
-- amma authenticated staff da yaza bilsin deyə policy-ni sadələşdiririk.
do $$ declare r record;
begin
  for r in select policyname from pg_policies where schemaname='public' and tablename='portfolio_items'
  loop execute format('drop policy if exists %I on portfolio_items', r.policyname); end loop;
end $$;

-- Hamı oxuya bilər (sayt üçün)
create policy "portfolio_public_read" on portfolio_items
  for select using (true);

-- Authenticated istifadəçi yaza/redaktə/silə bilər
create policy "portfolio_auth_write" on portfolio_items
  for all to authenticated
  using (true) with check (true);

notify pgrst, 'reload schema';
