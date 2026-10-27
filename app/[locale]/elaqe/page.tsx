import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/dg/ui';
import { ContactSection } from '@/components/dg/home/sections';
import { getSettings, defaultSettings } from '@/lib/data/settings';
import { alternates, localePath } from '@/lib/seo';
import { getT, OG_LOCALE } from '@/lib/i18n/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  const title = t('Əlaqə — layihənizi müzakirə edək');
  const description = t('Formu doldurun, 24 saat ərzində sizinlə əlaqə saxlayıb layihənizi ətraflı müzakirə edək.');
  return {
    title, description, alternates: alternates('/elaqe', locale),
    openGraph: { title, description, url: localePath('/elaqe', locale), locale: OG_LOCALE[locale], type: 'website' },
  };
}

export default async function Contact({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ xidmet?: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = getT(locale);
  const [{ xidmet }, st] = await Promise.all([searchParams, getSettings().catch(() => defaultSettings)]);
  const ld = { '@context': 'https://schema.org', '@type': 'ContactPage', name: t('Əlaqə — layihənizi müzakirə edək'), url: `https://digiterial.com${localePath('/elaqe', locale)}`, inLanguage: locale, mainEntity: { '@type': 'Organization', name: 'Digiterial', email: st.email, telephone: st.phone.replace(/\s/g, '') } };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PageHero crumbs={[{ href: '/', label: t('Ana səhifə') }, { label: t('Əlaqə') }]} h1={<>{t('Layihənizi')} <em>{t('danışaq.')}</em></>} lead={t('Formu doldurun, 24 saat ərzində sizinlə əlaqə saxlayıb layihənizi ətraflı müzakirə edək.')} />
      <ContactSection st={st} preset={xidmet} />
    </>
  );
}
