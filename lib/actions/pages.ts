'use server';
import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/service';
import { preparePageBlocks } from '@/lib/data/page-content';

export async function savePage(
  key: string,
  locale: string,
  blocks: any[],
  seo: { seo_title?: string; slug?: string; meta_desc?: string }
) {
  try {
    const sb = createServiceClient();
    const { error } = await sb.from('pages').upsert(
      { key, locale, blocks: preparePageBlocks(blocks), ...seo, status: 'published', updated_at: new Date().toISOString() },
      { onConflict: 'key,locale' }
    );
    if (error) return { ok: false, error: error.message };
    revalidatePath('/');
    revalidatePath(`/${locale}`);
    const cleanSlug = (seo.slug || '').replace(/^\/+|\/+$/g, '');
    const publicPath = [locale === 'az' ? '' : locale, cleanSlug].filter(Boolean).join('/');
    revalidatePath(`/${publicPath}`);
    return { ok: true };
  } catch (ex: any) {
    return { ok: false, error: ex?.message };
  }
}

export async function getPageData(key: string, locale: string) {
  try {
    const sb = createServiceClient();
    const { data } = await sb.from('pages').select('*').eq('key', key).eq('locale', locale).maybeSingle();
    return data;
  } catch { return null; }
}
