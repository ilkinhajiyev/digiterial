import { cache } from 'react';
import { createServiceClient } from '@/lib/supabase/service';
export type PItem = { id: string; title: string; category: 'web' | 'smm'; slug?: string; client?: string; description?: string; body?: string; url?: string; image_url?: string; gallery?: string[]; tags?: string; metric?: string; featured?: boolean; position?: number; locale?: string };


export const getPortfolio = cache(async function getPortfolio(locale?: string): Promise<PItem[]> {
  try {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!key || !url) return [];
    const sb = createServiceClient();
    let q = sb.from('portfolio_items').select('*');
    if (locale) q = q.eq('locale', locale);
    const { data, error } = await q
      .order('position', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) { console.error('[portfolio] DB xəta:', error.message); return []; }
    return (data as any) || [];
  } catch (e: any) { console.error('[portfolio] exception:', e?.message); return []; }
});

export const getPortfolioItem = cache(async function getPortfolioItem(key: string): Promise<PItem | null> {
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const sb = createServiceClient();
      const bySlug = await sb.from('portfolio_items').select('*').eq('slug', key).maybeSingle();
      if (bySlug.data) return bySlug.data as any;
      const byId = /^[0-9a-f-]{36}$/i.test(key) ? await sb.from('portfolio_items').select('*').eq('id', key).maybeSingle() : { data: null };
      if (byId.data) return byId.data as any;
    }
  } catch { /* DB yoxdursa fallback */ }
  return null;
});

/** Yalnız həmin dildə əlavə edilmiş layihələr (dillər qarışmasın deyə başqa dilə keçid edilmir). */
export async function getPortfolioFor(locale: string) {
  return getPortfolio(locale);
}
