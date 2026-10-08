# Digiterial — 2026 yeniləməsi

Saytın dizaynı tam yenidən qurulub, backend-də ciddi təhlükəsizlik boşluqları bağlanıb, admin paneldə xətalar düzəldilib.

## ⚠️ Yerləşdirmədən əvvəl mütləq

1. **SQL migrasiyasını işə salın:** `supabase/migrations/0011_security_blog.sql` faylını Supabase → SQL Editor-da Run edin.
2. **Admin rolunu yoxlayın.** Admin panel indi yalnız `profiles.role` = `admin`, `manager` və ya `specialist` olan istifadəçiləri buraxır:
   ```sql
   select u.email, p.role from auth.users u left join profiles p on p.id = u.id;
   -- lazım olsa:
   update profiles set role = 'admin' where id = (select id from auth.users where email = 'siz@digiterial.com');
   ```
3. Tövsiyə: Supabase → Authentication → Providers → Email → **"Allow new users to sign up"** söndürün.

## Dizayn (UI/UX) — "Noir" kinematik üslub

- Qara səhnə, fil sümüyü mətn və şampan qızılı işıq (#E7B76A); bütün sayta film dənəvərliyi teksturası.
- Tipoqrafiya: Cormorant Garamond (serif başlıqlar, qızılı kursiv vurğular) + Inter Tight + JetBrains Mono. Self-hosted, Ə/ə, kiril və alman simvolları dəstəklənir.
- Hero: **real vaxtda WebGL ilə çəkilən maye metal obyekt** (raymarching, studiya işığı əks olunmaları, siçana reaksiya). Xarici kitabxana yoxdur; ekrandan çıxanda dayanır, "azaldılmış hərəkət" rejimində tək kadr göstərir, WebGL olmayan cihazlarda CSS fallback.
- Başlıqlar sözbəsöz maskadan açılır; manifest mətni scroll etdikcə sözbəsöz işıqlanır.
- Xidmətlər: böyük serif indeks + kursoru izləyən "material" önizləmə kartı.
- İş prosesi: scroll zamanı üst-üstə yığılan (sticky) kartlar; iş masası kartlarında siçanı izləyən işıq; portfolio kartlarında 3D əyilmə.
- Konturlu kursiv marquee-lər, fəsil nömrələri (01), (02)…, kinematik CTA və nəhəng kursiv footer işarəsi.
- Başlıqda `*söz*` yazdıqda o söz qızılı kursiv olur (builder-də də işləyir).
- Əlçatanlıq: skip link, label/aria, fokus halqaları, `prefers-reduced-motion`; JS olmadan kontent görünür.

## Frontend

- `<html lang>` artıq dilə uyğundur (əvvəl hər dildə `az` idi).
- Xidmət detalları 4 dilə tərcümə olunub (əvvəl EN/RU/DE səhifələrdə Azərbaycan mətni çıxırdı).
- SEO: hər səhifə üçün düzgün canonical + `hreflang` (4 dil + x-default), OpenGraph, Builder SEO tabındakı başlıq/təsvir indi həqiqətən tətbiq olunur, sitemap-ə xidmət, portfolio və bloq səhifələri əlavə olunub.
- Saxta portfolio (picsum şəkilləri) və default sosial şəbəkə linkləri silinib — boş olan bölmələr gizlənir.

## Backend / təhlükəsizlik

- **Kritik:** bütün admin server action-ları (CRUD, tənzimləmələr, builder, şəkil yükləmə) əvvəl heç bir yoxlama olmadan service-role açarı ilə işləyirdi — istənilən şəxs bazanı silə bilərdi. İndi hər biri `requireStaff()` ilə rolu yoxlayır; fakturalar və tənzimləmələr yalnız admin/manager üçündür.
- **Kritik:** yeni qeydiyyatdan keçən hər hesab avtomatik `specialist` (staff) olurdu. İndi `client`.
- Analitika ID-ləri skriptə təmizlənmədən yazılırdı (XSS). İndi yalnız təhlükəsiz simvollar.
- Storage: anonim yükləmə/silmə bağlandı; SVG qadağandır, faylın həqiqətən şəkil olduğu yoxlanılır.
- Əlaqə formu: honeypot, bot vaxt yoxlaması, IP üzrə limit, uzunluq limitləri; DB xətaları istifadəçiyə göstərilmir. İstəyə görə Resend ilə email bildiriş (`RESEND_API_KEY`, `CONTACT_NOTIFY_EMAIL`).
- Middleware daxil olmayan istifadəçini admin səhifələrinə buraxmır; təhlükəsizlik header-ləri əlavə olunub.
- İstifadə olunmayan köhnə action faylları silinib, TypeScript build yoxlaması yenidən aktivdir.

## Admin panel

- Builder: hər hərfdən sonra inputun fokusu itirdiyi xəta düzəldildi; DE dili; yeni bloklar (iş masası, proses, bacarıqlar, prinsiplər, seçilmiş işlər); "Standarta qaytar"; Haqqımızda, Xidmətlər, Case-lər səhifələri də redaktə olunur. Başlıqda `*söz*` yazsanız, o söz narıncı vurğulanır.
- Kontent / Bloq: mətn, dil və üz qabığı şəkli sahələri — `published` yazılar saytda görünür.
- Cədvəllər: silmədən əvvəl təsdiq, mobil cihazda redaktə düymələri görünür.
- Yeni giriş ekranı və menyu (istifadəçi, rol, "Saytı aç").

## Hostinger

Node.js 20+ · `npm ci` · `npm run build` · `npm start`. Mühit dəyişənləri `.env.example`-dadır.
