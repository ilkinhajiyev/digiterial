'use server';
import { revalidatePath } from 'next/cache';
import { createClient as sbServer } from '@/lib/supabase/server';
export async function savePage(key: string, locale: string, blocks: any[], seo: { seo_title?: string; slug?: string; meta_desc?: string }) {
  const sb = await sbServer();
  const { error } = await sb.from('pages').upsert(
    { key, locale, blocks, ...seo, status: 'published', updated_at: new Date().toISOString() },
    { onConflict: 'key,locale' }
  );
  revalidatePath('/');
  return { ok: !error, error: error?.message };
}
