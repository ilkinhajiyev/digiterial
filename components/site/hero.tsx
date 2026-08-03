'use client';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ArrowDown, ArrowUpRight, BarChart3, Layers3, MousePointer2, Sparkles } from 'lucide-react';

export default function Hero({ p }: { p: any }) {
  const th = useTranslations('hero');
  const words: string[] = (p.h1 || '').split(' ');

  return (
    <section className="min-h-[860px] lg:min-h-screen pt-28 md:pt-36 pb-10 border-b border-white/10 relative overflow-hidden flex items-center">
      <div aria-hidden className="site-grid absolute inset-0 opacity-70" />
      <div aria-hidden className="hero-glow pointer-events-none absolute -top-56 -right-44 w-[760px] h-[760px] rounded-full" />
      <div className="wrap relative w-full">
        <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-14 lg:gap-12 items-center">
        <div className="max-w-[800px]">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[.04] px-4 py-2 font-mono text-[.68rem] sm:text-xs tracking-[.16em] uppercase text-neutral-300 mb-7">
            <span className="signal-dot w-1.5 h-1.5 rounded-full bg-brand" /> {p.eyebrow}
          </div>
          <h1 className="wreveal font-display font-semibold text-[clamp(3.2rem,7.4vw,7.4rem)] leading-[.86] tracking-[-.06em]">
            {words.map((w, idx) => (
              <span key={idx} style={{ animationDelay: `${idx * 0.05}s` }} className={idx >= words.length - 2 ? 'grad-text' : ''}>{w}&nbsp;</span>
            ))}
          </h1>
          {p.lead && <p className="mt-7 max-w-[56ch] text-neutral-300 text-base sm:text-lg md:text-xl leading-relaxed">{p.lead}</p>}
          <div className="flex gap-3 mt-9 flex-wrap">
            <Link href="/xidmetler" className="hbtn hbtn-y min-w-[170px]">{p.b1} <ArrowUpRight size={18} /></Link>
            <Link href="/isler" className="hbtn hbtn-o min-w-[160px]">{p.b2} <span>→</span></Link>
          </div>
          <div className="flex gap-7 sm:gap-12 mt-11 pt-7 border-t border-white/10 max-w-[620px]">
            {[['240+', th('projects')], ['98/100', 'PageSpeed'], ['4.9/5', th('rating')]].map(([v, l]) => (
              <div key={l}><div className="font-display font-semibold text-xl sm:text-2xl text-white leading-none">{v}</div><div className="text-mut-d text-[.68rem] sm:text-xs mt-2 uppercase tracking-wider">{l}</div></div>
            ))}
          </div>
        </div>
        <div className="relative hidden sm:block max-w-[570px] mx-auto lg:mx-0 w-full">
          <div aria-hidden className="hero-orbit absolute -inset-9 rounded-full border border-dashed border-white/10" />
          <div className="glass-panel relative rounded-[2rem] border border-white/10 p-5 sm:p-7 overflow-hidden">
            <div className="flex items-center justify-between mb-10">
              <span className="font-mono text-[.68rem] uppercase tracking-[.2em] text-mut-d">{th('whatWeDo')}</span>
              <span className="flex items-center gap-2 text-[.7rem] text-brand"><span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" /> LIVE GROWTH</span>
            </div>
            <div className="rounded-3xl bg-brand text-ink p-6 sm:p-8 min-h-[270px] flex flex-col justify-between relative overflow-hidden">
              <div aria-hidden className="absolute -right-12 -bottom-16 w-48 h-48 rounded-full border-[28px] border-ink/10" />
              <div className="flex items-start justify-between"><Sparkles size={34} strokeWidth={1.5} /><span className="font-mono text-[.65rem] border border-ink/20 rounded-full px-3 py-1">DIGITAL SYSTEM 01</span></div>
              <div>
                <div className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[.95] tracking-tight font-semibold relative">{th('systemLine1')}<br/>{th('systemLine2')}</div>
                <div className="mt-5 h-1.5 bg-ink/15 rounded-full overflow-hidden"><div className="h-full w-[84%] bg-ink rounded-full" /></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              {[{I:MousePointer2,v:'+312%',l:th('conversion')}, {I:Layers3,v:'8',l:th('channels')}, {I:BarChart3,v:'24/7',l:th('analytics')}].map(({I,v,l}) => (
                <div key={l} className="rounded-2xl border border-white/10 bg-white/[.035] p-4"><I className="text-brand mb-5" size={19}/><b className="block font-display text-lg">{v}</b><span className="text-[.63rem] uppercase tracking-wider text-mut-d">{l}</span></div>
              ))}
            </div>
          </div>
          <div className="hero-float absolute -right-5 -bottom-7 rounded-2xl bg-white text-ink px-5 py-4 shadow-2xl"><div className="font-mono text-[.6rem] uppercase tracking-wider text-black/50">{th('averageResult')}</div><div className="font-display text-2xl font-bold mt-1">3.8× ROI</div></div>
        </div>
        </div>
        <a href="#services" className="mt-10 md:mt-14 inline-flex items-center gap-3 font-mono text-[.68rem] uppercase tracking-[.18em] text-mut-d hover:text-brand transition-colors">
          <span className="w-10 h-10 rounded-full border border-white/15 grid place-items-center"><ArrowDown size={15} /></span>{th('explore')}
        </a>
      </div>
    </section>
  );
}
