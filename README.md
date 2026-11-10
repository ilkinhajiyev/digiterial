# SOCHİ MMC — izolyasiya materialları kataloqu

Mobil-öncəli kataloq. Məhsul seçilir, variant və miqdar yazılır, hazır WhatsApp sorğusu açılır. Ödəniş, məcburi qeydiyyat və avtomatik sifariş təsdiqi yoxdur.

Bu repozitoriyadakı əvvəlki agentlik saytının ictimai səhifələri bu kataloqla əvəz olunub. Canlı `sochi.az` domeninə bu iş çərçivəsində deploy edilmir.

## Texnologiya

Next.js 15 (App Router), TypeScript, Tailwind CSS, next-intl (AZ default, EN, RU).

## Məlumat anbarı

Kataloqun mənbəyi bir JSON faylıdır: `data/catalog.json`. Şəkillər `public/media/` altındadır. Admin yükləmələri `public/media/uploads/` (və ya `CATALOG_DATA_DIR/media`) qovluğuna yazılır və `/uploads/[fayl]` ilə verilir.

Hostinger Node.js tətbiqində fayl sistemi deploy zamanı silinə bilər. Davamlı saxlama üçün `CATALOG_DATA_DIR`-i deploy qovluğundan kənar bir qovluğa yönəldin. İlk işə salınanda orada `catalog.json` yoxdursa, repodakı nüsxə kopyalanır. Əlavə verilənlər bazası tələb olunmur; yazma müvəqqəti fayl və `rename` ilə gedir.

Supabase paketləri əvvəlki layihədən qalıb və bu kataloq onlardan istifadə etmir.

## Lokal işə salma

```bash
npm install
npm run dev
```

- Sayt: http://localhost:3000
- Admin (yalnız `next dev`): http://localhost:3000/admin/login
- Lokal istifadəçi: `admin` / `sochi-dev-admin` (və ya `ADMIN_DEV_PASSWORD`). Bu istifadəçi diskə yazılmır.
- Production admin: `ADMIN_PASSWORD='...' node scripts/create-admin.mjs <username>` və `ADMIN_SESSION_SECRET` (ən azı 16 simvol).

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

`NEXT_PUBLIC_SITE_URL` kanonik ünvan üçündür (default `https://sochi.az`).

## Köhnə ünvanlar

Saxlanılanlar: `/`, `/about`, `/contact`, `/blog`.

301:

| Köhnə | Yeni |
| --- | --- |
| `/istilikvesesizolyasiyasi` | `/kataloq/istilik-ses` |
| `/berkizolyasixps` və `/berkizolyasiyaxps` | `/kataloq/xps` |
| `/suizolyasiyasi` | `/kataloq/bitum-rulon` |
| `/mayeizolyasiyaveaksesuarlar` | `/kataloq/maye-aksesuar` |
| `/services01`, `/services02` | `/xidmetler` |
| `/sertifkat` | `/sertifikatlar` |
| `/appeal` | `/contact` |
| `/mehsullar` | `/kataloq` |

## Dərcdən əvvəl təsdiq

Bunlar mənbə saytda qiymət, stok, artikul və ya ayrıca PDF kimi yoxdur. Kataloqda naməlum vəziyyət göstərilir:

- WhatsApp nömrəsi `+994 50 204 20 31` saytda görünür, amma `whatsappConfirmed` false-dur. Təsdiqləmədən dərc etməyin.
- Bütün qiymətlər naməlumdur.
- Bütün stok naməlumdur.
- Artikul (SKU) heç bir məhsulda təsdiqlənməyib. Saytdakı rəqəm kodlar gömrük/dərc kodu kimi ayrıca sətirdədir, artikul deyil.
- Texniki PDF yoxdur. Sertifikatlar yalnız sochi.az-dəki şəkillərdir.
- Küçə ünvanı yoxdur (şəhər: Bakı).
- Lövhə məhsullarının satış vahidi (plitə, paket və ya m²) mənbədə açıq deyil.
- Zəmanət müddəti və laboratoriya göstəriciləri (lambda, sıxlıq və s.) uydurulmayıb.
- 301 siyahısını canlı DNS-dən əvvəl bir daha yoxlayın.
