-- Admin istifadəçisinin profiles-də olduğunu yoxla və əlavə et
-- (UUID-ni Supabase Authentication → Users-dən götürün)
-- Bu SQL-i işə salmadan əvvəl UUID-ni dəyişdirin:

-- SELECT id, email FROM auth.users;  -- əvvəlcə bunu işə salıb UUID tapın

-- Sonra aşağıdakını UUID ilə işə salın:
-- insert into profiles (id, full_name, role)
-- values ('BURAYA-UUID-YAZIN', 'Admin', 'admin')
-- on conflict (id) do update set role = 'admin';
