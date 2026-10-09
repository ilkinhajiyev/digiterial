import { cache } from 'react';
import { createServiceClient } from '@/lib/supabase/service';

const hasDb = () => !!(process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL);

/** Builder-də saxlanılmış səhifə (yoxdursa null). Bir sorğu ərzində keşlənir. */
export const getPage = cache(async (key: string, locale: string) => {
  if (!hasDb()) return null;
  try {
    const { data } = await createServiceClient()
      .from('pages').select('key,locale,seo_title,meta_desc,blocks,status')
      .eq('key', key).eq('locale', locale).maybeSingle();
    return data as null | { key: string; locale: string; seo_title?: string; meta_desc?: string; blocks?: any[]; status?: string };
  } catch {
    return null;
  }
});

/** Azərbaycan dilinə xas hərflər — başqa dildə saxlanılmış AZ mətnini aşkarlamaq üçün. */
const AZ_ONLY = /[əƏ]/;
export const wrongLanguage = (locale: string, value: unknown) =>
  locale !== 'az' && AZ_ONLY.test(typeof value === 'string' ? value : JSON.stringify(value ?? ''));

/**
 * Builder-də saxlanılmış bloklar. Etibarsız hallarda null qaytarır və sayt
 * tərcümə fayllarındakı standart kontentə qayıdır:
 *  – EN/RU/DE səhifəsində Azərbaycan mətni saxlanılıbsa (köhnə builder hər dilə AZ mətni yazırdı);
 *  – ana səhifə köhnə dizaynın blokları ilə saxlanılıbsa (slayderli hero yoxdursa).
 */
export const dbBlocks = async (key: string, locale: string) => {
  const p = await getPage(key, locale);
  if (p?.status !== 'published' || !Array.isArray(p.blocks) || !p.blocks.length) return null;
  if (wrongLanguage(locale, p.blocks)) { console.warn(`[pages] ${key}/${locale}: AZ mətni aşkarlandı, standart kontent göstərilir`); return null; }
  if (key === 'home') {
    const hero = p.blocks[0];
    if (hero?.type !== 'hero' || !hero?.props?.showAside) { console.warn('[pages] home: köhnə blok strukturu, standart kontent göstərilir'); return null; }
  }
  return p.blocks;
};
