import type { Metadata } from 'next';
import { alternates, localePath } from '@/lib/seo';
import { publicSiteUrl } from '@/lib/catalog/origin';

const OG: Record<string, string> = { az: 'az_AZ', en: 'en_US', ru: 'ru_RU' };

export function pageMeta(locale: string, path: string, title: string, description: string): Metadata {
  const url = `${publicSiteUrl()}${localePath(path, locale) === '/' ? '' : localePath(path, locale)}`;
  return {
    title,
    description,
    alternates: alternates(path, locale),
    openGraph: {
      title,
      description,
      url,
      siteName: 'SOCHİ MMC',
      locale: OG[locale] || 'az_AZ',
      type: 'website',
      images: [{ url: '/media/brand/sochi-logo.png', alt: 'SOCHİ MMC' }],
    },
  };
}
