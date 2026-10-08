'use server';
import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/service';
import { requireStaff } from '@/lib/auth/guard';
import { locales } from '@/i18n/routing';
import { PAGE_KEYS, BLOCK_TYPES } from '@/lib/data/page-registry';

export async function savePage(
  key: string,
  locale: string,
  blocks: any[],
  seo: { seo_title?: string; slug?: string; meta_desc?: string }
) {
  try {
    await requireStaff();
    if (!PAGE_KEYS.some((p) => p.key === key)) return { ok: false, error: 'Naməlum səhifə' };
    if (!(locales as readonly string[]).includes(locale)) return { ok: false, error: 'Naməlum dil' };
    if (!Array.isArray(blocks) || blocks.length > 60) return { ok: false, error: 'Blok siyahısı yanlışdır' };
    const clean = blocks
      .filter((b) => b && typeof b === 'object' && (BLOCK_TYPES as readonly string[]).includes(b.type))
      .map((b) => ({ type: b.type, props: b.props && typeof b.props === 'object' ? b.props : {} }));
    if (JSON.stringify(clean).length > 200_000) return { ok: false, error: 'Kontent çox böyükdür' };

    const { error } = await createServiceClient().from('pages').upsert(
      {
        key, locale, blocks: clean,
        seo_title: String(seo?.seo_title || '').slice(0, 120),
        slug: String(seo?.slug || PAGE_KEYS.find((p) => p.key === key)!.slug).slice(0, 120),
        meta_desc: String(seo?.meta_desc || '').slice(0, 320),
        status: 'published', updated_at: new Date().toISOString(),
      },
      { onConflict: 'key,locale' }
    );
    if (error) return { ok: false, error: error.message };
    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (ex: any) {
    return { ok: false, error: ex?.message };
  }
}

/** Səhifəni DB-dən silir — sayt yenidən tərcümə fayllarındakı standart kontentə qayıdır. */
export async function resetPage(key: string, locale: string) {
  try {
    await requireStaff();
    const { error } = await createServiceClient().from('pages').delete().eq('key', key).eq('locale', locale);
    if (error) return { ok: false, error: error.message };
    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (ex: any) {
    return { ok: false, error: ex?.message };
  }
}
