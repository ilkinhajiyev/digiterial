import type { Metadata } from 'next';
import { locales, defaultLocale } from '@/i18n/routing';
import { getPage } from '@/lib/data/pages';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://digiterial.com').replace(/\/$/, '');

/** Lokalizə olunmuş yol: az → /xidmetler, en → /en/xidmetler */
export function localePath(locale: string, path: string) {
  const p = path === '/' ? '' : path;
  return locale === defaultLocale ? (p || '/') : `/${locale}${p}`;
}

const OG_LOCALE: Record<string, string> = { az: 'az_AZ', en: 'en_US', ru: 'ru_RU', de: 'de_DE' };

export function buildMetadata(opts: {
  locale: string; path: string; title: string; description?: string; image?: string; absoluteTitle?: boolean; type?: 'website' | 'article';
}): Metadata {
  const { locale, path, image } = opts;
  const title = opts.title.replace(/\*/g, '');
  const description = opts.description?.replace(/\*/g, '');
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = localePath(l, path);
  languages['x-default'] = localePath(defaultLocale, path);
  const images = image ? [{ url: image }] : [{ url: '/og-kinetic.png', width: 1200, height: 630, alt: 'Digiterial' }];
  return {
    title: opts.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: localePath(locale, path), languages },
    openGraph: { type: opts.type || 'website', locale: OG_LOCALE[locale], url: localePath(locale, path), title, description, siteName: 'Digiterial', images },
    twitter: { card: 'summary_large_image', title, description, images: images.map((i) => i.url) },
  };
}

/** Builder-dəki SEO tabında yazılmış başlıq/təsvir varsa, onları üstün tutur. */
export async function pageMetadata(key: string, locale: string, path: string, fallback: { title: string; description?: string; absoluteTitle?: boolean }) {
  const page = await getPage(key, locale);
  return buildMetadata({
    locale, path,
    title: page?.seo_title || fallback.title,
    description: page?.meta_desc || fallback.description,
    absoluteTitle: page?.seo_title ? true : fallback.absoluteTitle,
  });
}
