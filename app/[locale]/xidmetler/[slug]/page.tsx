import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import PageHeader from '@/components/site/page-header';
import { ServiceIcon } from '@/components/site/service-icons';
import { BlockRenderer } from '@/components/site/blocks';
import { Reveal } from '@/components/site/interactive';
import { JsonLd } from '@/components/site/jsonld';
import { services, getService } from '@/lib/data/services';
import { buildMetadata, SITE_URL, localePath } from '@/lib/seo';
import { locales } from '@/i18n/routing';

export function generateStaticParams() { return locales.flatMap((locale) => services.map((s) => ({ locale, slug: s.slug }))); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params; if (!getService(slug)) return {};
  const t = await getTranslations({ locale, namespace: 'svc' });
  return buildMetadata({ locale, path: `/xidmetler/${slug}`, title: t(`${slug}.metaTitle`), description: t(`${slug}.metaDesc`) });
}

export default async function ServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params; setRequestLocale(locale);
  const s = getService(slug); if (!s) notFound();
  const t = await getTranslations('svc'); const sd = await getTranslations('svcDetail'); const c = await getTranslations('common'); const h = await getTranslations('home'); const n = await getTranslations('nav');
  const title = t(`${slug}.title`);
  const features = [1, 2, 3, 4].map((i) => ({ h: t(`${slug}.f${i}h`), p: t(`${slug}.f${i}p`) }));
  const deliverables = [1, 2, 3, 4, 5].map((i) => t(`${slug}.d${i}`));
  const steps = [1, 2, 3, 4].map((i) => ({ h: sd(`s${i}h`), p: sd(`s${i}p`) }));
  const contactHref = `/elaqe?service=${encodeURIComponent(title)}`;
  const ld = {
    '@context': 'https://schema.org', '@type': 'Service', name: title, description: t(`${slug}.metaDesc`), serviceType: title,
    url: `${SITE_URL}${localePath(locale, `/xidmetler/${slug}`)}`, areaServed: { '@type': 'Country', name: 'Azerbaijan' },
    provider: { '@type': 'ProfessionalService', name: 'Digiterial', url: SITE_URL },
    hasOfferCatalog: { '@type': 'OfferCatalog', name: title, itemListElement: features.map((f) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: f.h, description: f.p } })) },
  };
  return (
    <>
      <JsonLd data={ld} />
      <PageHeader locale={locale} crumbs={[{ href: '/xidmetler', label: n('services') }]} eyebrow={t(`${slug}.tag`)} title={title} lead={t(`${slug}.short`)}>
        <div className="flex flex-wrap items-center gap-3">
          <Link href={contactHref} className="btn-accent">{c('freeConsult')} <ArrowRight size={18} className="arr" /></Link>
          <span className="chip h-[52px] px-5 text-[.9rem] font-medium text-fg"><span className="h-2 w-2 rounded-full bg-brand" />{t(`${slug}.metric`)}</span>
        </div>
      </PageHeader>

      <Reveal as="section" className="section"><div className="wrap grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand text-onbrand"><ServiceIcon slug={slug} className="h-7 w-7" /></span>
          <div className="eyebrow mt-6">{sd('overview')}</div>
        </div>
        <div className="space-y-6 md:col-span-8">
          <p className="text-[clamp(1.4rem,2.4vw,2rem)] font-semibold leading-[1.2] tracking-[-.03em]">{t(`${slug}.o1`)}</p>
          <p className="t-lead max-w-[60ch]">{t(`${slug}.o2`)}</p>
        </div>
      </div></Reveal>

      <Reveal as="section" className="section bg-surface"><div className="wrap">
        <div className="eyebrow">{sd('included')}</div>
        <h2 className="t-h2 mt-5">{sd('includedHead')}</h2>
        <div className="mt-12 grid overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--line)] sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 1 }}>
          {features.map((f, i) => (
            <div key={i} className="flex min-h-[220px] flex-col justify-between bg-bg p-7">
              <span className="text-[2.4rem] font-semibold leading-none tracking-[-.06em] text-brand">{String(i + 1).padStart(2, '0')}</span>
              <div><h3 className="t-h3">{f.h}</h3><p className="t-small mt-2">{f.p}</p></div>
            </div>
          ))}
        </div>
      </div></Reveal>

      <BlockRenderer blocks={[{ type: 'process', props: { label: sd('process'), heading: sd('processHead'), items: steps } }]} />

      <Reveal as="section" className="section"><div className="wrap grid gap-5 lg:grid-cols-2">
        <div className="card p-8 md:p-10">
          <div className="eyebrow">{sd('deliverables')}</div>
          <ul className="mt-6 divide-y divide-[color:var(--line)]">
            {deliverables.map((d, i) => (
              <li key={i} className="flex items-center gap-4 py-4 text-[1.02rem] font-medium"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-soft text-brand"><Check size={13} strokeWidth={3} /></span>{d}</li>
            ))}
          </ul>
        </div>
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-brand p-8 text-onbrand md:p-10">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(3,20,12,.35)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:linear-gradient(to_top_left,#000,transparent_70%)]" />
          <h3 className="relative text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-[1.05] tracking-[-.04em]">{title} — {sd('ctaTail')}</h3>
          <div className="relative mt-10">
            <p className="mb-6 text-onbrand/75">{sd('ctaP')}</p>
            <Link href={contactHref} className="btn-dark">{sd('start')} <ArrowRight size={18} className="arr" /></Link>
          </div>
        </div>
      </div></Reveal>

      <section className="pb-6"><div className="wrap">
        <div className="eyebrow mb-6">{sd('other')}</div>
        <div className="flex flex-wrap gap-2">
          {services.filter((x) => x.slug !== slug).map((x) => (
            <Link key={x.slug} href={`/xidmetler/${x.slug}`} className="chip px-4 py-2.5 text-[.92rem] font-medium transition hover:border-brand hover:text-brand">
              <ServiceIcon slug={x.slug} className="h-4 w-4" />{t(`${x.slug}.title`)}
            </Link>
          ))}
        </div>
      </div></section>
      <BlockRenderer blocks={[{ type: 'faq', props: { label: h('faq.label'), heading: h('faq.heading'), items: [1, 2, 3, 4, 5].map((i) => ({ q: h(`faq.q${i}`), a: h(`faq.a${i}`) })) } }]} />
    </>
  );
}
