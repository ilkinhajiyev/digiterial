import type { Metadata, Viewport } from 'next';
import { getSettings } from '@/lib/data/settings';

// Geist is self-hosted via @fontsource-variable/geist (latin, latin-ext, cyrillic).
export const fontVars = '';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [{ color: '#0A286E' }],
};

export async function baseMetadata(): Promise<Metadata> {
  const s = await getSettings().catch(() => null);
  const meta: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sochi.az'),
    applicationName: 'SOCHİ MMC',
    formatDetection: { telephone: false },
  };
  // Search Console / Yandex Webmaster təsdiq kodları
  const v: Record<string, string> = {};
  if (s?.analytics?.googleVerification) v.google = s.analytics.googleVerification;
  if (s?.analytics?.yandexVerification) v.yandex = s.analytics.yandexVerification;
  if (Object.keys(v).length) meta.verification = v;
  return meta;
}
