-- Portfolio çoxdilli dəstək: locale sütunu
alter table portfolio_items add column if not exists locale text not null default 'az';

-- Köhnə qeydlər 'az' olaraq qalır. İndeks əlavə et
create index if not exists portfolio_locale_idx on portfolio_items(locale);

notify pgrst, 'reload schema';
