alter table portfolio_items add column if not exists slug text;
alter table portfolio_items add column if not exists body text;
alter table portfolio_items add column if not exists gallery jsonb default '[]';
create unique index if not exists portfolio_slug_uq on portfolio_items(slug) where slug is not null;
