# Sayt tərcüməsi (AZ → EN / RU / DE)

Mənbə dil azərbaycancadır. Hər mətn **özü açardır**: `t('Xidmətlər')` → `lib/i18n/dict/<dil>.json`-da `"Xidmətlər": "Services"`.
Lüğətdə olmayan mətn azərbaycanca göstərilir. Lüğətlər `scripts/i18n-extract.mjs` ilə çıxarılan mətnlərdən tərcümə olunur.

## Komponentdə istifadə

| Harada | Necə |
|---|---|
| `'use client'` fayl | `import { useT } from '@/lib/i18n/client'` → komponentin əvvəlində `const t = useT();` |
| Sinxron server komponenti | `import { useServerT, useLocalize } from '@/lib/i18n/server'` → `const t = useServerT();` |
| `async` səhifə / `generateMetadata` | `import { getT, localize, OG_LOCALE } from '@/lib/i18n/server'` → `const t = getT(locale);` |

- Görünən hər azərbaycanca mətni `t()` ilə bükün: JSX mətni, `alt`, `aria-label`, `title`, `placeholder`, metadata, JSON-LD adları.
- Modul səviyyəsində sabitlər (massivlər, obyektlər) olduğu kimi qalır; render zamanı `t(item.h)` kimi bükün. Açar mətnin eyni olması kifayətdir.
- Dəyişən hissə: `t('Addım {n}', { n: i + 1 })`. Mətni heç vaxt `+` və ya şablon sətri ilə yığıb `t()`-yə verməyin.
- `lib/content/*` (services, posts, industries, glossary, FAQ, GROUPS) və `fallbackPortfolio`/`getWork` nəticələri: `localize(data, locale)` (async) və ya `const L = useLocalize(); L(data)` (sinxron). `slug`, `icon`, `url`, `date` kimi texniki açarlara toxunulmur.
- Client komponentə məzmun lazımdırsa, serverdə `localize` edib prop kimi ötürün.
- Linklər (`href`) və slug-lar dəyişmir: bütün dillərdə eyni yol, `/en`, `/ru`, `/de` prefiksi ilə.
- Tarix: `formatDate(date, locale)`.

## SEO
- `alternates(path, locale)` canonical + hreflang verir; `openGraph.locale: OG_LOCALE[locale]`.
- JSON-LD-də `inLanguage: locale`, URL-lər `localePath(path, locale)` ilə.
