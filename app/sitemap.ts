import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/routing';
import { localePath } from '@/lib/seo';
import { publicSiteUrl } from '@/lib/catalog/origin';
import { publicProducts } from '@/lib/catalog/query';
import { readCatalog } from '@/lib/catalog/store';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = publicSiteUrl();
  const catalog = readCatalog();
  const paths = [
    '/',
    '/kataloq',
    '/xidmetler',
    '/about',
    '/contact',
    '/blog',
    '/sertifikatlar',
    ...catalog.categories.map((category) => `/kataloq/${category.id}`),
    ...publicProducts(catalog).map((product) => `/mehsul/${product.slug}`),
  ];
  return paths.map((path) => ({
    url: `${base}${localePath(path, 'az') === '/' ? '' : localePath(path, 'az')}`,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7,
    alternates: {
      languages: Object.fromEntries(locales.map((locale) => [locale, `${base}${localePath(path, locale) === '/' ? '' : localePath(path, locale)}`])),
    },
  }));
}
