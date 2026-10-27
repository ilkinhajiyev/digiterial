import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PageHero, CtaBand } from '@/components/dg/ui';
import { PostCard } from '@/components/dg/home/sections';
import { posts } from '@/lib/content/blog';
import { alternates, localePath } from '@/lib/seo';
import { getT, localize, OG_LOCALE } from '@/lib/i18n/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  const title = t('Bloq — SEO, reklam və veb dizayn məsləhətləri');
  const description = t('SEO, reklam, veb dizayn və konversiya haqqında sınaqdan keçmiş məsləhətlər: tətbiq edə biləcəyiniz addımlar.');
  return {
    title, description, alternates: alternates('/bloq', locale),
    openGraph: { title, description, url: localePath('/bloq', locale), locale: OG_LOCALE[locale], type: 'website' },
  };
}

export default async function Blog({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = getT(locale);
  return (
    <>
      <PageHero crumbs={[{ href: '/', label: t('Ana səhifə') }, { label: t('Bloq') }]} h1={<>{t('Rəqəmsal marketinq,')} <em>{t('praktik')}</em> {t('dildə.')}</>}
        lead={t('SEO, reklam, veb dizayn və konversiya haqqında sınaqdan keçmiş məsləhətlər: boş söz yox, tətbiq edə biləcəyiniz addımlar.')} />
      <section><div className="wrap"><div className="post-list">{localize(posts, locale).map((p) => <PostCard key={p.slug} p={p} />)}</div></div></section>
      <CtaBand title={t('Bu mövzularda köməyə ehtiyacınız var?')} text={t('Layihənizi bizimlə bölüşün, 24 saat ərzində cavab verək.')} />
    </>
  );
}
