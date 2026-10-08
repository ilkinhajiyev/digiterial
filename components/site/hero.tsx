import { getTranslations } from 'next-intl/server';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { BakuClock } from '@/components/site/interactive';
import LiquidOrb from '@/components/site/liquid-orb';
import WordReveal from '@/components/site/word-reveal';

export default async function Hero({ p }: { p: any }) {
  const home = !!p.showAside;
  const th = await getTranslations('hero');

  if (!home) {
    // Daxili səhifələr üçün kinematik başlıq
    return (
      <section className="relative overflow-hidden pb-16 pt-40 md:pb-24 md:pt-52">
        <div aria-hidden className="aurora pointer-events-none absolute inset-0" />
        <div className="wrap relative">
          {p.eyebrow && <div className="eyebrow fade-up d1">{p.eyebrow}</div>}
          <h1 className="t-h1 mt-8 max-w-[14ch]"><WordReveal text={p.h1} delay={150} /></h1>
          <div className="mt-12 grid gap-8 border-t border-[color:var(--line)] pt-8 md:grid-cols-12">
            {p.lead && <p className="t-lead fade-up d4 md:col-span-6">{p.lead}</p>}
            {(p.b1 || p.b2) && (
              <div className="fade-up d5 flex flex-wrap gap-3 md:col-span-6 md:justify-end">
                {p.b1 && <Link href={p.b1Href || '/elaqe'} className="btn-primary">{p.b1} <ArrowUpRight size={18} className="arr" /></Link>}
                {p.b2 && <Link href={p.b2Href || '/isler'} className="btn-ghost">{p.b2}</Link>}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div aria-hidden className="aurora pointer-events-none absolute inset-0" />
      <LiquidOrb className="absolute inset-0" />
      {/* Kənar vinyetka — mətnin oxunaqlığı üçün */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_40%,transparent_40%,rgba(9,9,11,.85)_100%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/90 to-transparent" />

      <div className="wrap relative flex flex-1 flex-col pt-[calc(var(--header-h)+28px)]">
        <div className="fade-up d1 flex items-center justify-between font-mono text-[.68rem] uppercase tracking-[.22em] text-[color:var(--fg-3)]">
          <span className="normal-case">DIGITERIAL® — EST. 2018</span>
          <span className="hidden sm:inline">40.4093° N / 49.8671° E</span>
        </div>

        <div className="mt-auto pb-10 pt-[46vh] md:pb-14 md:pt-24">
          {p.eyebrow && <div className="eyebrow fade-up d2">{p.eyebrow}</div>}
          <h1 className="t-hero mt-7 max-w-[11ch] text-bone"><WordReveal text={p.h1} delay={250} /></h1>

          <div className="mt-10 grid items-end gap-8 md:mt-14 md:grid-cols-12">
            {p.lead && <p className="t-lead fade-up d5 max-w-[46ch] md:col-span-5">{p.lead}</p>}
            <div className="fade-up d6 flex flex-wrap gap-3 md:col-span-7 md:justify-end">
              {p.b1 && <Link href={p.b1Href || '/elaqe'} className="btn-gold">{p.b1} <ArrowUpRight size={18} className="arr" /></Link>}
              {p.b2 && <Link href={p.b2Href || '/isler'} className="btn-ghost">{p.b2}</Link>}
            </div>
          </div>
        </div>

        <div className="fade-up d6 grid grid-cols-2 gap-4 border-t border-[color:var(--line)] py-5 font-mono text-[.7rem] uppercase tracking-[.16em] text-[color:var(--fg-3)] md:grid-cols-3">
          <span className="flex items-center gap-2.5 text-bone"><span className="live-dot" />{th('available')}</span>
          <span className="text-right md:text-center">{th('now')} · <span className="text-bone"><BakuClock /></span></span>
          <a href="#next" className="hidden items-center justify-end gap-2 transition hover:text-bone md:flex">{th('explore')} <ArrowDown size={14} /></a>
        </div>
      </div>
      <span id="next" aria-hidden className="absolute bottom-0" />
    </section>
  );
}
