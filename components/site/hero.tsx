'use client';
import { useEffect, useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { services } from '@/lib/data/services';
import { ServiceIcon } from '@/components/site/service-icons';

const slides = services.slice(0, 6);

export default function Hero({ p }: { p: any }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);
  useEffect(() => { reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches; }, []);
  useEffect(() => {
    if (reduced.current || paused) return;
    const id = setInterval(() => setI((v) => (v + 1) % slides.length), 3600);
    return () => clearInterval(id);
  }, [paused]);

  const words: string[] = (p.h1 || '').split(' ');
  const cur = slides[i];

  return (
    <section className="pt-32 md:pt-40 pb-16 md:pb-24 border-b border-white/15 relative overflow-hidden">
      {/* arxa fon ləkəsi */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle,#F1E500,transparent 70%)' }} />
      <div className="wrap relative grid lg:grid-cols-[1.05fr_.95fr] gap-12 lg:gap-10 items-center">
        {/* SOL: mətn */}
        <div>
          <div className="font-mono text-xs sm:text-sm tracking-[.2em] uppercase text-brand mb-5 flex items-center gap-2.5 before:content-[''] before:w-7 before:h-px before:bg-brand">{p.eyebrow}</div>
          <h1 className="wreveal font-display font-bold text-[clamp(2.3rem,7vw,5.2rem)] leading-[.96] tracking-tight">
            {words.map((w, idx) => (
              <span key={idx} style={{ animationDelay: `${idx * 0.05}s` }}>{w}&nbsp;</span>
            ))}
          </h1>
          {p.lead && <p className="mt-6 max-w-[52ch] text-neutral-300 text-base sm:text-lg">{p.lead}</p>}
          <div className="flex gap-3 mt-8 flex-wrap">
            <Link href="/xidmetler" className="hbtn hbtn-y">{p.b1} ↗</Link>
            <Link href="/isler" className="hbtn hbtn-o">{p.b2} →</Link>
          </div>
          <div className="flex gap-6 sm:gap-10 mt-10 pt-7 border-t border-white/10">
            {[['240+', 'Layihə'], ['98', 'PageSpeed'], ['4.9', 'Reytinq']].map(([v, l]) => (
              <div key={l}><div className="font-display font-bold text-2xl sm:text-3xl text-brand leading-none">{v}</div><div className="text-mut text-xs mt-1.5">{l}</div></div>
            ))}
          </div>
        </div>

        {/* SAĞ: animativ slayder */}
        <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-[#161616] to-[#0c0c0c] p-6 sm:p-8 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-[.7rem] uppercase tracking-widest text-mut">Nə edirik</span>
              <span className="font-mono text-[.7rem] text-mut">{String(i + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
            </div>
            {/* böyük ikon + məzmun (key ilə re-mount → keçid animasiyası) */}
            <div key={cur.slug} className="anim-slide">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-brand text-ink grid place-items-center mb-5">
                <ServiceIcon slug={cur.slug} className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <div className="font-mono text-[.72rem] uppercase tracking-widest text-brand mb-2">{cur.tag}</div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl leading-tight">{cur.title}</h3>
              <p className="text-mut-d text-sm sm:text-base mt-3 min-h-[3rem]">{cur.short}</p>
              <Link href={`/xidmetler/${cur.slug}`} className="inline-flex items-center gap-2 mt-4 text-brand text-sm font-medium hover:gap-3 transition-all">Ətraflı <span>→</span></Link>
            </div>
            {/* progress */}
            <div className="h-1 bg-white/10 rounded-full mt-7 overflow-hidden">
              <div key={i + (paused ? 'p' : 'r')} className="h-full bg-brand" style={{ animation: paused ? 'none' : 'fillbar 3.6s linear forwards', width: paused ? `${((i + 1) / slides.length) * 100}%` : undefined }} />
            </div>
            {/* nav nöqtələri */}
            <div className="flex gap-2 mt-5">
              {slides.map((s, idx) => (
                <button key={s.slug} aria-label={s.title} onClick={() => setI(idx)}
                  className={`h-2 rounded-full transition-all ${idx === i ? 'w-7 bg-brand' : 'w-2 bg-white/20 hover:bg-white/40'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="wrap mt-12 hidden sm:flex items-center gap-2 text-mut font-mono text-xs">
        <span className="scrollcue">↓</span> aşağı sürüşdür
      </div>
    </section>
  );
}
