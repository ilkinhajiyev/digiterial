-- Demo məlumat (auth istifadəçiləri Supabase Studio-dan əlavə olunur)
insert into clients (name, industry, status, website) values
 ('RestoBaku','Restoran','active','restobaku.az'),
 ('Aztravel','Səyahət','active','aztravel.az'),
 ('NovaFinance','Maliyyə','active','novafinance.az'),
 ('MediClinic','Səhiyyə','active',null);

insert into pages (key, locale, slug, seo_title, meta_desc, status, blocks) values
 ('home','az','/','Digiterial — Rəqəmsal Marketinq Agentliyi','360° rəqəmsal agentlik.','published',
  '[{"type":"hero","props":{"eyebrow":"360° rəqəmsal agentlik","h1":"Müasir brendlər üçün rəqəmsal təcrübələr yaradırıq.","lead":"Strategiyadan icraya — ölçülə bilən nəticələr.","b1":"Xidmətlərimiz","b2":"İşlərimizə bax"}}]');
