import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { getSettings } from '@/lib/data/settings';

// Sayt ([locale]) və admin ayrı kök layout-lardır: hər biri <html lang> dəyərini özü təyin edir.
// Şriftlər build zamanı yüklənir və saytın öz domenindən verilir (Google-a sorğu getmir).
// Geist Azərbaycan hərflərini (ə, ğ, ı, ş, ç, ö, ü) və kiril əlifbasını dəstəkləyir.
const sans = Geist({ subsets: ['latin', 'latin-ext', 'cyrillic'], variable: '--font-sans', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin', 'latin-ext', 'cyrillic'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });
export const fontVars = `${sans.variable} ${mono.variable}`;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [{ color: '#0F282F' }],
};

export async function baseMetadata(): Promise<Metadata> {
  const s = await getSettings().catch(() => null);
  const meta: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://digiterial.com'),
    applicationName: 'Digiterial',
    formatDetection: { telephone: false },
  };
  // Search Console / Yandex Webmaster təsdiq kodları
  const v: Record<string, string> = {};
  if (s?.analytics?.googleVerification) v.google = s.analytics.googleVerification;
  if (s?.analytics?.yandexVerification) v.yandex = s.analytics.yandexVerification;
  if (Object.keys(v).length) meta.verification = v;
  return meta;
}
