import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import SiteHeader from '@/components/site/header';
import WhatsApp from '@/components/site/whatsapp';
import SiteFooter from '@/components/site/footer';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children, params,
}: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      <div className="bg-ink text-white min-h-screen overflow-x-hidden">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <WhatsApp phone="994604996340" />
      </div>
    </NextIntlClientProvider>
  );
}
