import { Link } from '@/i18n/navigation';
import Hero from '@/components/site/hero';
import { CountUp, Marquee, Reveal, Tilt } from '@/components/site/interactive';
import { ServiceIcon } from '@/components/site/service-icons';
import { services } from '@/lib/data/services';
import ServicesList from '@/components/site/services-list';

type Block = { type: string; props: any };

function Band({ p }: { p: any }) {
  return (
    <section className="py-20 md:py-28 border-b border-white/15"><div className="wrap">
      <div className="elbl">{p.label}</div>
      <div className="font-display font-bold text-[clamp(2.2rem,7vw,6rem)] leading-[.98] tracking-tight mt-7 max-w-[15ch]">{p.big}</div>
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-12 md:mt-14 items-end">
        <h3 className="font-display font-bold text-[clamp(1.4rem,3vw,2.3rem)]">{p.h3}</h3>
        <p className="text-mut-d text-base md:text-lg max-w-[52ch]">{p.p}</p>
      </div>
    </div></section>
  );
}

function Services({ p }: { p: any }) {
  return <ServicesList label={p.label} heading={p.heading} />;
}

function Stats({ p }: { p: any }) {
  return (
    <section className="py-20 md:py-28"><div className="wrap">
      <div className="elbl">{p.label}</div>
      <div className="font-display font-bold text-[clamp(1.9rem,6vw,4.6rem)] leading-[.98] tracking-tight my-6 max-w-[18ch]">{p.statement}</div>
      <div className="grid grid-cols-2 md:grid-cols-4 border-y border-white/15">
        {p.items?.map((s: any, i: number) => (
          <Reveal key={i} delay={i * 90} className="p-6 md:p-9 border-r border-b md:border-b-0 border-white/15 last:border-r-0 odd:border-r [&:nth-child(2)]:border-r-0 md:[&:nth-child(2)]:border-r hover:bg-brand/[.04] transition-colors">
            <b className="font-display font-bold text-[clamp(2.2rem,5vw,3.8rem)] text-brand block leading-none"><CountUp value={s.v} /></b>
            <span className="text-mut-d text-xs sm:text-sm mt-2 block">{s.l}</span>
          </Reveal>
        ))}
      </div>
      {p.receipt && <div className="font-display font-bold text-[clamp(1.3rem,3.5vw,2.2rem)] mt-10 max-w-[22ch]">{p.receipt}</div>}
    </div></section>
  );
}

function Testimonials({ p }: { p: any }) {
  return (
    <section className="py-20 md:py-28"><div className="wrap">
      <div className="elbl">{p.label}</div>
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 mt-8">
        {p.items?.map((q: any, i: number) => (
          <Reveal key={i} delay={i * 110} className="relative border-t border-white/15 pt-8 group transition-transform duration-300 hover:-translate-y-1">
            <span aria-hidden className="absolute -top-1 left-0 font-display text-6xl text-brand/25 leading-none select-none group-hover:text-brand/50 transition-colors">"</span>
            <p className="font-display font-medium text-[clamp(1.2rem,2.6vw,2rem)] leading-tight pl-1">{q.q}</p>
            <div className="font-mono text-sm text-mut-d mt-4 flex items-center gap-2"><span className="w-5 h-px bg-brand inline-block" />{q.by}</div>
          </Reveal>
        ))}
      </div>
    </div></section>
  );
}

function Cards({ p }: { p: any }) {
  return (
    <section className="py-20 md:py-28"><div className="wrap">
      <div className="elbl">{p.label}</div>
      <h2 className="font-display font-bold text-[clamp(1.9rem,5vw,3.4rem)] mt-4">{p.heading}</h2>
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        {p.items?.map((c: any, i: number) => (
          <Reveal key={i} delay={i * 100}>
            <Tilt max={6}>
              <div className="card-glow p-6 group">
                <div className="font-mono text-xs text-brand/70">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="font-display font-bold text-xl mt-3 mb-2 group-hover:text-brand transition-colors">{c.h}</h3>
                <p className="text-mut-d text-sm leading-relaxed">{c.p}</p>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </div></section>
  );
}

function Faq({ p }: { p: any }) {
  return (
    <section className="py-20 md:py-28"><div className="wrap">
      <div className="elbl">{p.label}</div>
      <div className="mt-8 border-t border-white/15">
        {p.items?.map((f: any, i: number) => (
          <details key={i} className="border-b border-white/15 py-5 md:py-6 group">
            <summary className="font-display font-bold text-lg md:text-xl cursor-pointer list-none flex justify-between gap-4 hover:text-brand transition-colors">{f.q}<span className="text-brand transition-transform duration-300 group-open:rotate-45">+</span></summary>
            <p className="text-mut-d mt-4 max-w-[70ch]">{f.a}</p>
          </details>
        ))}
      </div>
    </div></section>
  );
}

function Cta({ p }: { p: any }) {
  return (
    <section className="bg-brand text-ink py-16 md:py-20 overflow-hidden">
      <Marquee items={Array(6).fill('DIGITERIAL')} sep="—" className="text-[clamp(2rem,6vw,4rem)] font-display font-bold opacity-90 mb-12" />
      <div className="wrap">
        <h2 className="font-display font-bold text-[clamp(2.2rem,7vw,5rem)] max-w-[14ch] leading-[.95]">{p.h2}</h2>
        <div className="flex justify-between items-end gap-6 flex-wrap mt-8">
          <p className="max-w-[40ch] text-base md:text-lg">{p.p}</p>
          <Link href="/elaqe" className="hbtn hbtn-d">{p.b1} ↗</Link>
        </div>
      </div>
    </section>
  );
}

function Clients({ p }: { p: any }) {
  return (
    <section className="py-12 md:py-16 border-y border-white/15">
      <div className="wrap mb-7"><div className="elbl">{p.label || 'Bizə etibar edənlər'}</div></div>
      <Marquee items={p.items || []} className="font-display font-bold text-[clamp(1.4rem,4vw,2.6rem)] text-white/35" sep="●" />
    </section>
  );
}

function MarqueeBand({ p }: { p: any }) {
  return (
    <div className="bg-brand text-ink py-3.5 overflow-hidden">
      <Marquee items={p.items || []} className="font-mono text-sm sm:text-base font-medium uppercase tracking-wide" sep="·" />
    </div>
  );
}

function RichText({ p }: { p: any }) {
  return (<section className="py-16 md:py-20"><div className="wrap">
    <h3 className="font-display font-bold text-[clamp(1.5rem,4vw,2.6rem)] mb-4">{p.h}</h3>
    <p className="text-neutral-300 max-w-[62ch] text-base md:text-lg">{p.p}</p>
  </div></section>);
}

const MAP: Record<string, any> = { band: Band, services: Services, stats: Stats, testimonials: Testimonials, cards: Cards, faq: Faq, cta: Cta, clients: Clients, marquee: MarqueeBand, richtext: RichText };

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === 'hero') return <Hero key={i} p={b.props} />;
        if (b.type === 'marquee') return <MarqueeBand key={i} p={b.props} />;
        const C = MAP[b.type];
        if (!C) return null;
        return <Reveal key={i}><C p={b.props} /></Reveal>;
      })}
    </>
  );
}
