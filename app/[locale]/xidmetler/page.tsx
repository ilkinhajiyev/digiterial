import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { PageHero, CtaBand, FaqSection } from '@/components/dg/ui';
import { ServicesSection, ProcessSection } from '@/components/dg/home/sections';
import { Arrow } from '@/components/dg/icons';
import { FAQ } from '@/lib/content/services';
import { alternates, localePath } from '@/lib/seo';
import { getT, localize, OG_LOCALE } from '@/lib/i18n/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  const title = t('Rəqəmsal marketinq xidmətləri — veb sayt, SEO, reklam, email');
  const description = t('Veb sayt hazırlanması, SEO, Google və Meta reklamı, brendinq, SMM, email marketinq, korporativ email və AI avtomatlaşdırma. Bir komanda, bir hədəf.');
  return {
    title, description, alternates: alternates('/xidmetler', locale),
    openGraph: { title, description, url: localePath('/xidmetler', locale), locale: OG_LOCALE[locale], type: 'website' },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = getT(locale);
  return (
    <>
      <PageHero crumbs={[{ href: '/', label: t('Ana səhifə') }, { label: t('Xidmətlər') }]}
        h1={<>{t('Biznesinizi böyüdən')} <em>{t('rəqəmsal')}</em> {t('xidmətlər.')}</>}
        lead={t('Ayrı-ayrı podratçılar arasında vaxt itirməyin. Strategiyadan icraya qədər bütün rəqəmsal kanallarınızı bir komanda idarə edir.')}>
        <Link className="btn btn-accent" href="/elaqe">{t('Layihəni müzakirə edək')} <Arrow /></Link>
      </PageHero>
      <ServicesSection />
      <ProcessSection />
      <FaqSection items={localize([FAQ.price, FAQ.one, FAQ.time, FAQ.seo], locale)} />
      <CtaBand title={t('Növbəti addımı birlikdə planlayaq.')} text={t('30 dəqiqəlik tanışlıq görüşündə hədəflərinizi dinləyək və ən sürətli böyümə yolunu birlikdə müəyyənləşdirək.')} />
    </>
  );
}
