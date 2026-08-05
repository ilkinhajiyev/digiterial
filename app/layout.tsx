import type { Metadata } from 'next';
import './globals.css';
import { getSettings } from '@/lib/data/settings';

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings().catch(() => null);
  const meta: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://digiterial.com'),
    title: { default: 'Digiterial', template: '%s | Digiterial' },
    description: 'Strategiya, dizayn, veb və marketinqi vahid sistemdə birləşdirən rəqəmsal agentlik.',
    openGraph: {
      type: 'website',
      siteName: 'Digiterial',
      title: 'Digiterial — Biznesiniz üçün işləyən rəqəmsal sistemlər',
      description: 'Veb, marketinq və brendi eyni biznes məqsədinə işləyən vahid sistem kimi qururuq.',
      images: [{ url: '/og-kinetic.png', width: 1200, height: 630, alt: 'Digiterial — Bakı rəqəmsal agentliyi' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Digiterial — Biznesiniz üçün işləyən rəqəmsal sistemlər',
      description: 'Veb, marketinq və brendi eyni biznes məqsədinə işləyən vahid sistem kimi qururuq.',
      images: ['/og-kinetic.png'],
    },
  };
  // Search Console / Yandex Webmaster təsdiq kodları
  const v: any = {};
  if (s?.analytics?.googleVerification) v.google = s.analytics.googleVerification;
  if (s?.analytics?.yandexVerification) v.yandex = s.analytics.yandexVerification;
  if (Object.keys(v).length) meta.verification = v;
  return meta;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
