import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { PageHero, SecHead, CtaBand } from '@/components/dg/ui';
import { Arrow, Ic } from '@/components/dg/icons';
import { industries } from '@/lib/content/industries';
import { alternates, localePath } from '@/lib/seo';
import { getT, localize, OG_LOCALE } from '@/lib/i18n/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  const title = t('Sahələr — sahənizə uyğun rəqəmsal marketinq');
  const description = t('Restoranlar, e-ticarət, klinikalar, təhsil, daşınmaz əmlak və turizm üçün sahəyə uyğun sayt, SEO və reklam həlləri.');
  return {
    title, description, alternates: alternates('/saheler', locale),
    openGraph: { title, description, url: localePath('/saheler', locale), locale: OG_LOCALE[locale], type: 'website' },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = getT(locale);
  const list = localize(industries, locale);
  return (
    <>
      <PageHero crumbs={[{ href: '/', label: t('Ana səhifə') }, { label: t('Sahələr') }]} h1={<>{t('Sahənizi')} <em>{t('anlayan')}</em> {t('agentlik.')}</>}
        lead={t('Hər sahənin öz müştəri yolu, axtarış vərdişləri və qaydaları var. Ümumi şablon yox, sahənizə uyğun qurulmuş sayt, SEO və reklam.')}>
        <Link className="btn btn-accent" href="/elaqe">{t('Layihəni müzakirə et')} <Arrow /></Link>
      </PageHero>
      <section>
        <div className="wrap">
          <SecHead label={t('Sahələr')} title={t('Hansı sahədə işləyirsiniz?')} lead={t('Sahənizi seçin: tipik problemləri, həll yollarını və yoxlama siyahısını görəcəksiniz.')} />
          <div className="ind-grid">
            {list.map((i) => (
              <Link key={i.slug} className="ind-card" href={`/saheler/${i.slug}`}>
                <Ic name={i.icon} />
                <h3>{i.title}</h3>
                <p>{i.short}</p>
                <span className="more">{t('Ətraflı')} <Arrow /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand title={t('Sahəniz siyahıda yoxdur?')} text={t('Fərqi yoxdur. Biznesinizin müştəri yolunu təhlil edib ona uyğun plan qururuq.')} />
    </>
  );
}
