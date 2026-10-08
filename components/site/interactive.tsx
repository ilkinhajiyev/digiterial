'use client';
import { useEffect, useRef, useState } from 'react';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function Reveal({ children, className = '', as: Tag = 'div' }: { children: React.ReactNode; className?: string; as?: any }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (reduced()) { el.classList.add('in'); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className={`reveal ${className}`}>{children}</Tag>;
}

export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [disp, setDisp] = useState(value);
  useEffect(() => {
    const m = value.match(/^([^\d-]*)(-?[\d.,]+)(.*)$/);
    const el = ref.current;
    if (!m || !el || reduced()) return;
    const pre = m[1], numStr = m[2].replace(/,/g, ''), suf = m[3];
    const target = parseFloat(numStr); const decimals = (numStr.split('.')[1] || '').length;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), dur = 1300;
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
        setDisp(pre + (target * eased).toFixed(decimals) + suf);
        if (p < 1) raf = requestAnimationFrame(tick); else setDisp(value);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);
  return <span ref={ref}>{disp}</span>;
}

export function Marquee({ items, className = '', sep = '✦', itemClass = '', sepClass = 'text-brand' }: { items: string[]; className?: string; sep?: string; itemClass?: string; sepClass?: string }) {
  if (!items?.length) return null;
  const seq = [...items, ...items, ...items, ...items];
  return (
    <div className={`marquee ${className}`} aria-hidden>
      <div className="marquee-track" aria-hidden>
        {seq.map((t, i) => (
          <span key={i} className="inline-flex items-center">
            <span className={`px-[.35em] ${itemClass}`}>{t}</span><span className={sepClass}>{sep}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function BakuClock() {
  const [t, setT] = useState('');
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Baku' }));
    f(); const id = setInterval(f, 15_000); return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning className="tabular-nums">{t || '--:--'}</span>;
}
