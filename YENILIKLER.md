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

## Dizayn (UI/UX)

- Yeni vizual dil "Studio Paper": isti kağız fonu, mürəkkəb qara, siqnal narıncı (#FF5A2C).
- Şriftlər self-hosted (Unbounded + Onest + JetBrains Mono) — Google Fonts sorğusu yoxdur, Azərbaycan (ə, ğ, ı), kiril və alman simvollarının hamısı dəstəklənir.
- Ana səhifə: yeni hero + saxta rəqəmsiz "bento" panel (iş prosesi, canlı Bakı saatı, əsas istiqamətlər); 3D səhnə çıxarılıb.
- Bütün bloklar yenidən dizayn olunub: xidmət kartları, iş masası, proses, bacarıqlar, prinsiplər, FAQ, CTA, footer.
- Header: aktiv səhifə göstəricisi, dil seçimi bayraqlar əvəzinə açılan siyahı, tam ekran mobil menyu (Esc ilə bağlanır).
- Əlaqə formu: telefon, büdcə, xidmət seçimi (chip-lər), aydın xəta mesajları, "Sonra nə olur?" bloku; xidmət səhifəsindən gələndə xidmət avtomatik seçilir.
- Yeni səhifələr/bölmələr: işlənmiş 404, Haqqımızda və Case-lər üçün real kontent, Bloq siyahısı və yazı səhifəsi.
- Əlçatanlıq: "məzmuna keç" linki, label-input əlaqəsi, fokus halqaları, `aria-*` atributları, `prefers-reduced-motion` dəstəyi; JS olmadan kontent görünür.

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
