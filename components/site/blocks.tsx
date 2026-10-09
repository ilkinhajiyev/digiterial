import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import Hero from '@/components/site/hero';
import { CountUp, Marquee, Reveal } from '@/components/site/interactive';
import { ServiceIcon } from '@/components/site/service-icons';
import { Accent } from '@/components/site/accent';
import { JsonLd } from '@/components/site/jsonld';
import { services } from '@/lib/data/services';
import { getPortfolioFor } from '@/lib/data/portfolio';
import WorkCard from '@/components/site/work-card';
import type { Block } from '@/lib/data/page-registry';

type P = { p: any };
const arr = (v: any) => (Array.isArray(v) ? v : []);
const pad = (n: number) => String(n).padStart(2, '0');

/** Bölmə başlığı: solda etiket, sağda başlıq + mətn (12 sütunlu grid). */
function Head({ label, heading, text, dark }: { label?: string; heading?: string; text?: string; dark?: boolean }) {
  return (
    <div className="grid gap-6 md:grid-cols-12 md:items-end">
      <div className="md:col-span-7">
        {label && <div className="eyebrow">{label}</div>}
        {heading && <h2 className={`t-h2 mt-5 max-w-[17ch] ${dark ? 'text-white' : ''}`}><Accent text={heading} /></h2>}
      </div>
      {text && <p className="t-lead md:col-span-5 md:justify-self-end md:max-w-[46ch]">{text}</p>}
    </div>
  );
}

function MarqueeBand({ p }: P) {
  return (
    <div className="bg-ink py-5 text-white">
      <p className="sr-only">{arr(p.items).join(', ')}</p>
      <Marquee items={arr(p.items)} sep="■" sepClass="text-brand text-[.5em] align-middle" className="text-[clamp(1.3rem,2.6vw,2rem)] font-semibold tracking-[-.03em]" />
    </div>
  );
}

function Band({ p }: P) {
  return (
    <section className="section">
      <div className="wrap">
        {p.label && <div className="eyebrow">{p.label}</div>}
        <p className="t-display mt-8 max-w-[22ch] text-[clamp(2.2rem,5.4vw,4.8rem)] leading-[1.02]"><Accent text={p.big} /></p>
        <div className="mt-14 grid gap-8 border-t border-[color:var(--line)] pt-8 md:grid-cols-12">
          <h3 className="t-h3 md:col-span-5">{p.h3}</h3>
          <p className="t-lead md:col-span-6 md:col-start-7">{p.p}</p>
        </div>
      </div>
    </section>
  );
}

async function Services({ p }: P) {
  const t = await getTranslations('svc');
  const c = await getTranslations('common');
  return (
    <section id="services" className="section scroll-mt-20">
      <div className="wrap">
        <Head label={p.label} heading={p.heading} text={p.text} />
        <div className="mt-14 grid overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--line)] sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 1 }}>
          {services.map((s, i) => (
            <Link key={s.slug} href={`/xidmetler/${s.slug}`}
              className="group relative flex min-h-[240px] flex-col bg-white p-7 md:min-h-[300px] transition-colors duration-300 hover:bg-brand md:p-8">
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-soft text-brand transition-colors duration-300 group-hover:bg-white/15 group-hover:text-white"><ServiceIcon slug={s.slug} className="h-6 w-6" /></span>
                <span className="idx transition-colors group-hover:text-white/70">{pad(i + 1)}</span>
              </div>
              <h3 className="t-h3 mt-auto pt-12 transition-colors group-hover:text-white">{t(`${s.slug}.title`)}</h3>
              <p className="t-small mt-3 transition-colors group-hover:text-white/80">{t(`${s.slug}.short`)}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[.9rem] font-medium text-brand transition-colors group-hover:text-white">
                {c('more')} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Workbench({ p }: P) {
  return (
    <section className="section bg-white">
      <div className="wrap">
        <Head label={p.label} heading={p.heading} text={p.text} />
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {arr(p.items).map((it: any, i: number) => (
            <div key={i} className="border-t-2 border-ink pt-6">
              <div className="text-[3.2rem] font-semibold leading-none tracking-[-.06em] text-brand">{pad(i + 1)}</div>
              <h3 className="t-h3 mt-8">{it.h}</h3>
              <p className="t-small mt-3">{it.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process({ p }: P) {
  const items = arr(p.items);
  return (
    <section className="section-dark section">
      <div className="wrap">
        <Head label={p.label} heading={p.heading} text={p.text} dark />
        <ol className={`relative mt-16 grid gap-10 md:gap-6 ${items.length >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
          <span aria-hidden className="absolute left-0 right-0 top-[22px] hidden h-px bg-white/15 md:block" />
          <span aria-hidden className="progress-line absolute left-0 right-0 top-[22px] hidden h-px bg-brand md:block" />
          {items.map((it: any, i: number) => (
            <li key={i} className="relative">
              <span className="relative grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-ink font-mono text-sm text-white">{pad(i + 1)}</span>
              <h3 className="t-h3 mt-8 text-white">{it.h}</h3>
              <p className="t-small mt-3">{it.p}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Toolkit({ p }: P) {
  const all = [...arr(p.row1), ...arr(p.row2)];
  return (
    <section className="section">
      <div className="wrap">
        <Head label={p.label} heading={p.heading} text={p.text} />
        <ul className="mt-14 grid grid-cols-2 overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--line)] sm:grid-cols-4" style={{ gap: 1 }}>
          {all.map((x: string, i: number) => (
            <li key={i} className="group flex h-28 items-center justify-center bg-paper px-4 text-center text-[clamp(1rem,1.6vw,1.25rem)] font-semibold tracking-[-.03em] text-graphite transition-colors hover:bg-white hover:text-ink md:h-32">{x}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Principles({ p }: P) {
  return (
    <section className="section pt-0">
      <div className="wrap">
        <Head label={p.label} heading={p.heading} />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {arr(p.items).map((it: any, i: number) => (
            <div key={i} className="card p-7 md:p-8">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-ink font-mono text-xs text-white">{pad(i + 1)}</span>
              <h3 className="t-h3 mt-10">{it.h}</h3>
              <p className="t-small mt-3">{it.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

async function Work({ p }: P) {
  const locale = await getLocale();
  const tp = await getTranslations('portfolio');
  let items = await getPortfolioFor(locale);
  const featured = items.filter((x) => x.featured);
  if (p.featuredOnly !== false && featured.length) items = featured;
  items = items.slice(0, Number(p.limit) || 3);
  if (!items.length) return null; // Layihə yoxdursa bölmə görünmür
  return (
    <section className="section">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>{p.label && <div className="eyebrow">{p.label}</div>}{p.heading && <h2 className="t-h2 mt-5"><Accent text={p.heading} /></h2>}</div>
          {p.b1 && <Link href="/isler" className="btn-ghost">{p.b1} <ArrowRight size={16} className="arr" /></Link>}
        </div>
        <div className="mt-14 grid gap-x-5 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => <WorkCard key={it.id} it={it} more={tp('detail')} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function Stats({ p }: P) {
  return (
    <section className="section">
      <div className="wrap">
        <Head label={p.label} heading={p.statement} />
        <dl className="mt-14 grid grid-cols-2 overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--line)] md:grid-cols-4" style={{ gap: 1 }}>
          {arr(p.items).map((s: any, i: number) => (
            <div key={i} className="flex flex-col-reverse bg-white p-7">
              <dt className="mt-2 text-[.9rem] text-graphite">{s.l}</dt>
              <dd className="text-[clamp(2.4rem,4.5vw,3.8rem)] font-semibold leading-none tracking-[-.05em]"><CountUp value={String(s.v ?? '')} /></dd>
            </div>
          ))}
        </dl>
        {p.receipt && <p className="mt-6 font-mono text-sm text-graphite">{p.receipt}</p>}
      </div>
    </section>
  );
}

function Cards({ p }: P) {
  return (
    <section className="section">
      <div className="wrap">
        <Head label={p.label} heading={p.heading} />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {arr(p.items).map((it: any, i: number) => (
            <div key={i} className="card card-hover p-7">
              <span className="idx">{pad(i + 1)}</span>
              <h3 className="t-h3 mt-8">{it.h}</h3>
              <p className="t-small mt-3">{it.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ p }: P) {
  return (
    <section className="section">
      <div className="wrap">
        {p.label && <div className="eyebrow">{p.label}</div>}
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {arr(p.items).map((q: any, i: number) => (
            <figure key={i} className={`flex flex-col justify-between rounded-2xl p-8 md:p-10 ${i % 2 ? 'card' : 'bg-ink text-white'}`}>
              <blockquote className="text-[clamp(1.2rem,2vw,1.55rem)] font-medium leading-snug tracking-[-.02em]">“{String(q.q || '').replace(/^["“]|["”]$/g, '')}”</blockquote>
              <figcaption className={`mt-10 font-mono text-[.78rem] ${i % 2 ? 'text-graphite' : 'text-white/60'}`}>— {q.by}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Clients({ p }: P) {
  return (
    <section className="py-14">
      <div className="wrap mb-6">{p.label && <div className="eyebrow">{p.label}</div>}</div>
      <Marquee items={arr(p.items)} sep="·" className="text-[clamp(1.6rem,3.6vw,2.6rem)] font-semibold tracking-[-.04em] text-ink/35" />
    </section>
  );
}

function Faq({ p }: P) {
  const items = arr(p.items);
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map((f: any) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  return (
    <section className="section">
      {items.length > 0 && <JsonLd data={ld} />}
      <div className="wrap grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          {p.label && <div className="eyebrow">{p.label}</div>}
          {p.heading && <h2 className="t-h2 mt-5">{p.heading}</h2>}
        </div>
        <div className="lg:col-span-8">
          {items.map((f: any, i: number) => (
            <details key={i} className="group mb-3 rounded-2xl border border-[color:var(--line)] bg-white px-6 transition-shadow open:shadow-[0_20px_50px_-30px_rgba(10,11,13,.3)]">
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-left text-[clamp(1.02rem,1.4vw,1.15rem)] font-semibold tracking-[-.02em]">
                {f.q}
                <span className="faq-icon grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[color:var(--line-2)] transition duration-300"><Plus size={16} /></span>
              </summary>
              <p className="t-small max-w-[64ch] pb-6 pr-10">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta({ p }: P) {
  return (
    <section className="pb-20 md:pb-28">
      <div className="wrap">
        <div className="on-dark relative overflow-hidden rounded-3xl bg-brand px-6 py-16 text-white sm:px-12 md:px-16 md:py-24">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_left,#000,transparent_70%)]" />
          <div className="relative grid items-end gap-10 md:grid-cols-12">
            <h2 className="t-display text-[clamp(2.2rem,5vw,4.4rem)] md:col-span-8 [&_em]:!text-white [&_em]:underline [&_em]:decoration-white/40 [&_em]:decoration-2 [&_em]:underline-offset-[.15em]"><Accent text={p.h2} /></h2>
            <div className="md:col-span-4">
              {p.p && <p className="text-[1.05rem] leading-relaxed text-white/80">{p.p}</p>}
              <Link href={p.href || '/elaqe'} className="btn-light mt-8">{p.b1} <ArrowUpRight size={18} className="arr" /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RichText({ p }: P) {
  const paras = String(p.p || '').split('\n').filter(Boolean);
  return (
    <section className="section">
      <div className="wrap grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">{p.label && <div className="eyebrow">{p.label}</div>}</div>
        <div className="md:col-span-8">
          {p.h && <h2 className="t-h2 max-w-[18ch]"><Accent text={p.h} /></h2>}
          <div className="mt-10 space-y-6">{paras.map((x, i) => <p key={i} className={i === 0 ? 'text-[1.3rem] font-medium leading-snug tracking-[-.02em]' : 't-lead'}>{x}</p>)}</div>
        </div>
      </div>
    </section>
  );
}

const MAP: Record<string, (props: P) => any> = {
  marquee: MarqueeBand, band: Band, services: Services, workbench: Workbench, process: Process, toolkit: Toolkit,
  principles: Principles, work: Work, stats: Stats, cards: Cards, testimonials: Testimonials, clients: Clients,
  faq: Faq, cta: Cta, richtext: RichText,
};

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (!b || typeof b !== 'object') return null;
        if (b.type === 'hero') return <Hero key={i} p={b.props || {}} />;
        const C = MAP[b.type];
        if (!C) return null;
        if (b.type === 'marquee') return <C key={i} p={b.props || {}} />;
        return <Reveal key={i}><C p={b.props || {}} /></Reveal>;
      })}
    </>
  );
}
