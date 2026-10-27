import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { services, getService } from '@/lib/content/services';
import { PageHero, SecHead, Cards, Deliverables, Steps, FaqSection, OtherServices, CtaBand } from '@/components/dg/ui';
import { Arrow } from '@/components/dg/icons';
import { EXTRAS } from '@/components/dg/service/extras';
import { WebVisual, SeoVisual, AdsVisual, BrandVisual, SmmVisual, AiVisual, CorpVisual, EmailVisual } from '@/components/dg/service/visuals';
import { alternates, localePath } from '@/lib/seo';
import { getT, localize, OG_LOCALE } from '@/lib/i18n/server';

const VISUALS: Record<string, () => React.ReactNode> = {
  'veb-saytlar': WebVisual, seo: SeoVisual, reklam: AdsVisual, brendinq: BrandVisual, smm: SmmVisual,
  'ai-avtomatlasdirma': AiVisual, 'korporativ-email': CorpVisual, 'email-marketinq': EmailVisual,
};

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const raw = getService(slug);
  if (!raw) return {};
  const s = localize(raw, locale);
  const path = `/xidmetler/${slug}`;
  return {
    title: s.metaTitle, description: s.metaDesc,
    alternates: alternates(path, locale),
    openGraph: { title: s.metaTitle, description: s.metaDesc, url: localePath(path, locale), locale: OG_LOCALE[locale], type: 'website' },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = getT(locale);
  const raw = getService(slug);
  if (!raw) notFound();
  const s = localize(raw, locale);
  const Visual = VISUALS[slug];
  const Extra = EXTRAS[slug];
  const ld = { '@context': 'https://schema.org', '@type': 'Service', name: s.title, description: s.metaDesc, url: `https://digiterial.com${localePath(`/xidmetler/${slug}`, locale)}`, inLanguage: locale, areaServed: 'AZ', provider: { '@type': 'ProfessionalService', name: 'Digiterial', url: `https://digiterial.com${localePath('/', locale)}` } };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PageHero
        crumbs={[{ href: '/', label: t('Ana səhifə') }, { href: '/xidmetler', label: t('Xidmətlər') }, { label: s.title }]}
        h1={<>{s.h1[0]}<em>{s.h1[1]}</em>{s.h1[2]}</>}
        lead={s.lead}
        visual={Visual ? <Visual /> : undefined}>
        <Link className="btn btn-accent" href="/elaqe">{s.cta} <Arrow /></Link>
        <a className="btn btn-ghost" href="#daxil">{t('Nə daxildir?')}</a>
      </PageHero>
      {Extra && <Extra />}
      <section id="daxil">
        <div className="wrap">
          <SecHead label={t('Nə daxildir')} title={t('Xidmətə daxil olanlar.')} lead={s.about} />
          <Cards items={s.includes} four />
        </div>
      </section>
      <Deliverables items={s.deliverables} />
      <section>
        <div className="wrap">
          <SecHead label={t('Necə işləyirik')} title={t('4 addımda nəticə.')} lead={t('Hər mərhələnin sonunda nə əldə etdiyinizi bilirsiniz. Gizli xərc və qeyri-müəyyən müddət yoxdur.')} />
          <Steps steps={s.steps} />
        </div>
      </section>
      <FaqSection items={s.faq} title={t('Tez-tez soruşulanlar')} label={t('Suallar')} />
      <OtherServices current={s.slug} />
      <CtaBand title={s.ctaH} text={s.ctaP} />
    </>
  );
}
