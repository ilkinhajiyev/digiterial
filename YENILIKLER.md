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

## Dizayn (UI/UX) — "Swiss Precision"

- Açıq kağız fon, mürəkkəb qara mətn və kobalt mavi vurğu (#3341FF); 12 sütunlu grid xətləri, ciddi və oxunaqlı kompozisiya.
- Tipoqrafiya: Inter Tight (başlıqlar və mətn) + JetBrains Mono (etiketlər). Self-hosted; Ə/ə, kiril və alman simvolları dəstəklənir.
- Hero: **interaktiv "Signal Field"** — kursora reaksiya verən nöqtə matrisi və tədricən çəkilən böyümə xətti (Trafik → Müraciət → Satış). Canvas 2D, kitabxanasız, ekrandan çıxanda dayanır, "azaldılmış hərəkət" rejimində statik.
- Konversiya elementləri: "Yeni layihələr qəbul edirik" statusu, hər ekranda "Pulsuz audit" CTA-sı, hero-da 3 güvən nöqtəsi, əlaqə səhifəsində "Sonra nə olur?" bloku.
- Xidmət kartları (hover-da kobalt), "Niyə Digiterial" 4 sütunu, tünd fonda 4 addımlı proses xətti, texnologiya şəbəkəsi, FAQ akkordeonu, kobalt CTA paneli, tünd footer.
- Daxili səhifələrdə görünən breadcrumb (Ana səhifə › Xidmətlər › …).
- Mobil üçün ayrıca tənzimlənmiş ölçülər; tam ekran mobil menyu.

## Kopirayt və SEO

- Bütün mətnlər premium, nəticə yönümlü tonda yenidən yazılıb: aydın dəyər təklifi, konkret faydalar, hərəkətə çağıran CTA-lar ("Pulsuz audit alın").
- 4 dildə (AZ, EN, RU, DE) peşəkar lokalizasiya — hərfi tərcümə yox, hər dilin axtarış ifadələrinə uyğun: "veb sayt hazırlanması", "website development", "разработка сайтов", "Webentwicklung" və s.
- Hər səhifə və hər xidmət üçün ayrıca SEO başlığı (≤ 60 simvol) və meta təsvir (≤ 160 simvol).
- Schema.org: ProfessionalService (iş saatları, xidmət sahələri), Service + OfferCatalog, FAQPage (FAQ bölmələri), BreadcrumbList.
- Yoxlanılmamış rəqəmlər ("+312% trafik", "3.2x ROAS" kimi) mətnlərdən çıxarılıb; yerinə öhdəlik və standartlar yazılıb ("90+ PageSpeed hədəfi", "Aylıq şəffaf hesabat"). Real nəticələr portfolio-da layihə üzrə göstərilə bilər.
- FAQ-da göstərilən müddətlər (sayt 2–12 həftə, SEO 3–6 ay) "adətən" kimi ifadə olunub — öz təcrübənizə görə builder-dən dəyişə bilərsiniz.

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
