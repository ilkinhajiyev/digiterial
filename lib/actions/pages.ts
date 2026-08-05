'use server';
import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/service';
import { preparePageBlocks } from '@/lib/data/page-content';
import { requireAdmin } from '@/lib/security/admin';
import { z } from 'zod';

const allowedKeys = ['home', 'services', 'work', 'about', 'blog', 'contact', 'case-studies'] as const;
const allowedLocales = ['az', 'en', 'ru', 'de'] as const;
const allowedBlocks = new Set(['hero', 'band', 'services', 'workbench', 'selectedWork', 'process', 'legacy', 'toolkit', 'principles', 'stats', 'cards', 'testimonials', 'faq', 'cta', 'marquee', 'clients', 'contact', 'richtext']);

function validBlocks(value: unknown): value is any[] {
  if (!Array.isArray(value) || value.length > 40) return false;
  return value.every(block => block && typeof block === 'object' && allowedBlocks.has(block.type) && block.props && typeof block.props === 'object' && JSON.stringify(block).length <= 50_000);
}

export async function savePage(
  key: string,
  locale: string,
  blocks: any[],
  seo: { seo_title?: string; slug?: string; meta_desc?: string }
) {
  try {
    await requireAdmin();
    const keyResult = z.enum(allowedKeys).safeParse(key);
    const localeResult = z.enum(allowedLocales).safeParse(locale);
    const seoResult = z.object({ seo_title: z.string().trim().max(70).optional(), slug: z.string().trim().max(120).regex(/^\/[a-z0-9\-\/]*$/i).optional(), meta_desc: z.string().trim().max(200).optional() }).safeParse(seo);
    if (!keyResult.success || !localeResult.success || !seoResult.success || !validBlocks(blocks)) return { ok: false, error: 'Səhifə məlumatları düzgün formatda deyil.' };
    const sb = createServiceClient();
    const { error } = await sb.from('pages').upsert(
      { key, locale, blocks: preparePageBlocks(blocks), ...seoResult.data, status: 'published', updated_at: new Date().toISOString() },
      { onConflict: 'key,locale' }
    );
    if (error) return { ok: false, error: 'Səhifə saxlanmadı.' };
    revalidatePath('/');
    revalidatePath(`/${locale}`);
    const cleanSlug = (seoResult.data.slug || '').replace(/^\/+|\/+$/g, '');
    const publicPath = [locale === 'az' ? '' : locale, cleanSlug].filter(Boolean).join('/');
    revalidatePath(`/${publicPath}`);
    return { ok: true };
  } catch (ex: any) {
    return { ok: false, error: ex?.message === 'UNAUTHORIZED' || ex?.message === 'FORBIDDEN' ? 'Bu əməliyyat üçün icazəniz yoxdur.' : 'Səhifə saxlanmadı.' };
  }
}

export async function getPageData(key: string, locale: string) {
  try {
    await requireAdmin();
    const sb = createServiceClient();
    const { data } = await sb.from('pages').select('*').eq('key', key).eq('locale', locale).maybeSingle();
    return data;
  } catch { return null; }
}
