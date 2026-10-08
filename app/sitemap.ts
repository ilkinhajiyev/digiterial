import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/routing';
import { SITE_URL, localePath } from '@/lib/seo';
import { services } from '@/lib/data/services';
import { getPortfolio } from '@/lib/data/portfolio';
import { createServiceClient } from '@/lib/supabase/service';

export const revalidate = 3600;

const STATIC = ['/', '/xidmetler', '/isler', '/case-studies', '/haqqimizda', '/bloq', '/elaqe'];

function entry(path: string, priority: number, lastModified?: string | Date): MetadataRoute.Sitemap[number] {
  const languages = Object.fromEntries(locales.map((l) => [l, `${SITE_URL}${localePath(l, path)}`]));
  return { url: `${SITE_URL}${localePath('az', path)}`, lastModified, changeFrequency: 'weekly', priority, alternates: { languages } };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const out: MetadataRoute.Sitemap = [
    ...STATIC.map((p) => entry(p, p === '/' ? 1 : 0.8)),
    ...services.map((s) => entry(`/xidmetler/${s.slug}`, 0.7)),
  ];
  const work = await getPortfolio();
  for (const w of work) {
    const path = `/isler/${w.slug || w.id}`;
    out.push({ url: `${SITE_URL}${localePath(w.locale || 'az', path)}`, changeFrequency: 'monthly', priority: 0.6 });
  }
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { data } = await createServiceClient().from('content_posts').select('slug,locale,published_at').eq('status', 'published');
      for (const p of data || []) out.push({ url: `${SITE_URL}${localePath(p.locale || 'az', `/bloq/${p.slug}`)}`, lastModified: p.published_at || undefined, changeFrequency: 'monthly', priority: 0.6 });
    } catch { /* DB əlçatan deyilsə statik xəritə kifayətdir */ }
  }
  return out;
}
