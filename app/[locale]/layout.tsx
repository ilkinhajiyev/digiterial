import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/routing';
import { fontVars } from '@/components/root';
import { Header } from '@/components/catalog/header';
import { Footer } from '@/components/catalog/footer';
import { readCatalog } from '@/lib/catalog/store';
import { pick, isLocale } from '@/lib/catalog/types';
import { publicSiteUrl } from '@/lib/catalog/origin';
import '@fontsource-variable/geist/wght.css';
import '../globals.css';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL(publicSiteUrl()),
    title: { default: 'SOCHİ MMC', template: '%s | SOCHİ MMC' },
    description: 'Dam, fasad və təməl üçün izolyasiya materialları.',
    applicationName: 'SOCHİ MMC',
    openGraph: { siteName: 'SOCHİ MMC', locale: locale === 'ru' ? 'ru_RU' : locale === 'en' ? 'en_US' : 'az_AZ' },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || !locales.includes(locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const catalog = readCatalog();
  const loc = locale as Locale;
  return (
    <html lang={locale} className={fontVars}>
      <body className="bg-[#F6F7F9] text-[#1C1F24]">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:bg-white focus:px-3 focus:py-2">
            {locale === 'en' ? 'Skip to content' : locale === 'ru' ? 'К содержанию' : 'Məzmuna keç'}
          </a>
          <Header
            phone={catalog.settings.phoneDisplay}
            orderLabel={messages.nav && typeof messages.nav === 'object' && 'order' in messages.nav ? String((messages.nav as { order: string }).order) : 'Sifariş siyahısı'}
            categories={catalog.categories.map((category) => ({
              id: category.id,
              name: pick(category.name, loc),
              subs: category.subs.map((sub) => ({ id: sub.id, name: pick(sub.name, loc) })),
            }))}
          />
          <main id="main" className="mx-auto min-h-[70vh] max-w-6xl px-4 py-8">
            {children}
          </main>
          <Footer settings={catalog.settings} locale={loc} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
