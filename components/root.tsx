import type { Metadata, Viewport } from 'next';
import { Manrope, Unbounded, JetBrains_Mono } from 'next/font/google';
import { getSettings } from '@/lib/data/settings';

// Public marketing fonts (latin-ext + cyrillic for AZ/RU). Admin keeps its own CSS tokens.
const display = Unbounded({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  variable: '--font-display',
  display: 'swap',
});
const sans = Manrope({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
});
const mono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});
export const fontVars = `${display.variable} ${sans.variable} ${mono.variable}`;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [{ color: '#E8EEEC' }],
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
