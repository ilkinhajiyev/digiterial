import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowUpRight, Plus } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import Hero from '@/components/site/hero';
import { CountUp, Marquee, Reveal } from '@/components/site/interactive';
import { ServiceIcon } from '@/components/site/service-icons';
import { Accent } from '@/components/site/accent';
import { services } from '@/lib/data/services';
import { getPortfolioFor } from '@/lib/data/portfolio';
import WorkCard from '@/components/site/work-card';
import type { Block } from '@/lib/data/page-registry';

type P = { p: any };
const arr = (v: any) => (Array.isArray(v) ? v : []);

function Head({ label, heading, text, dark, className = '' }: { label?: string; heading?: string; text?: string; dark?: boolean; className?: string }) {
  return (
    <div className={`grid gap-6 md:grid-cols-12 md:items-end ${className}`}>
      <div className="md:col-span-7">
        {label && <div className="eyebrow">{label}</div>}
        {heading && <h2 className={`t-h2 mt-5 max-w-[16ch] ${dark ? 'text-bone' : ''}`}><Accent text={heading} /></h2>}
      </div>
      {text && <p className="t-lead md:col-span-5 md:justify-self-end md:max-w-[44ch]">{text}</p>}
    </div>
  );
}

function MarqueeBand({ p }: P) {
  return (
    <div className="border-y border-line bg-bone py-5">
      <Marquee items={arr(p.items)} className="font-display text-[clamp(1.1rem,2.2vw,1.6rem)] font-medium tracking-tight" />
    </div>
  );
}

function Band({ p }: P) {
  return (
    <section className="section">
      <div className="wrap">
        {p.label && <div className="eyebrow">{p.label}</div>}
        <p className="t-display mt-6 max-w-[20ch] text-[clamp(2rem,5vw,4.2rem)]"><Accent text={p.big} /></p>
        <div className="mt-12 grid gap-6 border-t border-line pt-8 md:grid-cols-2 md:gap-12">
          <h3 className="t-h3 max-w-[30ch]">{p.h3}</h3>
          <p className="t-lead max-w-[54ch]">{p.p}</p>
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
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-4">
          {services.map((s, i) => (
            <Link key={s.slug} href={`/xidmetler/${s.slug}`}
              className="card card-hover group flex min-h-[260px] flex-col p-6 md:p-7">
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-paper text-ink transition duration-300 group-hover:bg-brand"><ServiceIcon slug={s.slug} className="h-6 w-6" /></span>
                <span className="font-mono text-xs text-mut">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="t-h3 mt-auto pt-10">{t(`${s.slug}.title`)}</h3>
              <p className="mt-2 text-[.95rem] leading-relaxed text-[color:var(--ink-2)]">{t(`${s.slug}.short`)}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
                {c('more')} <ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Workbench({ p }: P) {
  const tones = ['bg-bone text-ink', 'bg-brand text-ink', 'bg-sage text-ink', 'bg-[#2A2926] text-bone'];
  return (
    <section className="section-dark section rounded-[2rem]">
      <div className="wrap">
        <Head label={p.label} heading={p.heading} text={p.text} dark />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
          {arr(p.items).map((it: any, i: number) => (
            <div key={i} className={`flex min-h-[240px] flex-col justify-between rounded-[1.25rem] p-6 transition duration-500 ease-out hover:-translate-y-1 ${tones[i % 4]}`}>
              <span className="font-mono text-xs opacity-60">0{i + 1}</span>
              <div>
                <h3 className="t-h3">{it.h}</h3>
                <p className="mt-3 text-[.92rem] leading-relaxed opacity-75">{it.p}</p>
              </div>
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
    <section className="section">
      <div className="wrap">
        <Head label={p.label} heading={p.heading} text={p.text} />
        <ol className={`mt-14 grid gap-px overflow-hidden rounded-[1.25rem] border border-line bg-[color:var(--line)] ${items.length >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
          {items.map((it: any, i: number) => (
            <li key={i} className="group relative bg-bone p-6 md:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-line font-mono text-xs transition group-hover:border-brand group-hover:bg-brand">{i + 1}</span>
                <span className="h-px flex-1 bg-[color:var(--line)]" />
              </div>
              <h3 className="t-h3 mt-8">{it.h}</h3>
              <p className="mt-3 text-[.95rem] leading-relaxed text-[color:var(--ink-2)]">{it.p}</p>
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
    <section className="section pt-0">
      <div className="wrap">
        <div className="rounded-[2rem] bg-sage p-6 sm:p-10 md:p-14">
          <Head label={p.label} heading={p.heading} text={p.text} />
          <ul className="mt-10 flex flex-wrap gap-2.5">
            {all.map((x: string, i: number) => (
              <li key={i} className={`rounded-full px-5 py-3 font-display text-[clamp(.95rem,1.6vw,1.2rem)] tracking-tight ${i % 3 === 0 ? 'bg-ink text-bone' : 'bg-bone'}`}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Principles({ p }: P) {
  return (
    <section className="section">
      <div className="wrap">
        <Head label={p.label} heading={p.heading} />
        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {arr(p.items).map((it: any, i: number) => (
            <div key={i} className="border-t-2 border-ink pt-6">
              <span className="font-display text-[3.2rem] font-medium leading-none tracking-tight text-brand">0{i + 1}</span>
              <h3 className="t-h3 mt-6">{it.h}</h3>
              <p className="mt-3 leading-relaxed text-[color:var(--ink-2)]">{it.p}</p>
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
          {p.b1 && <Link href="/isler" className="btn-ghost">{p.b1} <ArrowUpRight size={16} className="arr" /></Link>}
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => <WorkCard key={it.id} it={it} more={tp('detail')} large={i === 0 && items.length % 2 === 1 && items.length > 1} />)}
        </div>
      </div>
    </section>
  );
}

function Stats({ p }: P) {
  return (
    <section className="section">
      <div className="wrap">
        {p.label && <div className="eyebrow">{p.label}</div>}
        {p.statement && <p className="t-h2 mt-5 max-w-[20ch]"><Accent text={p.statement} /></p>}
        <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[1.25rem] border border-line bg-[color:var(--line)] md:grid-cols-4">
          {arr(p.items).map((s: any, i: number) => (
            <div key={i} className="bg-bone p-6 md:p-8">
              <dt className="order-2 mt-2 text-sm text-[color:var(--ink-2)]">{s.l}</dt>
              <dd className="font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-medium leading-none tracking-tight"><CountUp value={String(s.v ?? '')} /></dd>
            </div>
          ))}
        </dl>
        {p.receipt && <p className="mt-8 font-mono text-sm text-mut">{p.receipt}</p>}
      </div>
    </section>
  );
}

function Cards({ p }: P) {
  return (
    <section className="section">
      <div className="wrap">
        <Head label={p.label} heading={p.heading} />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {arr(p.items).map((it: any, i: number) => (
            <div key={i} className="card card-hover p-6 md:p-7">
              <span className="font-mono text-xs text-mut">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="t-h3 mt-6">{it.h}</h3>
              <p className="mt-3 leading-relaxed text-[color:var(--ink-2)]">{it.p}</p>
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
            <figure key={i} className={`flex flex-col justify-between rounded-[1.5rem] p-7 md:p-10 ${i % 2 ? 'bg-bone border border-line' : 'bg-ink text-bone'}`}>
              <blockquote className="font-display text-[clamp(1.2rem,2.2vw,1.65rem)] leading-snug tracking-tight">“{String(q.q || '').replace(/^["“]|["”]$/g, '')}”</blockquote>
              <figcaption className="mt-10 flex items-center gap-3 font-mono text-sm opacity-70"><span className="h-px w-6 bg-brand" />{q.by}</figcaption>
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
      <Marquee items={arr(p.items)} sep="·" className="font-display text-[clamp(1.5rem,4vw,2.6rem)] font-medium tracking-tight text-ink/40" />
    </section>
  );
}

function Faq({ p }: P) {
  return (
    <section className="section">
      <div className="wrap grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          {p.label && <div className="eyebrow">{p.label}</div>}
          {p.heading && <h2 className="t-h2 mt-5">{p.heading}</h2>}
        </div>
        <div className="divide-y divide-[color:var(--line)] border-y border-line lg:col-span-8">
          {arr(p.items).map((f: any, i: number) => (
            <details key={i} className="group py-1">
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-left font-display text-[clamp(1.02rem,1.6vw,1.25rem)] font-medium tracking-tight transition hover:text-brand-deep">
                {f.q}
                <span className="faq-icon grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line transition duration-300"><Plus size={16} /></span>
              </summary>
              <p className="max-w-[64ch] pb-6 pr-12 leading-relaxed text-[color:var(--ink-2)]">{f.a}</p>
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
        <div className="relative overflow-hidden rounded-[2rem] bg-brand px-6 py-14 sm:px-10 md:px-16 md:py-20">
          <div aria-hidden className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full border-[40px] border-ink/[.07]" />
          <h2 className="t-display relative max-w-[16ch] text-[clamp(2.1rem,5.5vw,4.6rem)]"><Accent text={p.h2} /></h2>
          <div className="relative mt-10 flex flex-wrap items-end justify-between gap-6">
            {p.p && <p className="max-w-[44ch] text-[1.05rem] leading-relaxed text-ink/80">{p.p}</p>}
            <Link href={p.href || '/elaqe'} className="btn bg-ink text-bone hover:bg-bone hover:text-ink">{p.b1} <ArrowUpRight size={18} className="arr" /></Link>
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
      <div className="wrap grid gap-8 md:grid-cols-12">
        <div className="md:col-span-4">{p.label && <div className="eyebrow">{p.label}</div>}</div>
        <div className="md:col-span-8">
          {p.h && <h2 className="t-h2 max-w-[18ch]"><Accent text={p.h} /></h2>}
          <div className="mt-8 space-y-5">{paras.map((x, i) => <p key={i} className="t-lead max-w-[62ch]">{x}</p>)}</div>
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
