import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight, Check } from 'lucide-react';
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
  return buildMetadata({ locale, path: `/xidmetler/${slug}`, title: t(`${slug}.title`), description: `${t(`${slug}.short`)} ${t(`${slug}.o1`)}`.slice(0, 160) });
}

export default async function ServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params; setRequestLocale(locale);
  const s = getService(slug); if (!s) notFound();
  const t = await getTranslations('svc'); const sd = await getTranslations('svcDetail'); const c = await getTranslations('common'); const h = await getTranslations('home');
  const title = t(`${slug}.title`);
  const features = [1, 2, 3, 4].map((n) => ({ h: t(`${slug}.f${n}h`), p: t(`${slug}.f${n}p`) }));
  const deliverables = [1, 2, 3, 4, 5].map((n) => t(`${slug}.d${n}`));
  const steps = [1, 2, 3, 4].map((n) => ({ h: sd(`s${n}h`), p: sd(`s${n}p`) }));
  const ld = {
    '@context': 'https://schema.org', '@type': 'Service', name: title, description: t(`${slug}.short`), serviceType: title,
    url: `${SITE_URL}${localePath(locale, `/xidmetler/${slug}`)}`, areaServed: 'AZ',
    provider: { '@type': 'Organization', name: 'Digiterial', url: SITE_URL },
  };
  return (
    <>
      <JsonLd data={ld} />
      <PageHeader back={{ href: '/xidmetler', label: sd('allServices') }} eyebrow={t(`${slug}.tag`)} title={title} lead={t(`${slug}.short`)}>
        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/elaqe?service=${encodeURIComponent(title)}`} className="btn-primary">{c('freeConsult')} <ArrowUpRight size={18} className="arr" /></Link>
          {t(`${slug}.metric`) && <span className="chip h-12 px-5 text-sm">{t(`${slug}.metric`)}</span>}
        </div>
      </PageHeader>

      <Reveal as="section" className="section pt-6"><div className="wrap grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand"><ServiceIcon slug={slug} className="h-8 w-8" /></span>
          <div className="eyebrow mt-6">{sd('overview')}</div>
        </div>
        <div className="space-y-5 md:col-span-8">
          <p className="t-display text-[clamp(1.4rem,2.6vw,2.1rem)] leading-snug">{t(`${slug}.o1`)}</p>
          <p className="t-lead max-w-[60ch]">{t(`${slug}.o2`)}</p>
        </div>
      </div></Reveal>

      <Reveal as="section" className="section-dark section rounded-[2rem]"><div className="wrap">
        <div className="eyebrow">{sd('included')}</div>
        <h2 className="t-h2 mt-5 text-bone">{sd('includedHead')}</h2>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div key={i} className="flex min-h-[200px] flex-col justify-between rounded-[1.25rem] bg-white/[.06] p-6 transition hover:bg-white/[.1]">
              <span className="font-mono text-xs text-brand">{String(i + 1).padStart(2, '0')}</span>
              <div><h3 className="t-h3">{f.h}</h3><p className="mt-2 text-[.93rem] text-[#C9C4BA]">{f.p}</p></div>
            </div>
          ))}
        </div>
      </div></Reveal>

      <BlockRenderer blocks={[{ type: 'process', props: { label: sd('process'), heading: sd('processHead'), items: steps } }]} />

      <Reveal as="section" className="section pt-0"><div className="wrap grid gap-6 lg:grid-cols-2">
        <div className="card p-7 md:p-10">
          <div className="eyebrow">{sd('deliverables')}</div>
          <ul className="mt-6 divide-y divide-[color:var(--line)]">
            {deliverables.map((d, i) => (
              <li key={i} className="flex items-center gap-4 py-4 text-[1.05rem]"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand"><Check size={14} strokeWidth={2.5} /></span>{d}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-between rounded-[var(--radius)] bg-ink p-7 text-bone md:p-10">
          <h3 className="t-display text-[clamp(1.7rem,3.4vw,2.6rem)]">{title} — {sd('ctaTail')}</h3>
          <div className="mt-10">
            <p className="mb-6 text-[#C9C4BA]">{sd('ctaP')}</p>
            <Link href={`/elaqe?service=${encodeURIComponent(title)}`} className="btn-brand">{sd('start')} <ArrowUpRight size={18} className="arr" /></Link>
          </div>
        </div>
      </div></Reveal>

      <section className="pb-20"><div className="wrap">
        <div className="eyebrow mb-6">{sd('other')}</div>
        <div className="flex flex-wrap gap-2">
          {services.filter((x) => x.slug !== slug).map((x) => (
            <Link key={x.slug} href={`/xidmetler/${x.slug}`} className="chip px-4 py-2.5 text-[.92rem] transition hover:border-ink hover:bg-ink hover:text-bone">
              <ServiceIcon slug={x.slug} className="h-4 w-4" />{t(`${x.slug}.title`)}
            </Link>
          ))}
        </div>
      </div></section>
      <BlockRenderer blocks={[{ type: 'faq', props: { label: h('faq.label'), items: [1, 2, 3, 4].map((n) => ({ q: h(`faq.q${n}`), a: h(`faq.a${n}`) })) } }]} />
    </>
  );
}
