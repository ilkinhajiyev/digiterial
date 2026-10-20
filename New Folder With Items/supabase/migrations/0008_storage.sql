-- portfolio storage bucket yarat (public oxu)
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- Public oxu icazəsi
drop policy if exists "portfolio_public_read" on storage.objects;
create policy "portfolio_public_read" on storage.objects
  for select using (bucket_id = 'portfolio');

-- Yükləmə icazəsi (service role onsuz da bypass edir, amma authenticated də yaza bilsin)
drop policy if exists "portfolio_upload" on storage.objects;
create policy "portfolio_upload" on storage.objects
  for insert with check (bucket_id = 'portfolio');

drop policy if exists "portfolio_delete" on storage.objects;
create policy "portfolio_delete" on storage.objects
  for delete using (bucket_id = 'portfolio');
