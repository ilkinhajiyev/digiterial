import type { MetadataRoute } from 'next';
const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://digiterial.com';
const paths = ['', '/xidmetler', '/isler', '/case-studies', '/haqqimizda', '/bloq', '/elaqe'];
export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((p) => [
    { url: `${base}${p}`, changeFrequency: 'weekly', priority: p === '' ? 1 : 0.8 },
    { url: `${base}/en${p}`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/ru${p}`, changeFrequency: 'weekly', priority: 0.6 },
  ]);
}
