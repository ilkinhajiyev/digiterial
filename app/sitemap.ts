import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/routing';
import { services } from '@/lib/content/services';
import { posts } from '@/lib/content/blog';
import { industries } from '@/lib/content/industries';
import { fallbackPortfolio } from '@/lib/data/portfolio';
import { localePath } from '@/lib/seo';

const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://digiterial.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths: [string, number][] = [
    ['/', 1], ['/xidmetler', 0.9], ['/saheler', 0.8], ['/isler', 0.8], ['/case-studies', 0.7], ['/haqqimizda', 0.7], ['/bloq', 0.8], ['/elaqe', 0.8], ['/faq', 0.6], ['/lugat', 0.6], ['/emekdasliq', 0.6],
    ...industries.map((i) => [`/saheler/${i.slug}`, 0.8] as [string, number]),
    ...fallbackPortfolio.map((w) => [`/isler/${w.slug}`, 0.6] as [string, number]),
    ...services.map((s) => [`/xidmetler/${s.slug}`, 0.9] as [string, number]),
    ...posts.map((p) => [`/bloq/${p.slug}`, 0.6] as [string, number]),
  ];
  return paths.map(([p, priority]) => ({
    url: `${base}${localePath(p, 'az') === '/' ? '' : localePath(p, 'az')}`,
    changeFrequency: 'weekly',
    priority,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${base}${localePath(p, l) === '/' ? '' : localePath(p, l)}`])) },
  }));
}
