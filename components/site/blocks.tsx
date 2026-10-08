import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowUpRight, Plus } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import Hero from '@/components/site/hero';
import { CountUp, Marquee, Reveal } from '@/components/site/interactive';
import { ScrollWords, ServicesIndex, Spotlight } from '@/components/site/fx';
import { Accent } from '@/components/site/accent';
import { services } from '@/lib/data/services';
import { getPortfolioFor } from '@/lib/data/portfolio';
import WorkCard from '@/components/site/work-card';
import type { Block } from '@/lib/data/page-registry';

type P = { p: any; n?: number };
const arr = (v: any) => (Array.isArray(v) ? v : []);
const ch = (n?: number) => (n ? `(${String(n).padStart(2, '0')})` : '');

/** Bölmə başlığı: sol tərəfdə fəsil nömrəsi, sağda başlıq və mətn. */
function Head({ label, heading, text, n }: { label?: string; heading?: string; text?: string; n?: number }) {
  return (
    <div className="grid gap-8 md:grid-cols-12">
      <div className="md:col-span-3">
        {label && <div className="eyebrow">{label}</div>}
        {n ? <div className="chapter mt-3">{ch(n)}</div> : null}
      </div>
      <div className="md:col-span-9">
        {heading && <h2 className="t-h2 max-w-[15ch]"><Accent text={heading} /></h2>}
        {text && <p className="t-lead mt-8 max-w-[52ch]">{text}</p>}
      </div>
    </div>
  );
}

function MarqueeBand({ p }: P) {
  return (
    <div className="relative border-y border-[color:var(--line)] py-6 md:py-8">
      <p className="sr-only">{arr(p.items).join(', ')}</p>
      <Marquee items={arr(p.items)} sep="✦" itemClass="text-outline" sepClass="text-brand text-[.4em] not-italic align-middle" className="font-display text-[clamp(2.4rem,6vw,5.4rem)] italic leading-none tracking-[-.02em]" />
    </div>
  );
}

function Band({ p, n }: P) {
  return (
    <section className="section">
      <div className="wrap">
        <div className="mb-14 flex items-center justify-between">
          {p.label && <div className="eyebrow">{p.label}</div>}
          <span className="chapter">{ch(n)}</span>
        </div>
        <ScrollWords text={p.big || ''} className="t-display max-w-[18ch] text-[clamp(2.8rem,8vw,8rem)] leading-[.92]" />
        <div className="mt-16 grid gap-8 border-t border-[color:var(--line)] pt-10 md:grid-cols-12">
          <h3 className="t-h3 md:col-span-5">{p.h3}</h3>
          <p className="t-lead md:col-span-6 md:col-start-7">{p.p}</p>
        </div>
      </div>
    </section>
  );
}

async function Services({ p, n }: P) {
  const t = await getTranslations('svc');
  const c = await getTranslations('common');
  const items = services.map((s) => ({ slug: s.slug, title: t(`${s.slug}.title`), short: t(`${s.slug}.short`), tag: t(`${s.slug}.tag`) }));
  return (
    <section id="services" className="section scroll-mt-20">
      <div className="wrap">
        <Head label={p.label} heading={p.heading} text={p.text} n={n} />
        <div className="mt-16 md:mt-24"><ServicesIndex items={items} more={c('more')} /></div>
      </div>
    </section>
  );
}

function Workbench({ p, n }: P) {
  return (
    <section className="section">
      <div className="wrap">
        <Head label={p.label} heading={p.heading} text={p.text} n={n} />
        <Spotlight className="mt-16 grid gap-px overflow-hidden rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--line)] sm:grid-cols-2 lg:grid-cols-4">
          {arr(p.items).map((it: any, i: number) => (
            <div key={i} className="spot group flex min-h-[340px] flex-col justify-between bg-ink p-7 md:p-8">
              <div className="flex items-start justify-between">
                <span className="font-display text-6xl italic leading-none text-brand/80">{['i', 'ii', 'iii', 'iv', 'v', 'vi'][i] || i + 1}</span>
                <span className="h-2 w-2 rounded-full bg-[color:var(--line-2)] transition duration-500 group-hover:scale-150 group-hover:bg-brand" />
              </div>
              <div>
                <h3 className="t-h3">{it.h}</h3>
                <p className="t-small mt-4">{it.p}</p>
              </div>
            </div>
          ))}
        </Spotlight>
      </div>
    </section>
  );
}

function Process({ p, n }: P) {
  const items = arr(p.items);
  return (
    <section className="section">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+40px)]">
            {p.label && <div className="eyebrow">{p.label}</div>}
            {n ? <div className="chapter mt-3">{ch(n)}</div> : null}
            {p.heading && <h2 className="t-h2 mt-8 max-w-[12ch]"><Accent text={p.heading} /></h2>}
            {p.text && <p className="t-lead mt-8 max-w-[40ch]">{p.text}</p>}
          </div>
        </div>
        <ol className="space-y-5 lg:col-span-7">
          {items.map((it: any, i: number) => (
            <li key={i} className="stack-card" style={{ ['--i' as any]: i }}>
              <div className="relative overflow-hidden rounded-[1.75rem] border border-[color:var(--line)] bg-coal p-8 shadow-[0_-30px_60px_-30px_rgba(0,0,0,.9)] md:p-12">
                <div aria-hidden className="pointer-events-none absolute -right-10 -top-16 font-display text-[14rem] italic leading-none text-white/[.035]">{i + 1}</div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-brand">{String(i + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
                  <span className="h-px flex-1 bg-[color:var(--line)]" />
                </div>
                <h3 className="t-h3 relative mt-14 text-[clamp(2rem,3.4vw,3rem)]">{it.h}</h3>
                <p className="t-lead relative mt-4 max-w-[46ch]">{it.p}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Toolkit({ p, n }: P) {
  const all = [...arr(p.row1), ...arr(p.row2)];
  const half = Math.ceil(all.length / 2);
  return (
    <section className="section overflow-hidden">
      <div className="wrap"><Head label={p.label} heading={p.heading} text={p.text} n={n} /></div>
      <p className="sr-only">{all.join(', ')}</p>
      <div className="mt-16 space-y-2 md:mt-20">
        <Marquee items={all.slice(0, half)} sep="✦" sepClass="text-brand text-[.35em] align-middle" className="font-display text-[clamp(2.6rem,7vw,6.4rem)] leading-[1.1] tracking-[-.02em]" />
        <div className="marquee-rev"><Marquee items={all.slice(half)} sep="✦" itemClass="text-outline" sepClass="text-brand text-[.35em] align-middle not-italic" className="font-display text-[clamp(2.6rem,7vw,6.4rem)] italic leading-[1.1] tracking-[-.02em]" /></div>
      </div>
    </section>
  );
}

function Principles({ p, n }: P) {
  return (
    <section className="section">
      <div className="wrap">
        <Head label={p.label} heading={p.heading} n={n} />
        <div className="mt-20 grid gap-14 md:grid-cols-3 md:gap-10">
          {arr(p.items).map((it: any, i: number) => (
            <div key={i}>
              <div className="flex items-end gap-4 border-b border-[color:var(--line)] pb-6">
                <span className="font-display text-[5.5rem] italic leading-[.75] text-transparent [-webkit-text-stroke:1px_rgba(231,183,106,.7)]">{i + 1}</span>
              </div>
              <h3 className="t-h3 mt-8">{it.h}</h3>
              <p className="t-small mt-4">{it.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

async function Work({ p, n }: P) {
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
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            {p.label && <div className="eyebrow">{p.label}</div>}
            {n ? <div className="chapter mt-3">{ch(n)}</div> : null}
            {p.heading && <h2 className="t-h2 mt-8"><Accent text={p.heading} /></h2>}
          </div>
          {p.b1 && <Link href="/isler" className="btn-ghost">{p.b1} <ArrowUpRight size={16} className="arr" /></Link>}
        </div>
        <div className="mt-16 grid gap-x-6 gap-y-16 md:grid-cols-2">
          {items.map((it, i) => <WorkCard key={it.id} it={it} more={tp('detail')} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function Stats({ p, n }: P) {
  return (
    <section className="section">
      <div className="wrap">
        <Head label={p.label} heading={p.statement} n={n} />
        <dl className="mt-16 grid grid-cols-2 border-t border-[color:var(--line)] md:grid-cols-4">
          {arr(p.items).map((s: any, i: number) => (
            <div key={i} className="flex flex-col-reverse border-b border-[color:var(--line)] py-8 pr-6 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0">
              <dt className="mt-3 font-mono text-[.7rem] uppercase tracking-[.18em] text-ash">{s.l}</dt>
              <dd className="font-display text-[clamp(3rem,6vw,5.5rem)] leading-none tracking-[-.02em]"><CountUp value={String(s.v ?? '')} /></dd>
            </div>
          ))}
        </dl>
        {p.receipt && <p className="mt-8 font-mono text-sm text-ash">{p.receipt}</p>}
      </div>
    </section>
  );
}

function Cards({ p, n }: P) {
  return (
    <section className="section">
      <div className="wrap">
        <Head label={p.label} heading={p.heading} n={n} />
        <Spotlight className="mt-16 grid gap-4 md:grid-cols-3">
          {arr(p.items).map((it: any, i: number) => (
            <div key={i} className="spot panel p-8">
              <span className="font-mono text-xs text-brand">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="t-h3 mt-10">{it.h}</h3>
              <p className="t-small mt-4">{it.p}</p>
            </div>
          ))}
        </Spotlight>
      </div>
    </section>
  );
}

function Testimonials({ p, n }: P) {
  return (
    <section className="section">
      <div className="wrap">
        <div className="flex items-center justify-between">{p.label && <div className="eyebrow">{p.label}</div>}<span className="chapter">{ch(n)}</span></div>
        <div className="mt-14 space-y-16">
          {arr(p.items).map((q: any, i: number) => (
            <figure key={i} className={`max-w-[26ch] ${i % 2 ? 'ml-auto text-right' : ''}`}>
              <blockquote className="font-display text-[clamp(2rem,4.4vw,4rem)] italic leading-[1.02] tracking-[-.01em]">“{String(q.q || '').replace(/^["“]|["”]$/g, '')}”</blockquote>
              <figcaption className="mt-6 font-mono text-xs uppercase tracking-[.18em] text-ash">— {q.by}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Clients({ p }: P) {
  return (
    <section className="py-16">
      <div className="wrap mb-8">{p.label && <div className="eyebrow">{p.label}</div>}</div>
      <Marquee items={arr(p.items)} sep="·" className="font-display text-[clamp(2rem,4.5vw,3.6rem)] italic text-white/35" />
    </section>
  );
}

function Faq({ p, n }: P) {
  return (
    <section className="section">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          {p.label && <div className="eyebrow">{p.label}</div>}
          {n ? <div className="chapter mt-3">{ch(n)}</div> : null}
          {p.heading && <h2 className="t-h2 mt-8">{p.heading}</h2>}
        </div>
        <div className="border-t border-[color:var(--line)] lg:col-span-8">
          {arr(p.items).map((f: any, i: number) => (
            <details key={i} className="group border-b border-[color:var(--line)]">
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-7 text-left font-display text-[clamp(1.5rem,2.4vw,2.2rem)] leading-tight transition-colors duration-300 hover:text-brand">
                <span><span className="mr-4 align-middle font-mono text-xs text-ash">{String(i + 1).padStart(2, '0')}</span>{f.q}</span>
                <span className="faq-icon grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[color:var(--line-2)] transition duration-500"><Plus size={16} /></span>
              </summary>
              <p className="t-lead max-w-[62ch] pb-8 pr-14 md:pl-9">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta({ p }: P) {
  return (
    <section className="relative overflow-hidden py-28 md:py-44">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(231,183,106,.22),transparent_62%)] blur-2xl" />
      <div className="wrap relative text-center">
        <h2 className="t-display mx-auto max-w-[13ch] text-[clamp(3rem,9vw,9rem)] leading-[.88]"><Accent text={p.h2} /></h2>
        {p.p && <p className="t-lead mx-auto mt-10 max-w-[44ch]">{p.p}</p>}
        <Link href={p.href || '/elaqe'} className="btn-gold mt-12">{p.b1} <ArrowUpRight size={18} className="arr" /></Link>
      </div>
    </section>
  );
}

function RichText({ p, n }: P) {
  const paras = String(p.p || '').split('\n').filter(Boolean);
  return (
    <section className="section">
      <div className="wrap grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">{p.label && <div className="eyebrow">{p.label}</div>}{n ? <div className="chapter mt-3">{ch(n)}</div> : null}</div>
        <div className="md:col-span-9">
          {p.h && <h2 className="t-h2 max-w-[16ch]"><Accent text={p.h} /></h2>}
          <div className="mt-10 grid gap-8 md:grid-cols-2">{paras.map((x, i) => <p key={i} className={i === 0 ? 'font-display text-[1.7rem] leading-snug text-bone' : 't-lead'}>{x}</p>)}</div>
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
const UNNUMBERED = new Set(['marquee', 'cta', 'clients']);

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  let chapter = 0;
  return (
    <>
      {blocks.map((b, i) => {
        if (!b || typeof b !== 'object') return null;
        if (b.type === 'hero') return <Hero key={i} p={b.props || {}} />;
        const C = MAP[b.type];
        if (!C) return null;
        const n = UNNUMBERED.has(b.type) ? undefined : ++chapter;
        if (b.type === 'marquee' || b.type === 'process') return <C key={i} p={b.props || {}} n={n} />; // sticky üçün Reveal-siz
        return <Reveal key={i}><C p={b.props || {}} n={n} /></Reveal>;
      })}
    </>
  );
}
