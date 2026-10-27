import { createServiceClient } from '@/lib/supabase/service';
export type PItem = { id: string; title: string; category: 'web' | 'smm'; slug?: string; client?: string; description?: string; body?: string; url?: string; image_url?: string; gallery?: string[]; tags?: string; metric?: string; featured?: boolean; position?: number; locale?: string };

// Supabase qoşulmayanda göstərilən real layihə(lər). Uydurma layihə əlavə etməyin.
// Real ekran görüntüləri: public/work/ (Playwright ilə canlı saytlardan çəkilib)
export const SHOTS: Record<string, { desktop: string; mobile?: string; full?: string }> = {
  'ramoil-company-mmc': { desktop: '/work/ramoil-desktop.webp', mobile: '/work/ramoil-mobile.webp', full: '/work/ramoil-full.webp' },
  'xayal-travel': { desktop: '/work/xayal-travel-desktop.webp', mobile: '/work/xayal-travel-mobile.webp', full: '/work/xayal-travel-full.webp' },
  'naftalan-life': { desktop: '/work/naftalanlife-desktop.webp', mobile: '/work/naftalanlife-mobile.webp', full: '/work/naftalanlife-full.webp' },
  'griffin-education': { desktop: '/work/griffin-desktop.webp', mobile: '/work/griffin-mobile.webp', full: '/work/griffin-full.webp' },
  'eventorg': { desktop: '/work/eventorg-desktop.webp', mobile: '/work/eventorg-mobile.webp', full: '/work/eventorg-full.webp' },
  'fconsults': { desktop: '/work/fconsults-desktop.webp', mobile: '/work/fconsults-mobile.webp', full: '/work/fconsults-full.webp' },
  'samir-photography': { desktop: '/work/samirphoto-desktop.webp', mobile: '/work/samirphoto-mobile.webp', full: '/work/samirphoto-full.webp' },
  'gelecege-korpu': { desktop: '/work/bfngo-desktop.webp', full: '/work/bfngo-full.webp' },
  'zaurmarcom': { desktop: '/work/zaurmarcom-desktop.webp', mobile: '/work/zaurmarcom-mobile.webp', full: '/work/zaurmarcom-full.webp' },
};

// Kodda saxlanan real layihələr. Supabase-dəki layihələrlə birləşdirilir (eyni slug varsa DB üstündür).
// Təsvirlər saytların öz məzmunundan götürülüb; nəticə rəqəmi yazmayın, yalnız təsdiqlənmiş fakt.
export type LocalItem = PItem & { industry?: string; year?: number };
export const fallbackPortfolio: LocalItem[] = [
  { id: 'xayal', slug: 'xayal-travel', title: 'Xayal Travel üçün səyahət platforması', category: 'web', client: 'Xayal Travel', url: 'https://xayal.travel/az', year: 2026, industry: 'turizm-ve-otel', featured: true,
    description: 'Premium turlar, otellər, viza dəstəyi və istiqamətlər üzrə axtarış imkanı olan çoxdilli səyahət veb-tətbiqi.',
    body: 'Xayal Travel üçün turları, otelləri, viza xidmətlərini və istiqamətləri bir yerdə təqdim edən veb-tətbiq hazırladıq.\nAna səhifədə istiqamət slayderi və istiqamət, tarix və turist sayına görə axtarış forması var. Sayt bir neçə dildə işləyir.',
    tags: 'Veb tətbiq, Turizm, Çoxdilli' },
  { id: 'naftalan', slug: 'naftalan-life', title: 'Naftalan Life sanatoriya müqayisə və rezervasiya platforması', category: 'web', client: 'Naftalan Life', url: 'https://naftalanlife.com/az', industry: 'turizm-ve-otel', featured: true,
    description: 'Naftalan sanatoriyalarının otaqlarını, müalicə paketlərini və qiymətlərini müqayisə edib birbaşa müraciət göndərmək üçün platforma.',
    body: 'Naftalan Life ziyarətçiyə sanatoriyaları bir yerdə müqayisə etməyə imkan verir: otaqlar, müalicə paketləri, xidmətlər və qiymətlər.\nAxtarış forması tarix, qonaq sayı və müalicə növünə görə filtrləyir. Müraciət WhatsApp və Telegram ilə birbaşa göndərilir.',
    tags: 'Veb platforma, Rezervasiya, Çoxdilli' },
  { id: 'griffin', slug: 'griffin-education', title: 'Griffin Education Center üçün təhsil mərkəzi saytı', category: 'web', client: 'Griffin Education Center', url: 'https://griffin.az/', year: 2026, industry: 'tehsil', featured: true,
    description: 'ACCA, CFA və PMP təlimləri, ingilis dili kursları və xaricdə təhsil xidmətləri üçün korporativ sayt.',
    body: 'Griffin Education Center üçün kursları aydın təqdim edən sayt qurduq: peşəkar təlimlər (ACCA, CFA, PMP), ingilis dili və imtahan hazırlığı (SAT, IELTS, DUOLINGO), xaricdə təhsil.\nHər istiqamətin ayrıca bölməsi və WhatsApp ilə sürətli əlaqə düyməsi var.',
    tags: 'Veb sayt, Təhsil' },
  { id: 'eventorg', slug: 'eventorg', title: 'EventOrg.az beynəlxalq mübadilə proqramları platforması', category: 'web', client: 'EventOrg.az', url: 'https://eventorg.az/', year: 2026, industry: 'tehsil', featured: true,
    description: 'Xaricdə workcamp, iş düşərgələri, J-1, Au Pair, kurslar və Erasmus+ proqramlarını təqdim edən platforma.',
    body: 'EventOrg.az gənclərə xaricdəki mübadilə proqramlarını tapmağa kömək edir: workcamp, iş düşərgələri, J-1, Au Pair, kurslar və Erasmus+.\nProqramlar kateqoriyalara bölünüb, hər proqramın ayrıca səhifəsi və müraciət imkanı var. Sayt AZ və EN dillərindədir.',
    tags: 'Veb platforma, Təhsil, Çoxdilli' },
  { id: 'ramoil', slug: 'ramoil-company-mmc', title: 'RAMOIL COMPANY MMC üçün korporativ veb-sayt', category: 'web', client: 'RAMOIL COMPANY MMC', url: 'https://ramoil.az',
    description: 'Enerji şirkəti üçün çoxdilli korporativ veb-sayt: xidmətlər, qalereya, sertifikatlar və xəbərlər.',
    tags: 'Veb sayt, Korporativ, Çoxdilli', image_url: '/work/ramoil-desktop.webp' },
  { id: 'fconsults', slug: 'fconsults', title: 'Fconsults üçün korporativ sayt', category: 'web', client: 'Fconsults', url: 'https://fconsults.az/', year: 2025, industry: 'dasinmaz-emlak',
    description: 'Daşınmaz əmlak bazarının təhlilinə əsaslanan qiymətləndirmə xidmətləri təqdim edən şirkət üçün korporativ sayt.',
    tags: 'Veb sayt, Korporativ, Daşınmaz əmlak' },
  { id: 'samir', slug: 'samir-photography', title: 'Samir Photography üçün portfolio saytı', category: 'web', client: 'Samir Photography', url: 'https://samirphoto.com/', year: 2026,
    description: 'Fotoqraf üçün xidmətləri və işləri təqdim edən çoxdilli portfolio saytı.',
    tags: 'Veb sayt, Portfolio, Çoxdilli' },
  { id: 'bfngo', slug: 'gelecege-korpu', title: 'Gələcəyə Körpü İB üçün sayt', category: 'web', client: 'Gələcəyə Körpü İB', url: 'https://bfngo.az/', year: 2026,
    description: 'Gənclər təşkilatı üçün sayt: beynəlxalq imkanlar, xəbərlər, elanlar və onlayn resurslar.',
    tags: 'Veb sayt, QHT' },
  { id: 'zaurmarcom', slug: 'zaurmarcom', title: 'zaurmarcom.com şəxsi bloq saytı', category: 'web', client: 'zaurmarcom.com', url: 'https://zaurmarcom.com/', year: 2026,
    description: 'Müəllif yazıları və bloq üçün şəxsi sayt.',
    tags: 'Veb sayt, Bloq' },
];

export async function getWork(locale?: string): Promise<LocalItem[]> {
  let db: PItem[] = await getPortfolio(locale);
  if (!db.length) db = await getPortfolio();
  const slugs = new Set(db.map((d) => d.slug || d.id));
  return [...db, ...fallbackPortfolio.filter((l) => !slugs.has(l.slug!))];
}

export async function getPortfolio(locale?: string): Promise<PItem[]> {
  try {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!key || !url) { console.warn('[portfolio] env yoxdur'); return []; }
    const sb = createServiceClient();
    let q = sb.from('portfolio_items').select('*');
    if (locale) q = q.eq('locale', locale);
    const { data, error } = await q
      .order('position', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) { console.error('[portfolio] DB xəta:', error.message); return []; }
    return (data as any) || [];
  } catch (e: any) { console.error('[portfolio] exception:', e?.message); return []; }
}

export async function getPortfolioItem(key: string): Promise<PItem | null> {
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const sb = createServiceClient();
      const bySlug = await sb.from('portfolio_items').select('*').eq('slug', key).maybeSingle();
      if (bySlug.data) return bySlug.data as any;
      const byId = await sb.from('portfolio_items').select('*').eq('id', key).maybeSingle();
      if (byId.data) return byId.data as any;
    }
  } catch { /* DB yoxdursa fallback */ }
  return fallbackPortfolio.find((p) => p.slug === key || p.id === key) || null;
}
