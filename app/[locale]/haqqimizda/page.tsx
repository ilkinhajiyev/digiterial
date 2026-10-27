import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { PageHero, H2, CtaBand } from '@/components/dg/ui';
import { ProcessSection, StackSection } from '@/components/dg/home/sections';
import { Arrow } from '@/components/dg/icons';
import { alternates, localePath } from '@/lib/seo';
import { getT, OG_LOCALE } from '@/lib/i18n/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  const title = t('Haqqımızda — Bakıda kreativ və performans agentliyi');
  const description = t('2018-dən bəri Bakıda bizneslərə rəqəmsal kanallardan real müştəri və satış qazanmağa kömək edirik.');
  return {
    title, description, alternates: alternates('/haqqimizda', locale),
    openGraph: { title, description, url: localePath('/haqqimizda', locale), locale: OG_LOCALE[locale], type: 'website' },
  };
}

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = getT(locale);
  return (
    <>
      <PageHero crumbs={[{ href: '/', label: t('Ana səhifə') }, { label: t('Haqqımızda') }]}
        h1={<>{t('Strategiya, dizayn və texnologiya')} <em>{t('bir komandada.')}</em></>}
        lead={t('2018-dən bəri Bakıda bizneslərə rəqəmsal kanallardan real müştəri və satış qazanmağa kömək edirik.')}>
        <Link className="btn btn-accent" href="/elaqe">{t('Bizimlə işləyin')} <Arrow /></Link>
        <Link className="btn btn-ghost" href="/xidmetler">{t('Xidmətlər')}</Link>
      </PageHero>
      <section>
        <div className="wrap duo2">
          <div><div className="label">{t('Hekayəmiz')}</div><H2 className="mid" style={{ marginTop: 18 }}>{t('Kiçik komanda. Böyük məsuliyyət.')}</H2></div>
          <div className="article" style={{ maxWidth: 'none' }}>
            <p>{t('Digiterial strateq, dizayner, developer və marketoloqları bir masa arxasında birləşdirir. Siz bir neçə podratçı ilə deyil, bütün prosesə cavabdeh bir komanda ilə işləyirsiniz.')}</p>
            <p>{t('Hər layihəyə biznesin real hədəfindən başlayırıq: nəyi dəyişmək istəyirsiniz, kim üçün və bunu necə ölçəcəyik. Gözəl dizayn bu sualların cavabıdır, məqsədin özü deyil.')}</p>
          </div>
        </div>
      </section>
      <section>
        <div className="wrap duo2">
          <div><div className="label">{t('Yanaşmamız')}</div><H2 className="mid" style={{ marginTop: 18 }}>{t('Əvvəl biznesinizi anlayırıq, sonra dizayn edirik.')}</H2></div>
          <div className="article" style={{ maxWidth: 'none' }}>
            <p>{t('Hazır paket yox, hədəfinizə uyğun plan. Auditoriyanızı, rəqiblərinizi və satış yolunuzu təhlil edir, büdcəni ən çox nəticə verən kanallara yönəldirik.')}</p>
            <p>{t('Hər mərhələnin hədəfi və ölçü meyarı əvvəlcədən bəlli olur.')}</p>
          </div>
        </div>
      </section>
      <StackSection />
      <ProcessSection />
      <CtaBand title={t('Növbəti addımı birlikdə planlayaq.')} text={t('30 dəqiqəlik tanışlıq görüşündə hədəflərinizi dinləyək və ən sürətli böyümə yolunu birlikdə müəyyənləşdirək.')} />
    </>
  );
}
