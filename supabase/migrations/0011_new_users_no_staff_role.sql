-- Yeni qeydiyyatdan keçən istifadəçi avtomatik işçi (specialist) rolu almasın.
-- Əvvəl: hər yeni istifadəçi 'specialist' olurdu və admin paneldə yazma hüququ qazanırdı.
-- İndi: yeni istifadəçi 'client' olur; işçi hüququnu yalnız admin əl ilə verir.
--
-- Mövcud istifadəçilərin rollarına toxunmur.
-- Supabase → SQL Editor-da bir dəfə işə salın.

create or replace function handle_new_user() returns trigger as $$
begin
  insert into profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Yeni İstifadəçi'), 'client');
  return new;
end;
$$ language plpgsql security definer;

alter table profiles alter column role set default 'client';

-- Yoxlama: hazırkı işçilərin siyahısı (gözlənilməz hesab varsa, rolunu 'client' edin)
-- select p.id, u.email, p.role, u.created_at
-- from profiles p join auth.users u on u.id = p.id
-- where p.role in ('admin', 'manager', 'specialist')
-- order by u.created_at desc;
--
-- Gözlənilməz hesabın rolunu dəyişmək üçün:
-- update profiles set role = 'client' where id = 'İSTİFADƏÇİ-UUID';
