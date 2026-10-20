-- ============================================================
-- 0012 — Köhnə builder qeydlərinin təmizlənməsi (istəyə görə)
-- Köhnə builder hər dil üçün Azərbaycan mətnini saxlayırdı və ana səhifəni
-- köhnə dizaynın blokları ilə yazırdı. Sayt bu qeydləri artıq avtomatik
-- nəzərə almır, lakin bazanı təmiz saxlamaq üçün bu SQL-i işə sala bilərsiniz.
-- ============================================================

-- 1) EN/RU/DE səhifələrində saxlanılmış Azərbaycan mətni
delete from pages
where locale <> 'az' and blocks::text ~ '[əƏ]';

-- 2) Slayderli hero olmayan köhnə ana səhifə qeydləri
delete from pages
where key = 'home'
  and coalesce((blocks->0->'props'->>'showAside')::boolean, false) = false;

-- 3) Yoxlama: qalan səhifələr
select key, locale, updated_at from pages order by key, locale;
