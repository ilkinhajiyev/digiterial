import { Link } from '@/i18n/navigation';

type Block = { type: string; props: any };

function Hero({ p }: { p: any }) {
  return (
    <section className="pt-40 pb-24 border-b border-white/15">
      <div className="wrap">
        <div className="font-mono text-sm tracking-[.2em] uppercase text-brand mb-7 flex items-center gap-2.5 before:content-[''] before:w-7 before:h-px before:bg-brand">{p.eyebrow}</div>
        <h1 className="font-display font-bold text-[clamp(2.6rem,8vw,7rem)] leading-[.95] tracking-tight max-w-[17ch]">{p.h1}</h1>
        {p.lead && <p className="mt-6 max-w-[56ch] text-neutral-300 text-lg">{p.lead}</p>}
        <div className="flex gap-3 mt-11 flex-wrap">
          <Link href="/xidmetler" className="hbtn hbtn-y">{p.b1} ↗</Link>
          <Link href="/isler" className="hbtn hbtn-o">{p.b2} →</Link>
        </div>
      </div>
    </section>
  );
}

function Band({ p }: { p: any }) {
  return (
    <section className="py-28 border-b border-white/15">
      <div className="wrap">
        <div className="elbl">{p.label}</div>
        <div className="font-display font-bold text-[clamp(2.4rem,7vw,6rem)] leading-[.98] tracking-tight mt-7 max-w-[15ch]">{p.big}</div>
        <div className="grid md:grid-cols-2 gap-12 mt-14 items-end">
          <h3 className="font-display font-bold text-[clamp(1.5rem,3vw,2.3rem)]">{p.h3}</h3>
          <p className="text-mut-d text-lg max-w-[52ch]">{p.p}</p>
        </div>
      </div>
    </section>
  );
}

function Services({ p }: { p: any }) {
  return (
    <section className={p.light ? 'py-28 bg-paper text-ink' : 'py-28'}>
      <div className="wrap">
        <div className="elbl">{p.label}</div>
        <h2 className="font-display font-bold text-[clamp(2rem,5vw,3.6rem)] mt-4 max-w-[16ch]">{p.heading}</h2>
        <div className="mt-8 border-t border-neutral-500/30">
          {p.rows?.map((r: any, i: number) => (
            <div key={i} className="grid grid-cols-[70px_1fr_auto] gap-6 items-center py-7 border-b border-neutral-500/30">
              <span className="font-mono text-brand">{r.no}</span>
              <h3 className="font-display font-bold text-[clamp(1.5rem,3.4vw,2.4rem)]">{r.title}</h3>
              <span className="font-mono text-sm text-mut-d hidden sm:block">{r.tags}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats({ p }: { p: any }) {
  return (
    <section className="py-28">
      <div className="wrap">
        <div className="elbl">{p.label}</div>
        <div className="font-display font-bold text-[clamp(2rem,6vw,4.6rem)] leading-[.98] tracking-tight my-6 max-w-[18ch]">{p.statement}</div>
        <div className="grid grid-cols-2 md:grid-cols-4 border-y border-white/15">
          {p.items?.map((s: any, i: number) => (
            <div key={i} className="p-9 border-r border-b md:border-b-0 border-white/15 last:border-r-0">
              <b className="font-display font-bold text-[clamp(2.4rem,5vw,3.8rem)] text-brand block leading-none">{s.v}</b>
              <span className="text-mut-d text-sm mt-2 block">{s.l}</span>
            </div>
          ))}
        </div>
        {p.receipt && <div className="font-display font-bold text-[clamp(1.4rem,3.5vw,2.2rem)] mt-10 max-w-[22ch]">{p.receipt}</div>}
      </div>
    </section>
  );
}

function Testimonials({ p }: { p: any }) {
  return (
    <section className="py-28">
      <div className="wrap">
        <div className="elbl">{p.label}</div>
        <div className="grid md:grid-cols-2 gap-x-14 gap-y-10 mt-8">
          {p.items?.map((q: any, i: number) => (
            <div key={i} className="border-t border-white/15 pt-6">
              <p className="font-display font-medium text-[clamp(1.3rem,2.6vw,2rem)] leading-tight">{q.q}</p>
              <div className="font-mono text-sm text-mut-d mt-4">— {q.by}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cards({ p }: { p: any }) {
  return (
    <section className="py-28">
      <div className="wrap">
        <div className="elbl">{p.label}</div>
        <h2 className="font-display font-bold text-[clamp(2rem,5vw,3.4rem)] mt-4">{p.heading}</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {p.items?.map((c: any, i: number) => (
            <div key={i} className="border border-white/15 rounded-[18px] p-6 bg-[#0f0f0f] hover:border-brand transition">
              <div className="font-mono text-xs text-mut-d">DƏYƏR</div>
              <h3 className="font-display font-bold text-xl mt-3 mb-2">{c.h}</h3>
              <p className="text-mut-d text-sm">{c.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq({ p }: { p: any }) {
  return (
    <section className="py-28">
      <div className="wrap">
        <div className="elbl">{p.label}</div>
        <div className="mt-8 border-t border-white/15">
          {p.items?.map((f: any, i: number) => (
            <details key={i} className="border-b border-white/15 py-6 group">
              <summary className="font-display font-bold text-xl cursor-pointer list-none flex justify-between">{f.q}<span className="text-brand group-open:hidden">+</span><span className="text-brand hidden group-open:inline">–</span></summary>
              <p className="text-mut-d mt-4 max-w-[70ch]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta({ p }: { p: any }) {
  return (
    <section className="bg-brand text-ink py-20">
      <div className="wrap">
        <h2 className="font-display font-bold text-[clamp(2.4rem,7vw,5rem)] max-w-[14ch] leading-[.95]">{p.h2}</h2>
        <div className="flex justify-between items-end gap-6 flex-wrap mt-9">
          <p className="max-w-[40ch] text-lg">{p.p}</p>
          <Link href="/elaqe" className="hbtn hbtn-d">{p.b1} ↗</Link>
        </div>
      </div>
    </section>
  );
}

function RichText({ p }: { p: any }) {
  return (
    <section className="py-20"><div className="wrap">
      <h3 className="font-display font-bold text-[clamp(1.6rem,4vw,2.6rem)] mb-4">{p.h}</h3>
      <p className="text-neutral-300 max-w-[62ch] text-lg">{p.p}</p>
    </div></section>
  );
}

const MAP: Record<string, any> = { hero: Hero, band: Band, services: Services, stats: Stats, testimonials: Testimonials, cards: Cards, faq: Faq, cta: Cta, richtext: RichText };

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return <>{blocks.map((b, i) => { const C = MAP[b.type]; return C ? <C key={i} p={b.props} /> : null; })}</>;
}
