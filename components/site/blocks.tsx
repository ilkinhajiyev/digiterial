import { Link } from '@/i18n/navigation';
import Hero from '@/components/site/hero';
import { CountUp, Marquee, Reveal } from '@/components/site/interactive';
import { ServiceIcon } from '@/components/site/service-icons';
import { services } from '@/lib/data/services';
import ServicesList from '@/components/site/services-list';

type Block = { type: string; props: any };

function Band({ p }: { p: any }) {
  return (
    <section className="py-24 md:py-36 border-b border-white/10 relative overflow-hidden"><div className="wrap">
      <div className="elbl">{p.label}</div>
      <div className="font-display font-semibold text-[clamp(2.5rem,7vw,6.5rem)] leading-[.92] tracking-[-.05em] mt-7 max-w-[15ch]">{p.big}</div>
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
    <section className="py-24 md:py-32 bg-[#0d100e]"><div className="wrap">
      <div className="elbl">{p.label}</div>
      <div className="font-display font-bold text-[clamp(1.9rem,6vw,4.6rem)] leading-[.98] tracking-tight my-6 max-w-[18ch]">{p.statement}</div>
      <div className="grid grid-cols-2 md:grid-cols-4 border-y border-white/15">
        {p.items?.map((s: any, i: number) => (
          <div key={i} className="p-6 md:p-9 border-r border-b md:border-b-0 border-white/15 last:border-r-0 odd:border-r [&:nth-child(2)]:border-r-0 md:[&:nth-child(2)]:border-r hover:bg-brand/[.04] transition-colors">
            <b className="font-display font-bold text-[clamp(2.2rem,5vw,3.8rem)] text-brand block leading-none"><CountUp value={s.v} /></b>
            <span className="text-mut-d text-xs sm:text-sm mt-2 block">{s.l}</span>
          </div>
        ))}
      </div>
      {p.receipt && <div className="font-display font-bold text-[clamp(1.3rem,3.5vw,2.2rem)] mt-10 max-w-[22ch]">{p.receipt}</div>}
    </div></section>
  );
}

function Process({ p }: { p: any }) {
  return (
    <section className="py-24 md:py-32 border-y border-white/10">
      <div className="wrap">
        <div className="grid lg:grid-cols-[.8fr_1.2fr] gap-12 lg:gap-20">
          <div>
            <div className="elbl">{p.label}</div>
            <h2 className="font-display font-semibold text-[clamp(2.3rem,5vw,4.8rem)] leading-[.94] tracking-[-.045em] mt-6 max-w-[10ch]">{p.heading}</h2>
            <p className="text-mut-d mt-6 max-w-[42ch] leading-relaxed">{p.text}</p>
          </div>
          <div className="border-t border-white/15">
            {p.items?.map((item: any, i: number) => (
              <div key={i} className="group grid grid-cols-[44px_1fr] sm:grid-cols-[70px_1fr_auto] gap-4 sm:gap-7 py-7 md:py-9 border-b border-white/15 items-start">
                <span className="font-mono text-xs text-brand pt-1">0{i + 1}</span>
                <div><h3 className="font-display font-semibold text-xl md:text-2xl group-hover:text-brand transition-colors">{item.h}</h3><p className="text-mut-d mt-2 max-w-[48ch] text-sm md:text-base">{item.p}</p></div>
                <span aria-hidden className="hidden sm:grid w-10 h-10 rounded-full border border-white/15 place-items-center group-hover:bg-brand group-hover:text-ink group-hover:border-brand transition-colors">↗</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials({ p }: { p: any }) {
  return (
    <section className="py-20 md:py-28"><div className="wrap">
      <div className="elbl">{p.label}</div>
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 mt-8">
        {p.items?.map((q: any, i: number) => (
          <div key={i} className="relative border-t border-white/15 pt-8 group">
            <span aria-hidden className="absolute -top-1 left-0 font-display text-6xl text-brand/25 leading-none select-none group-hover:text-brand/50 transition-colors">"</span>
            <p className="font-display font-medium text-[clamp(1.2rem,2.6vw,2rem)] leading-tight pl-1">{q.q}</p>
            <div className="font-mono text-sm text-mut-d mt-4 flex items-center gap-2"><span className="w-5 h-px bg-brand inline-block" />{q.by}</div>
          </div>
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
          <div key={i} className="card-glow p-6 group">
            <div className="font-mono text-xs text-brand/70">{String(i + 1).padStart(2, '0')}</div>
            <h3 className="font-display font-bold text-xl mt-3 mb-2 group-hover:text-brand transition-colors">{c.h}</h3>
            <p className="text-mut-d text-sm leading-relaxed">{c.p}</p>
          </div>
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
    <section className="bg-brand text-ink py-20 md:py-28">
      <div className="wrap">
        <div className="font-mono text-[.68rem] tracking-[.18em] uppercase mb-10">Digiterial / Contact</div>
        <h2 className="font-display font-medium tracking-[-.055em] text-[clamp(2.5rem,7vw,6rem)] max-w-[14ch] leading-[.9]">{p.h2}</h2>
        <div className="flex justify-between items-end gap-6 flex-wrap mt-10 pt-8 border-t border-ink/20">
          <p className="max-w-[40ch] text-base md:text-lg">{p.p}</p>
          <Link href="/elaqe" className="hbtn hbtn-d">{p.b1} ↗</Link>
        </div>
      </div>
    </section>
  );
}

function Clients({ p }: { p: any }) {
  return (
    <section className="py-14 md:py-20 border-y border-white/10 bg-white/[.015]">
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

const MAP: Record<string, any> = { band: Band, services: Services, process: Process, stats: Stats, testimonials: Testimonials, cards: Cards, faq: Faq, cta: Cta, clients: Clients, marquee: MarqueeBand, richtext: RichText };

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
