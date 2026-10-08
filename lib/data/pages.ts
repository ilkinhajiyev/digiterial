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

export const dbBlocks = async (key: string, locale: string) => {
  const p = await getPage(key, locale);
  return p?.status === 'published' && Array.isArray(p.blocks) && p.blocks.length ? p.blocks : null;
};
