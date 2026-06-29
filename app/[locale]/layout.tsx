import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import SiteHeader from '@/components/site/header';
import SiteFooter from '@/components/site/footer';
import WhatsApp from '@/components/site/whatsapp';
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

  // Paralel yüklə — biri uğursuz olsa digəri gözləmir
  const [messages, settings] = await Promise.allSettled([
    getMessages(),
    getSettings(),
  ]);

  const msgs = messages.status === 'fulfilled' ? messages.value : {};
  const st   = settings.status  === 'fulfilled' ? settings.value  : defaultSettings;

  return (
    <NextIntlClientProvider messages={msgs}>
      <div className="bg-ink text-white min-h-screen overflow-x-hidden">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <WhatsApp phone={st.whatsapp || '994604996340'} />
      </div>
    </NextIntlClientProvider>
  );
}
