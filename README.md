# Digiterial — sayt + admin panel

**Next.js 15 (App Router) · React 18 · next-intl · Supabase · Tailwind (admin)**

İctimai sayt (yeni dizayn, 4 dil: az/en/ru/de) və daxili idarəetmə paneli (`/admin`) bir kod bazasında.

## Lokal işə salma

```bash
npm install
cp .env.example .env.local   # Supabase açarlarını doldurun
npm run dev                  # http://localhost:3000
```

Supabase açarları olmadan ictimai sayt işləyir (portfolio üçün RAMOIL nümunəsi göstərilir, əlaqə forması xəta mesajı qaytarır). `/admin` üçün açarlar mütləqdir.

## Hostinger (Business veb hostinq, Node.js tətbiqi)

1. hPanel → **Websites → Add website → Node.js app** (və ya mövcud saytda Node.js tətbiqi).
2. Kodu GitHub-dan qoşun və ya bu qovluğun ZIP arxivini yükləyin (`node_modules` və `.next` olmadan).
3. Parametrlər:
   - **Node.js versiyası:** 22.x (Node 20 dəstəyi 2026-cı ilin aprelində bitib)
   - **Build əmri:** `npm run build`
   - **Start əmri:** `npm run start` (port Hostinger-in verdiyi `PORT` dəyişənindən avtomatik götürülür)
   - **Paket meneceri:** npm
4. **Mühit dəyişənləri** (Environment variables) bölməsinə `.env.example`-dakı dəyərləri yazın:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL=https://digiterial.com`
   (`NEXT_PUBLIC_*` dəyişənləri build zamanı koda yazılır — dəyişdikdən sonra yenidən build edin.)
5. Build bitdikdən sonra yoxlayın: `/`, `/xidmetler/seo`, `/en`, `/sitemap.xml`, `/admin/login`.

Şriftlər (`next/font`) build zamanı Google Fonts-dan yüklənir və saytın öz domenindən verilir; build serverinin internetə çıxışı olmalıdır (Hostinger-də var).

## Struktur

```
app/
  [locale]/            ictimai sayt (az default, /en, /ru, /de)
    dg.css             dizayn sistemi (rənglər, tipoqrafiya, animasiyalar)
    xidmetler/[slug]   8 xidmət səhifəsi
    bloq/[slug]        bloq yazıları
  admin/               idarəetmə paneli (Supabase, dinamik)
components/dg/         yeni dizayn komponentləri (header, mega menyu, 3D bayraqlar, vizuallar)
lib/content/           xidmətlər və bloq məzmunu (AZ)
lib/data/              Supabase: parametrlər, portfolio
lib/actions/contact.ts əlaqə forması → Supabase `leads` cədvəli
```

## Məzmunu dəyişmək

- Xidmətlər: `lib/content/services.ts`
- Bloq yazıları: `lib/content/blog.ts`
- Əlaqə məlumatları, sosial linklər, analitika kodları: admin → Settings (Supabase `site_settings`)
- Portfolio: admin → Portfolio

## Qeydlər

- Ictimai səhifələrin mətni hələlik yalnız azərbaycancadır; `/en`, `/ru`, `/de` ünvanları eyni AZ məzmunu göstərir. Tərcümə `lib/content` fayllarına əlavə olunmalıdır.
- Admin → Builder bölməsi əvvəlki blok-əsaslı ana səhifə üçün idi; yeni dizayn həmin blokları istifadə etmir.
