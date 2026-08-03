import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { services, getService } from '@/lib/data/services';
import { ServiceIcon } from '@/components/site/service-icons';
import { Reveal } from '@/components/site/interactive';
import { JsonLd } from '@/components/site/jsonld';

export function generateStaticParams() { return services.map((s) => ({ slug: s.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params; if (!getService(slug)) return {};
  const t = await getTranslations({ locale, namespace: 'svc' });
  return { title: `${t(`${slug}.title`)} — Digiterial`, description: t(`${slug}.short`), alternates: { canonical: `/xidmetler/${slug}` } };
}

export default async function ServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params; setRequestLocale(locale);
  const s = getService(slug); if (!s) notFound();
  const t = await getTranslations('svc'); const sd = await getTranslations('svcDetail'); const c = await getTranslations('common');
  const title = t(`${slug}.title`);
  const steps = [['s1h', 's1p'], ['s2h', 's2p'], ['s3h', 's3p'], ['s4h', 's4p']] as const;
  const ld = { '@context': 'https://schema.org', '@type': 'Service', name: title, description: t(`${slug}.short`), provider: { '@type': 'Organization', name: 'Digiterial' } };
  return (
    <>
      <JsonLd data={ld} />
      <section className="pt-32 md:pt-40 pb-16 border-b border-white/15"><div className="wrap">
        <Link href="/xidmetler" className="font-mono text-xs text-mut hover:text-brand transition">← {sd('allServices')}</Link>
        <div className="flex items-center gap-4 mt-6 mb-5"><div className="w-14 h-14 rounded-2xl bg-brand text-ink grid place-items-center"><ServiceIcon slug={s.slug} className="w-7 h-7" /></div><span className="font-mono text-sm uppercase tracking-widest text-brand">{t(`${slug}.tag`)}</span></div>
        <h1 className="font-display font-bold text-[clamp(2.4rem,7vw,5rem)] leading-[.96] tracking-tight max-w-[16ch]">{title}</h1>
        <p className="mt-6 max-w-[60ch] text-neutral-300 text-lg">{t(`${slug}.short`)}</p>
        <div className="flex gap-3 mt-8 flex-wrap"><Link href="/elaqe" className="hbtn hbtn-y">{c('freeConsult')} ↗</Link>{s.metric && <span className="hbtn hbtn-o pointer-events-none">{s.metric}</span>}</div>
      </div></section>

      <Reveal><section className="py-20 md:py-24 border-b border-white/15"><div className="wrap grid md:grid-cols-[.4fr_.6fr] gap-10">
        <div className="elbl h-fit">{sd('overview')}</div>
        <div className="space-y-5">{s.overview.map((p, i) => <p key={i} className="text-neutral-200 text-lg md:text-xl leading-relaxed">{p}</p>)}</div>
      </div></section></Reveal>

      <Reveal><section className="py-20 md:py-24 border-b border-white/15"><div className="wrap">
        <div className="elbl">{sd('included')}</div><h2 className="font-display font-bold text-[clamp(1.8rem,4vw,3rem)] mt-4 mb-10">{sd('includedHead')}</h2>
        <div className="grid sm:grid-cols-2 gap-4">{s.features.map((f, i) => (<div key={i} className="border border-white/15 rounded-2xl p-6 bg-[#0f0f0f] hover:border-brand transition"><div className="font-mono text-brand text-sm mb-3">{String(i + 1).padStart(2, '0')}</div><h3 className="font-display font-bold text-xl mb-2">{f.h}</h3><p className="text-mut-d">{f.p}</p></div>))}</div>
      </div></section></Reveal>

      <Reveal><section className="py-20 md:py-24 border-b border-white/15"><div className="wrap">
        <div className="elbl">{sd('process')}</div><h2 className="font-display font-bold text-[clamp(1.8rem,4vw,3rem)] mt-4 mb-10">{sd('processHead')}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{steps.map(([hk, pk], i) => (<div key={i} className="border-t-2 border-brand pt-5"><div className="font-display font-bold text-4xl text-brand">{String(i + 1).padStart(2, '0')}</div><h3 className="font-display font-bold text-xl mt-3">{sd(hk)}</h3><p className="text-mut-d text-sm mt-2">{sd(pk)}</p></div>))}</div>
      </div></section></Reveal>

      <Reveal><section className="py-20 md:py-24"><div className="wrap grid md:grid-cols-2 gap-10 items-center">
        <div><div className="elbl">{sd('deliverables')}</div><ul className="mt-6 space-y-3">{s.deliverables.map((d, i) => (<li key={i} className="flex items-center gap-3 text-lg border-b border-white/10 pb-3"><span className="text-brand">✓</span>{d}</li>))}</ul></div>
        <div className="bg-brand text-ink rounded-3xl p-8 md:p-10"><h3 className="font-display font-bold text-[clamp(1.6rem,4vw,2.6rem)] leading-tight">{title} {sd('ctaTail')}</h3><p className="mt-3 mb-6">{sd('ctaP')}</p><Link href="/elaqe" className="hbtn hbtn-d">{sd('start')} ↗</Link></div>
      </div></section></Reveal>

      <section className="py-12 border-t border-white/15"><div className="wrap"><div className="elbl mb-6">{sd('other')}</div><div className="flex flex-wrap gap-2">{services.filter((x) => x.slug !== s.slug).map((x) => (<Link key={x.slug} href={`/xidmetler/${x.slug}`} className="border border-white/15 rounded-full px-4 py-2 text-sm text-neutral-300 hover:border-brand hover:text-brand transition">{t(`${x.slug}.title`)}</Link>))}</div></div></section>
    </>
  );
}
