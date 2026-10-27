'use client';
import { useEffect, useRef } from 'react';
import { useT } from '@/lib/i18n/client';

// Xidmətlər zolağı: scroll sürətinə görə sürətlənir və istiqamətini dəyişir
export default function Ticker({ items }: { items: string[] }) {
  const t = useT();
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const tr = track.current;
    if (!tr || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    tr.style.animation = 'none';
    let tx = 0, dir = 1, boost = 0, vel = 0, last = window.scrollY, raf = 0;
    const onScroll = () => { vel = window.scrollY - last; last = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });
    const loop = () => {
      boost = boost * 0.92 + Math.min(Math.abs(vel), 60) * 0.08;
      if (vel) dir = vel > 0 ? 1 : -1;
      vel *= 0.5;
      tx -= dir * (0.6 + boost * 0.25);
      const w = tr.scrollWidth / 2;
      if (tx <= -w) tx += w;
      if (tx > 0) tx -= w;
      tr.style.transform = `translateX(${tx}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); };
  }, []);
  const loc = items.map((x) => t(x));
  const all = [...loc, ...loc];
  return (
    <section className="ticker" aria-label={t('Xidmətlər')}>
      <p className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{loc.join(', ')}</p>
      <div className="ticker-track" ref={track} aria-hidden="true">{all.map((x, i) => <span key={i}>{x}</span>)}</div>
    </section>
  );
}
