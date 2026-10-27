import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PageHero, FaqSection, CtaBand } from '@/components/dg/ui';
import { FAQ, services } from '@/lib/content/services';
import { alternates, localePath } from '@/lib/seo';
import { getT, localize, OG_LOCALE } from '@/lib/i18n/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  const title = t('Tez-tez verilən suallar — müddət, qiymət, SEO, reklam');
  const description = t('Veb sayt hazırlanmasının müddəti, qiymətin necə formalaşdığı, SEO nəticələri, reklam büdcəsi və korporativ email haqqında cavablar.');
  return {
    title, description, alternates: alternates('/faq', locale),
    openGraph: { title, description, url: localePath('/faq', locale), locale: OG_LOCALE[locale], type: 'website' },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = getT(locale);
  const faq = localize(FAQ, locale);
  const svc = localize(services, locale);
  const general = [faq.time, faq.price, faq.one, faq.seo, faq.support];
  const seen = new Set(general.map((f) => f.q));
  return (
    <>
      <PageHero crumbs={[{ href: '/', label: t('Ana səhifə') }, { label: t('Suallar') }]} h1={<>{t('Tez-tez verilən')} <em>{t('suallar.')}</em></>}
        lead={t('Cavabını burada tapmadığınız sual varsa, yazın: 24 saat ərzində cavab veririk.')} />
      <FaqSection items={general} title={t('Ümumi')} label={t('Əməkdaşlıq')} />
      {svc.map((s) => {
        const items = s.faq.filter((f) => !seen.has(f.q));
        items.forEach((f) => seen.add(f.q));
        return items.length ? <FaqSection key={s.slug} items={items} title={s.title} label={t('Xidmət')} /> : null;
      })}
      <CtaBand title={t('Sualınız qaldı?')} text={t('Bizə yazın və ya zəng edin. Layihənizə uyğun cavabı birlikdə tapaq.')} />
    </>
  );
}
