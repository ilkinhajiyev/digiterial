import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { services, getService } from '@/lib/data/services';
import { ServiceIcon } from '@/components/site/service-icons';
import { Reveal } from '@/components/site/interactive';
import { JsonLd } from '@/components/site/jsonld';

export function generateStaticParams() { return services.map((s) => ({ slug: s.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const s = getService(slug);
  if (!s) return {};
  return { title: `${s.title} — Digiterial`, description: s.short, alternates: { canonical: `/xidmetler/${slug}` } };
}

const steps = [
  { n: '01', h: 'Kəşf', p: 'Biznes, məqsəd və auditoriyanı anlayırıq.' },
  { n: '02', h: 'Strategiya', p: 'Aydın plan və ölçülə bilən KPI-lar.' },
  { n: '03', h: 'İcra', p: 'Dizayn, inkişaf və ya kampaniya qurulması.' },
  { n: '04', h: 'Optimizasiya', p: 'Data əsaslı davamlı yaxşılaşdırma.' },
];

export default async function ServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params; setRequestLocale(locale);
  const s = getService(slug);
  if (!s) notFound();
  const ld = { '@context': 'https://schema.org', '@type': 'Service', name: s.title, description: s.short, provider: { '@type': 'Organization', name: 'Digiterial' }, areaServed: 'AZ' };

  return (
    <>
      <JsonLd data={ld} />
      {/* HERO */}
      <section className="pt-32 md:pt-40 pb-16 border-b border-white/15">
        <div className="wrap">
          <Link href="/xidmetler" className="font-mono text-xs text-mut hover:text-brand transition">← Bütün xidmətlər</Link>
          <div className="flex items-center gap-4 mt-6 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-brand text-ink grid place-items-center"><ServiceIcon slug={s.slug} className="w-7 h-7" /></div>
            <span className="font-mono text-sm uppercase tracking-widest text-brand">{s.tag}</span>
          </div>
          <h1 className="font-display font-bold text-[clamp(2.4rem,7vw,5rem)] leading-[.96] tracking-tight max-w-[16ch]">{s.title}</h1>
          <p className="mt-6 max-w-[60ch] text-neutral-300 text-lg">{s.short}</p>
          <div className="flex gap-3 mt-8 flex-wrap">
            <Link href="/elaqe" className="hbtn hbtn-y">Pulsuz konsultasiya ↗</Link>
            {s.metric && <span className="hbtn hbtn-o pointer-events-none">{s.metric}</span>}
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <Reveal><section className="py-20 md:py-24 border-b border-white/15"><div className="wrap grid md:grid-cols-[.4fr_.6fr] gap-10">
        <div className="elbl h-fit">Ümumi baxış</div>
        <div className="space-y-5">{s.overview.map((para, i) => <p key={i} className="text-neutral-200 text-lg md:text-xl leading-relaxed">{para}</p>)}</div>
      </div></section></Reveal>

      {/* FEATURES */}
      <Reveal><section className="py-20 md:py-24 border-b border-white/15"><div className="wrap">
        <div className="elbl">Daxildir</div>
        <h2 className="font-display font-bold text-[clamp(1.8rem,4vw,3rem)] mt-4 mb-10">Nə təklif edirik.</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {s.features.map((f, i) => (
            <div key={i} className="border border-white/15 rounded-2xl p-6 bg-[#0f0f0f] hover:border-brand transition">
              <div className="font-mono text-brand text-sm mb-3">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="font-display font-bold text-xl mb-2">{f.h}</h3>
              <p className="text-mut-d">{f.p}</p>
            </div>
          ))}
        </div>
      </div></section></Reveal>

      {/* PROCESS */}
      <Reveal><section className="py-20 md:py-24 border-b border-white/15"><div className="wrap">
        <div className="elbl">Necə işləyirik</div>
        <h2 className="font-display font-bold text-[clamp(1.8rem,4vw,3rem)] mt-4 mb-10">Proses.</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((st) => (
            <div key={st.n} className="border-t-2 border-brand pt-5">
              <div className="font-display font-bold text-4xl text-brand">{st.n}</div>
              <h3 className="font-display font-bold text-xl mt-3">{st.h}</h3>
              <p className="text-mut-d text-sm mt-2">{st.p}</p>
            </div>
          ))}
        </div>
      </div></section></Reveal>

      {/* DELIVERABLES + CTA */}
      <Reveal><section className="py-20 md:py-24"><div className="wrap grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="elbl">Təhvil verilənlər</div>
          <ul className="mt-6 space-y-3">{s.deliverables.map((d, i) => (
            <li key={i} className="flex items-center gap-3 text-lg border-b border-white/10 pb-3"><span className="text-brand">✓</span>{d}</li>
          ))}</ul>
        </div>
        <div className="bg-brand text-ink rounded-3xl p-8 md:p-10">
          <h3 className="font-display font-bold text-[clamp(1.6rem,4vw,2.6rem)] leading-tight">{s.title} layihənizi danışaq.</h3>
          <p className="mt-3 mb-6">Pulsuz audit və konsultasiya ilə başlayaq.</p>
          <Link href="/elaqe" className="hbtn hbtn-d">Başla ↗</Link>
        </div>
      </div></section></Reveal>

      {/* DİGƏR XİDMƏTLƏR */}
      <section className="py-12 border-t border-white/15"><div className="wrap">
        <div className="elbl mb-6">Digər xidmətlər</div>
        <div className="flex flex-wrap gap-2">
          {services.filter((x) => x.slug !== s.slug).map((x) => (
            <Link key={x.slug} href={`/xidmetler/${x.slug}`} className="border border-white/15 rounded-full px-4 py-2 text-sm text-neutral-300 hover:border-brand hover:text-brand transition">{x.title}</Link>
          ))}
        </div>
      </div></section>
    </>
  );
}
