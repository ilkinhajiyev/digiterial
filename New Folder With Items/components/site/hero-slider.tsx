'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play, Search } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { SignalField } from '@/components/site/fx';
import WordReveal from '@/components/site/word-reveal';

export type HeroSlide = {
  key: 'growth' | 'web' | 'seo' | 'ads';
  nav: string; tag: string; h: string; p: string;
  b1: string; b1Href: string; b2?: string; b2Href?: string;
  extra?: Record<string, string>;
};
type Labels = { label: string; prev: string; next: string; pause: string; play: string; available: string; sig: string[]; focus: string[] };

const DURATION = 7000;

/* ─────────────── Slayd vizualları (kodla çəkilir, şəkil yükləmir) ─────────────── */

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card overflow-hidden shadow-[0_40px_120px_-40px_rgba(61,255,168,.25)]">
      <div className="flex items-center justify-between border-b border-[color:var(--line)] px-5 py-3.5">
        <div className="flex items-center gap-1.5" aria-hidden><span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" /></div>
        <span className="font-mono text-[.7rem] text-muted">{title}</span>
        <span className="flex items-center gap-1.5 font-mono text-[.7rem] text-muted"><span className="live-dot" />live</span>
      </div>
      <div className="relative aspect-[5/4] bg-[radial-gradient(120%_90%_at_100%_0%,rgba(61,255,168,.10),transparent_60%),linear-gradient(180deg,#0E0F12,#08090B)]">{children}</div>
    </div>
  );
}

function GrowthVisual({ l }: { l: Labels }) {
  return (
    <div>
      <Frame title="digiterial / growth.signal"><SignalField labels={l.sig} /></Frame>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {l.focus.map((f, i) => <div key={f} className="rounded-xl border border-[color:var(--line)] bg-surface px-3 py-2.5"><div className="idx">0{i + 1}</div><div className="mt-0.5 text-[.8rem] font-medium leading-snug">{f}</div></div>)}
      </div>
    </div>
  );
}

/** Veb: sayt maketinin hissə-hissə "yığılması" + mobil versiya */
function WebVisual() {
  const block = 'hs-build rounded-md bg-white/[.07]';
  return (
    <div className="relative">
      <Frame title="digiterial / new-site.tsx">
        <div className="absolute inset-0 p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <div className={`${block} h-4 w-20`} style={{ animationDelay: '.05s' }} />
            <div className="flex gap-2">{[0, 1, 2].map((i) => <div key={i} className={`${block} h-2.5 w-10`} style={{ animationDelay: `${.1 + i * .05}s` }} />)}<div className="hs-build h-2.5 w-14 rounded-full bg-brand" style={{ animationDelay: '.25s' }} /></div>
          </div>
          <div className="mt-8 space-y-2.5">
            <div className={`${block} h-6 w-[78%]`} style={{ animationDelay: '.35s' }} />
            <div className={`${block} h-6 w-[58%]`} style={{ animationDelay: '.45s' }} />
            <div className={`${block} h-2.5 w-[46%] !bg-white/[.04]`} style={{ animationDelay: '.55s' }} />
          </div>
          <div className="mt-5 flex gap-2"><div className="hs-build h-8 w-28 rounded-full bg-brand" style={{ animationDelay: '.65s' }} /><div className="hs-build h-8 w-24 rounded-full border border-white/15" style={{ animationDelay: '.7s' }} /></div>
          <div className="mt-7 grid grid-cols-3 gap-2.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="hs-build rounded-lg border border-white/[.06] bg-white/[.03] p-3" style={{ animationDelay: `${.8 + i * .1}s` }}>
                <div className="h-5 w-5 rounded-md bg-brand/30" /><div className="mt-3 h-2 w-[80%] rounded bg-white/10" /><div className="mt-1.5 h-2 w-[55%] rounded bg-white/[.06]" />
              </div>
            ))}
          </div>
        </div>
        {/* Kursor */}
        <svg aria-hidden className="hs-cursor absolute h-5 w-5 text-white drop-shadow" viewBox="0 0 24 24" fill="currentColor"><path d="M4 2l16 9-7 2-3 7z" /></svg>
      </Frame>
      {/* Mobil versiya */}
      <div className="hs-build absolute -bottom-6 -left-4 w-[26%] min-w-[96px] rounded-[1.4rem] border border-white/15 bg-bg p-1.5 shadow-[0_30px_60px_-20px_rgba(0,0,0,.9)] sm:-left-8" style={{ animationDelay: '1.1s' }}>
        <div className="rounded-[1.1rem] bg-surface p-2.5">
          <div className="mx-auto h-1 w-8 rounded-full bg-white/15" />
          <div className="mt-3 h-2.5 w-[85%] rounded bg-white/10" /><div className="mt-1.5 h-2.5 w-[60%] rounded bg-white/10" />
          <div className="mt-3 h-4 w-[70%] rounded-full bg-brand" />
          <div className="mt-3 space-y-1.5">{[0, 1, 2].map((i) => <div key={i} className="h-6 rounded-md bg-white/[.04]" />)}</div>
        </div>
      </div>
    </div>
  );
}

/** SEO: axtarış nəticələri — sizin sayt yuxarı qalxır */
function SeoVisual({ q, you }: { q: string; you: string }) {
  const rows = [0, 1, 2, 3];
  return (
    <Frame title="google.com / search">
      <div className="absolute inset-0 p-5 sm:p-7">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[.04] px-4 py-2.5">
          <Search size={15} className="text-muted" />
          <span className="hs-type overflow-hidden whitespace-nowrap font-mono text-[.8rem] text-fg">{q}</span>
        </div>
        <div className="relative mt-5 h-[calc(100%-64px)]">
          {rows.map((i) => (
            <div key={i} className="hs-shift absolute inset-x-0 rounded-xl border border-transparent p-3" style={{ ['--from' as any]: `${i * 22}%`, ['--to' as any]: `${(i + 1) * 22}%`, top: `${(i + 1) * 22}%` }}>
              <div className="h-2 w-24 rounded bg-white/[.07]" />
              <div className="mt-2 h-3 w-[70%] rounded bg-white/[.12]" />
              <div className="mt-1.5 h-2 w-[88%] rounded bg-white/[.05]" />
            </div>
          ))}
          {/* Sizin sayt: aşağıdan birinci yerə qalxır */}
          <div className="hs-climb absolute inset-x-0 rounded-xl border border-brand/50 bg-brand-soft p-3 shadow-[0_0_40px_-10px_rgba(61,255,168,.5)]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[.68rem] text-brand">digiterial.com › {you.toLowerCase()}</span>
              <span className="hs-rank grid h-6 min-w-6 place-items-center rounded-full bg-brand px-1.5 font-mono text-[.7rem] font-semibold text-onbrand">#1</span>
            </div>
            <div className="mt-1.5 text-[.9rem] font-semibold text-fg">{you}</div>
            <div className="mt-1.5 h-2 w-[80%] rounded bg-brand/20" />
          </div>
        </div>
      </div>
    </Frame>
  );
}

/** Reklam: huni — göstərimdən satışa */
function AdsVisual({ x }: { x: Record<string, string> }) {
  const steps = [{ k: x.f1, w: 100 }, { k: x.f2, w: 72 }, { k: x.f3, w: 46 }, { k: x.f4, w: 28 }];
  return (
    <Frame title={`ads / ${x.ch?.toLowerCase()}`}>
      <div className="absolute inset-0 flex flex-col p-5 sm:p-7">
        <div className="flex gap-2">
          {['Google Ads', 'Meta Ads'].map((c, i) => <span key={c} className={`rounded-full px-3 py-1 font-mono text-[.68rem] ${i === 0 ? 'bg-brand text-onbrand' : 'border border-white/15 text-muted'}`}>{c}</span>)}
        </div>
        <div className="mt-6 flex flex-1 flex-col justify-center gap-3">
          {steps.map((s, i) => (
            <div key={s.k} className="flex items-center gap-4">
              <span className="w-24 shrink-0 text-right text-[.8rem] text-muted">{s.k}</span>
              <div className="h-9 flex-1">
                <div className="hs-bar flex h-full items-center rounded-lg bg-gradient-to-r from-brand/25 to-brand/70 px-3" style={{ width: `${s.w}%`, animationDelay: `${.2 + i * .18}s` }}>
                  <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_10px_rgba(61,255,168,.9)]" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <svg aria-hidden viewBox="0 0 300 60" className="mt-4 h-14 w-full">
          <path className="hs-line" d="M0 50 C40 48 60 40 90 38 S150 30 180 22 S240 12 300 6" fill="none" stroke="#3DFFA8" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    </Frame>
  );
}

/* ─────────────── Slayder ─────────────── */

export default function HeroSlider({ slides, labels }: { slides: HeroSlide[]; labels: Labels }) {
  const n = slides.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [progress, setProgress] = useState(0);
  const start = useRef(0);
  const elapsed = useRef(0);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback((d: number) => { setI((v) => (v + d + n) % n); elapsed.current = 0; setProgress(0); }, [n]);
  const to = useCallback((k: number) => { setI(k); elapsed.current = 0; setProgress(0); }, []);

  useEffect(() => { setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);

  // Avtomatik keçid + progress (hover, fokus, tab gizli və ya reduced-motion zamanı dayanır)
  const running = !paused && !hover && !reduced;
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    start.current = performance.now() - elapsed.current;
    const tick = (now: number) => {
      if (document.hidden) { start.current = now - elapsed.current; raf = requestAnimationFrame(tick); return; }
      elapsed.current = now - start.current;
      const p = Math.min(1, elapsed.current / DURATION);
      setProgress(p);
      if (p >= 1) { go(1); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, i, go]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  };

  const s = slides[i];
  return (
    <section
      aria-roledescription="carousel" aria-label={labels.label} onKeyDown={onKey}
            onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
      onTouchEnd={(e) => {
        const t = touch.current; touch.current = null; if (!t) return;
        const dx = e.changedTouches[0].clientX - t.x, dy = e.changedTouches[0].clientY - t.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
      }}
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-24 md:pt-28"
    >
      {/* Fon: grid + slayda görə yer dəyişən işıq */}
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,#000_60%,transparent)]" />
      <div aria-hidden className="pointer-events-none absolute h-[720px] w-[720px] rounded-full bg-brand/[.10] blur-[130px] transition-all duration-[1400ms] ease-out"
        style={{ left: `${[55, 65, 40, 70][i % 4]}%`, top: `${[-25, -10, -30, 5][i % 4]}%` }} />

      <div className="wrap relative grid flex-1 items-center gap-12 py-8 lg:grid-cols-12 lg:gap-10">
        {/* Mətn */}
        <div className="min-h-[430px] sm:min-h-[400px] lg:col-span-6 lg:flex lg:min-h-[520px] lg:flex-col lg:justify-center" aria-live={running ? 'off' : 'polite'}>
          {slides.map((sl, k) => (
            <div key={sl.key} role="group" aria-roledescription="slide" aria-label={`${k + 1} / ${n}: ${sl.nav}`} hidden={k !== i}>
              {k === i && (
                <div key={`t-${i}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    {k === 0 && <span className="pill-live fade-up d1"><span className="live-dot" />{labels.available}</span>}
                    <span className="eyebrow fade-up d1">{sl.tag}</span>
                  </div>
                  {k === 0
                    ? <h1 className="t-hero mt-7 max-w-[13ch]"><WordReveal text={sl.h} delay={120} /></h1>
                    : <h2 className="t-hero mt-7 max-w-[13ch]"><WordReveal text={sl.h} delay={60} /></h2>}
                  <p className="t-lead fade-up d4 mt-8 max-w-[52ch]">{sl.p}</p>
                  <div className="fade-up d5 mt-10 flex flex-wrap gap-3">
                    <Link href={sl.b1Href} className="btn-accent">{sl.b1} <ArrowRight size={18} className="arr" /></Link>
                    {sl.b2 && sl.b2Href && <Link href={sl.b2Href} className="btn-ghost">{sl.b2}</Link>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Vizual */}
        <div className="relative lg:col-span-6 lg:pl-6">
          <div key={`v-${i}`} className="hs-visual">
            {s.key === 'growth' && <GrowthVisual l={labels} />}
            {s.key === 'web' && <WebVisual />}
            {s.key === 'seo' && <SeoVisual q={s.extra?.q || ''} you={s.extra?.you || ''} />}
            {s.key === 'ads' && <AdsVisual x={s.extra || {}} />}
          </div>
        </div>
      </div>

      {/* Naviqasiya: progress tabları + oxlar */}
      <div className="wrap relative pb-8 pr-[76px] sm:pr-[84px] lg:pr-[92px]">
        <div className="flex items-end gap-4 border-t border-[color:var(--line)] pt-5">
          <div role="tablist" aria-label={labels.label} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={() => setHover(false)} className="grid flex-1 grid-cols-4 gap-2 sm:gap-4">
            {slides.map((sl, k) => (
              <button key={sl.key} role="tab" aria-selected={k === i} aria-label={`${k + 1}. ${sl.nav}`} onClick={() => to(k)}
                className={`group text-left transition-colors ${k === i ? 'text-fg' : 'text-muted hover:text-fg'}`}>
                <span className="relative block h-[3px] overflow-hidden rounded-full bg-white/10">
                  <span className="absolute inset-y-0 left-0 rounded-full bg-brand shadow-[0_0_12px_rgba(61,255,168,.7)]"
                    style={{ width: k < i ? '100%' : k === i ? `${(reduced ? 1 : progress) * 100}%` : '0%', transition: k === i ? 'none' : 'width .4s' }} />
                </span>
                <span className="mt-3 hidden items-baseline gap-2 sm:flex">
                  <span className="font-mono text-[.7rem] text-muted">0{k + 1}</span>
                  <span className="text-[.88rem] font-medium">{sl.nav}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button type="button" onClick={() => setPaused((v) => !v)} aria-label={paused ? labels.play : labels.pause}
              className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--line-2)] text-muted transition hover:border-fg hover:text-fg">
              {paused ? <Play size={14} /> : <Pause size={14} />}
            </button>
            <button type="button" onClick={() => go(-1)} aria-label={labels.prev} className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--line-2)] transition hover:border-fg"><ArrowLeft size={16} /></button>
            <button type="button" onClick={() => go(1)} aria-label={labels.next} className="grid h-10 w-10 place-items-center rounded-full bg-brand text-onbrand transition hover:bg-brand-dark"><ArrowRight size={16} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
