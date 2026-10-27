import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { PageHero, SecHead, CtaBand } from '@/components/dg/ui';
import { WorkGrid } from '@/components/dg/work';
import { Arrow } from '@/components/dg/icons';
import { getWork } from '@/lib/data/portfolio';
import { alternates, localePath } from '@/lib/seo';
import { getT, localize, OG_LOCALE } from '@/lib/i18n/server';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  const title = t('Portfolio — veb sayt və SMM layihələri');
  const description = t('Veb sayt, e-ticarət və SMM layihələrimizdən seçmələr: məqsəd, həll və nəticə.');
  return {
    title, description, alternates: alternates('/isler', locale),
    openGraph: { title, description, url: localePath('/isler', locale), locale: OG_LOCALE[locale], type: 'website' },
  };
}

export default async function Work({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = getT(locale);
  const items = localize(await getWork(locale), locale);
  const web = items.filter((i) => i.category !== 'smm');
  const smm = items.filter((i) => i.category === 'smm');
  return (
    <>
      <PageHero crumbs={[{ href: '/', label: t('Ana səhifə') }, { label: t('İşlər') }]} h1={<>{t('Sözlə yox,')} <em>{t('nəticə')}</em> {t('ilə.')}</>}
        lead={t('Veb sayt, e-ticarət və SMM layihələrimizdən seçmələr. Hər birində məqsədi, həlli və nəticəni görəcəksiniz.')}>
        <Link className="btn btn-accent" href="/elaqe">{t('Layihəni müzakirə edək')} <Arrow /></Link>
      </PageHero>
      {web.length > 0 && <section><div className="wrap"><SecHead label={t('Veb saytlar · {n}', { n: web.length })} title={t('Veb sayt və e-ticarət')} /><WorkGrid items={web} /></div></section>}
      {smm.length > 0 && <section><div className="wrap"><SecHead label={`SMM · ${smm.length}`} title={t('Sosial media layihələri')} /><WorkGrid items={smm} /></div></section>}
      <CtaBand title={t('Növbəti uğur hekayəsi sizin olsun.')} text={t('Hədəfinizi bizimlə bölüşün. Saytınızın və reklamlarınızın real potensialını birlikdə üzə çıxaraq.')} />
    </>
  );
}
