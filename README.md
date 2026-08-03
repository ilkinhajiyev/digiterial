# Digiterial — Agency OS (Stack B)
**Next.js 15 (App Router) + Supabase + Tailwind + next-intl**

İctimai sayt (SEO-optimallaşdırılmış, 3 dil) + daxili idarəetmə paneli (auth, CRUD, builder) — bir kod bazasında.

---

## Tez başlanğıc

```bash
# 1) asılılıqlar
npm install

# 2) env
cp .env.example .env.local
#   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY doldur

# 3) verilənlər bazası (Supabase CLI)
npx supabase link --project-ref <ref>
npx supabase db push           # supabase/migrations/0001_init.sql tətbiq olunur
#   (istəyə görə) supabase/seed.sql-i Studio SQL-də işə sal

# 4) admin istifadəçi
#   Supabase Studio → Authentication → Add user (email+şifrə)

# 5) işə sal
npm run dev      # http://localhost:3000  · admin: /admin
```

> **Qeyd:** İctimai sayt Supabase olmadan da işləyir (default kontent). Admin /admin üçün Supabase env tələb olunur.

---

## Struktur

```
app/
  [locale]/        # sayt (az default, /en, /ru) — SEO, i18n
  admin/
    login/         # giriş
    (protected)/   # auth qorumalı: dashboard, crm, clients, projects, invoices, builder
  sitemap.ts robots.ts
components/ site · admin · builder · ui
lib/ supabase · actions · data · validations
i18n/ routing · request · navigation
messages/ az · en · ru
supabase/migrations/0001_init.sql   # tam sxema + RLS + trigger
```

---

## Nə hazırdır (Sprint 0–3 nüvəsi)

- ✅ **Sayt**: 7 səhifə (blok-əsaslı render), qara+sarı editorial dizayn (Tailwind), mobil hamburger menyu
- ✅ **i18n**: next-intl (az/en/ru), hreflang, lokalizə naviqasiya
- ✅ **SEO**: per-page metadata, canonical, OG, **sitemap.ts**, **robots.ts**, JSON-LD (Organization, ContactPage)
- ✅ **Əlaqə forması** → `leads` cədvəlinə yazır (server action + service client)
- ✅ **Auth**: Supabase email/şifrə, qorumalı `/admin`, login/logout
- ✅ **Admin**: Dashboard (canlı KPI), **Müştərilər (tam CRUD)**, **CRM/Lead (siyahı + əlavə)**, Layihələr & Fakturalar (oxu)
- ✅ **Builder**: səhifə bloklarını + SEO-nu **Supabase-ə yazır**, `revalidatePath` ilə saytı yeniləyir
- ✅ **DB**: tam migrasiya — bütün cədvəllər, enum-lar, **RLS (rol əsaslı)**, trigger-lər

## TODO (sonrakı sprintlər — plana uyğun)

- ⬜ Builder-in **vizual (klik-redaktə)** versiyası (HTML prototip → React komponentlərə köçürmə)
- ⬜ Tasks (kanban), Content/Bloq CMS, Tickets, Domains modulları
- ⬜ İnteqrasiyalar: **GA4 + Search Console** (SEO/Statistika real data), Google/Meta Ads sync (cron), **Stripe** (fakturalar), **Resend** (email)
- ⬜ Client portal (rol=client RLS), avtomatik PDF hesabatlar
- ⬜ Test (Vitest/Playwright), Sentry, CI/CD

---

## Texnologiyalar
Next.js 15 · React 18 · TypeScript · Tailwind · Supabase (Postgres+Auth+RLS) · next-intl · Recharts · zod

© 2026 Digiterial
