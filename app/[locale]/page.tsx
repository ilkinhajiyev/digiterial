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
      <GlobalStrip />
      <section className="logos" aria-label={t('Müştərilər')}>
        <div className="wrap">
          <p>{t('Bizə etibar edən şirkətlər')}</p>
          <div className="logos-row">{items.map((w) => <Link key={w.id} href={`/isler/${w.slug || w.id}`}>{w.client || w.title}</Link>)}</div>
        </div>
      </section>
      <Manifesto />
      <section id="xidmetler">
        <div className="wrap">
          <SecHead label={t('Xidmətlər')} title={t('Böyümək üçün lazım olan hər şey.')} lead={t('Ayrı-ayrı podratçılar arasında vaxt itirməyin. Strategiyadan icraya qədər bütün rəqəmsal kanallarınızı bir komanda idarə edir.')} />
          <Bento />
        </div>
      </section>
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
      <ContactSection st={st} />
    </>
  );
}
