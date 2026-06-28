-- leads cədvəlinə əlavə sütunlar (əgər yoxdursa)
alter table leads add column if not exists message text;
alter table leads add column if not exists budget  text;

-- Supabase schema cache yenilə
notify pgrst, 'reload schema';
