import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { PageHero, SecHead, CtaBand } from '@/components/dg/ui';
import { ProcessSection } from '@/components/dg/home/sections';
import { WorkGrid } from '@/components/dg/work';
import { Arrow } from '@/components/dg/icons';
import { getWork } from '@/lib/data/portfolio';
import { alternates, localePath } from '@/lib/seo';
import { getT, localize, OG_LOCALE } from '@/lib/i18n/server';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  const title = t('Case study — real layihələr və nəticələr');
  const description = t('Layihələrimizin pərdəarxası: müştəri hansı problemlə gəldi, biz nə etdik və hansı nəticəni əldə etdik.');
  return {
    title, description, alternates: alternates('/case-studies', locale),
    openGraph: { title, description, url: localePath('/case-studies', locale), locale: OG_LOCALE[locale], type: 'website' },
  };
}

export default async function Cases({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = getT(locale);
  const items = localize(await getWork(locale), locale);
  return (
    <>
      <PageHero crumbs={[{ href: '/', label: t('Ana səhifə') }, { label: t('Case study') }]} h1={<>{t('Problem, həll,')} <em>{t('nəticə.')}</em></>}
        lead={t('Layihələrimizin pərdəarxası: müştəri hansı problemlə gəldi, biz nə etdik və hansı nəticəni əldə etdik.')}>
        <Link className="btn btn-accent" href="/elaqe">{t('Əlaqə')} <Arrow /></Link>
        <Link className="btn btn-ghost" href="/xidmetler">{t('Xidmətlər')}</Link>
      </PageHero>
      <section><div className="wrap"><SecHead label={t('Seçilmiş işlər')} title={t('Nəticə ilə danışan layihələr.')} /><WorkGrid items={items} /></div></section>
      <ProcessSection />
      <CtaBand title={t('Növbəti addımı birlikdə planlayaq.')} text={t('30 dəqiqəlik tanışlıq görüşündə hədəflərinizi dinləyək və ən sürətli böyümə yolunu birlikdə müəyyənləşdirək.')} />
    </>
  );
}
