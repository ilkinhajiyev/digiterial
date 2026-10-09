import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import SiteHeader from '@/components/site/header';
import SiteFooter from '@/components/site/footer';
import WhatsApp from '@/components/site/whatsapp';
import Analytics, { GtmNoScript } from '@/components/site/analytics';
import { getSettings } from '@/lib/data/settings';
import { SITE_URL } from '@/lib/seo';
import { safeId } from '@/lib/utils';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: '#050506', width: 'device-width', initialScale: 1 };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const s = await getSettings();
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  const verification: Metadata['verification'] = {};
  if (s.analytics?.googleVerification) verification.google = safeId(s.analytics.googleVerification, 100);
  if (s.analytics?.yandexVerification) verification.yandex = safeId(s.analytics.yandexVerification, 100);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t('title'), template: `%s | ${s.brand}` },
    description: t('desc'),
    applicationName: s.brand,
    formatDetection: { telephone: false },
    icons: { icon: '/icon.svg' },
    verification,
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();
  setRequestLocale(locale);
  const [messages, st] = await Promise.all([getMessages(), getSettings()]);
  const waMsg = { az: 'Salam! Layihəm haqqında danışmaq istəyirəm.', en: 'Hi! I would like to talk about my project.', ru: 'Здравствуйте! Хочу обсудить проект.', de: 'Hallo! Ich möchte über mein Projekt sprechen.' }[locale];

  return (
    <html lang={locale} id="top">
      <head>
        {/* JS varsa scroll animasiyaları aktivləşir; yoxdursa kontent dərhal görünür */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <GtmNoScript gtm={st.analytics?.gtm} />
        <NextIntlClientProvider messages={messages}>
          <SiteHeader logoUrl={st.logoUrl} brand={st.brand} email={st.email} phone={st.phone} />
          <main id="main">{children}</main>
          <SiteFooter st={st} />
          <WhatsApp phone={st.whatsapp} message={waMsg} />
        </NextIntlClientProvider>
        <Analytics a={st.analytics} />
      </body>
    </html>
  );
}
