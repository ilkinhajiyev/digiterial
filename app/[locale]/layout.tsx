import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import SiteHeader from '@/components/site/header';
import SiteFooter from '@/components/site/footer';
import WhatsApp from '@/components/site/whatsapp';
import Analytics, { GtmNoScript } from '@/components/site/analytics';
import { CursorGlow, PageTransition } from '@/components/site/interactive';
import { getSettings, defaultSettings } from '@/lib/data/settings';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [messages, settings] = await Promise.allSettled([
    getMessages(),
    getSettings(),
  ]);

  const msgs = messages.status === 'fulfilled' ? messages.value : {};
  const st   = settings.status  === 'fulfilled' ? settings.value  : defaultSettings;

  return (
    <NextIntlClientProvider messages={msgs}>
      {/* Analitika izləmə kodları */}
      <Analytics a={st.analytics} />
      <GtmNoScript gtm={st.analytics?.gtm} />

      <div className="bg-ink text-white min-h-screen overflow-x-hidden">
        <CursorGlow />
        <SiteHeader logoUrl={st.logoUrl} brand={st.brand} />
        <main><PageTransition>{children}</PageTransition></main>
        <SiteFooter />
        <WhatsApp phone={st.whatsapp || '994604996340'} />
      </div>
    </NextIntlClientProvider>
  );
}
