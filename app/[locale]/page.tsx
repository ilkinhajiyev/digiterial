import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Hero from '@/components/dg/home/hero';
import Bento from '@/components/dg/home/bento';
import GlobalStrip from '@/components/dg/home/global';
import Manifesto from '@/components/dg/home/manifesto';
import Quiz from '@/components/dg/home/quiz';
import { WorkSection, ProcessSection, StackSection, BlogSection, ContactSection } from '@/components/dg/home/sections';
import { FaqSection, SecHead } from '@/components/dg/ui';
import { FAQ, services } from '@/lib/content/services';
import { getWork, SHOTS } from '@/lib/data/portfolio';
import { Link } from '@/i18n/navigation';
import { getSettings, defaultSettings } from '@/lib/data/settings';
import { alternates, localePath } from '@/lib/seo';
import { getT, localize, OG_LOCALE } from '@/lib/i18n/server';

export const revalidate = 300;

// Müştəri loqoları (public/clients/<slug>.webp): [en, hündürlük]. Loqosu olmayan müştəri mətnlə göstərilir.
const CLIENT_LOGOS: Record<string, [number, number]> = {
  'xayal-travel': [357, 96], 'naftalan-life': [250, 96], 'griffin-education': [113, 96], eventorg: [420, 66],
  'ramoil-company-mmc': [220, 96], 'samir-photography': [330, 96], 'gelecege-korpu': [118, 96], zaurmarcom: [153, 96],
  olerni: [271, 96], 'gal-restaurant': [147, 96],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  const description = t('Kreativ və performans reklam agentliyi: veb sayt, SEO, Google və Meta reklamı, brendinq, SMM, email marketinq və korporativ email. Bakı.');
  const title = t('Digiterial — Bakıda kreativ və performans reklam agentliyi');
  return {
    title: { absolute: title },
    description,
    alternates: alternates('/', locale),
    openGraph: { title, description, url: localePath('/', locale), siteName: 'Digiterial', locale: OG_LOCALE[locale], type: 'website' },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = getT(locale);
  const [rawItems, st] = await Promise.all([getWork(locale).catch(() => []), getSettings().catch(() => defaultSettings)]);
  const items = localize(rawItems, locale);
  const svc = localize(services, locale);
  const faq = localize(FAQ, locale);
  const featured = items.filter((i) => i.featured).concat(items.filter((i) => !i.featured)).slice(0, 5);
  const ld = {
    '@context': 'https://schema.org', '@type': 'ProfessionalService', name: 'Digiterial', url: `https://digiterial.com${localePath('/', locale)}`,
    description: t('Kreativ və performans reklam agentliyi: veb sayt, SEO, Google və Meta reklamı, brendinq, SMM, email marketinq və korporativ email. Bakı.'),
    email: st.email, telephone: st.phone.replace(/\s/g, ''), priceRange: '₼₼',
    address: { '@type': 'PostalAddress', addressLocality: 'Baku', addressCountry: 'AZ' },
    areaServed: 'AZ', availableLanguage: ['az', 'en', 'ru', 'de'], sameAs: Object.values(st.social).filter(Boolean),
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '10:00', closes: '18:00' }],
    knowsAbout: svc.map((s) => s.title),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Hero serviceCount={svc.length} showcase={items.filter((w) => w.slug && SHOTS[w.slug]).slice(0, 5).map((w) => ({ slug: w.slug!, client: w.client || w.title, url: w.url, desktop: SHOTS[w.slug!]!.desktop }))} />
      <section className="logos ember-dark" aria-label={t('Müştərilər')}>
        <p className="sr-only">{t('Bizə etibar edən şirkətlər')}</p>
        <div className="logos-row">
          {[0, 1].map((k) => items.map((w) => (
            <Link key={`${k}-${w.id}`} href={`/isler/${w.slug || w.id}`} aria-hidden={k === 1 || undefined} tabIndex={k === 1 ? -1 : undefined} aria-label={w.client || w.title}>
              {w.slug && CLIENT_LOGOS[w.slug]
                ? <img src={`/clients/${w.slug}.webp`} alt={w.client || w.title} width={CLIENT_LOGOS[w.slug][0]} height={CLIENT_LOGOS[w.slug][1]} loading="lazy" decoding="async" />
                : (w.client || w.title)}
            </Link>
          )))}
        </div>
      </section>
      <section id="xidmetler">
        <div className="wrap">
          <div className="sec-head ek-head">
            <div><div className="ek-eyebrow">— {t('Xidmətlər')}</div><h2 className="display">{t('Böyümək üçün lazım olan')} <span>{t('hər şey.')}</span></h2></div>
            <p className="lead">{t('Ayrı-ayrı podratçılar arasında vaxt itirməyin. Strategiyadan icraya qədər bütün rəqəmsal kanallarınızı bir komanda idarə edir.')}</p>
          </div>
          <Bento />
        </div>
      </section>
      <Manifesto />
      <section id="test">
        <div className="wrap">
          <SecHead label={t('Niyə Digiterial')} title={t('Gözəl görünmək azdır. Sayt satmalıdır.')} lead={t('Hər qərarı dörd sualla yoxlayırıq. Öz saytınızı da indi yoxlayın: hansı suala “bəli” deyə bilirsiniz?')} />
          <Quiz />
        </div>
      </section>
      <WorkSection items={featured} />
      <ProcessSection />
      <StackSection />
      <BlogSection />
      <FaqSection items={[faq.time, faq.price, faq.one, faq.seo, faq.support]} />
      <GlobalStrip />
      <ContactSection st={st} />
    </>
  );
}
