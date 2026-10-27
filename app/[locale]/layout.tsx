import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import Header, { type HeaderMenu } from '@/components/dg/header';
import Footer from '@/components/dg/footer';
import Motion from '@/components/dg/motion';
import Cursor from '@/components/dg/cursor';
import WhatsApp from '@/components/dg/whatsapp';
import Analytics, { GtmNoScript } from '@/components/site/analytics';
import { fontVars, baseMetadata } from '@/components/root';
import { getSettings, defaultSettings } from '@/lib/data/settings';
import { posts } from '@/lib/content/blog';
import { GROUPS, servicesByGroup } from '@/lib/content/services';
import { industries } from '@/lib/content/industries';
import { getT, localize, clientDict, OG_LOCALE } from '@/lib/i18n/server';
import '../globals.css';
import './dg.css';

export { viewport } from '@/components/root';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  return {
    ...(await baseMetadata()),
    title: { default: t('Digiterial — Bakıda kreativ və performans reklam agentliyi'), template: '%s | Digiterial' },
    openGraph: { siteName: 'Digiterial', locale: OG_LOCALE[locale], alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]) },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  setRequestLocale(locale);
  const t = getT(locale);
  const st = await getSettings().catch(() => defaultSettings);

  // Menyu məlumatı serverdə tərcümə olunub client header-ə ötürülür
  const menu: HeaderMenu = localize({
    groups: GROUPS.map((g) => ({ key: g.key, title: g.title, items: servicesByGroup(g.key).map((s) => ({ slug: s.slug, icon: s.icon, title: s.title, menuDesc: s.menuDesc, isNew: s.isNew })) })),
    industries: industries.map((i) => ({ slug: i.slug, icon: i.icon, title: i.title, short: i.short })),
  }, locale);
  const p = posts[0] && localize(posts[0], locale);

  return (
    <html lang={locale} className={fontVars} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={{ ui: clientDict(locale) }} locale={locale}>
          <Analytics a={st.analytics} />
          <GtmNoScript gtm={st.analytics?.gtm} />
          <a href="#main" className="skip">{t('Məzmuna keç')}</a>
          <Header brand={st.brand} logoUrl={st.logoUrl} phone={st.phone} email={st.email} menu={menu} latest={p && { slug: p.slug, title: p.title, category: p.category, date: p.date }} />
          <main id="main">{children}</main>
          <Footer st={st} locale={locale} />
          {st.whatsapp && <WhatsApp phone={st.whatsapp} />}
          <Motion locale={locale} />
          <Cursor />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
