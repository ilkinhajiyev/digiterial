'use client';
import { useEffect, useRef, useState } from 'react';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el || reduced()) return;
    el.classList.add('reveal');
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [disp, setDisp] = useState(value);
  useEffect(() => {
    const m = value.match(/^([^\d-]*)(-?[\d.,]+)(.*)$/);
    if (!m || reduced()) { setDisp(value); return; }
    const pre = m[1], numStr = m[2].replace(/,/g, ''), suf = m[3];
    const target = parseFloat(numStr); const decimals = (numStr.split('.')[1] || '').length;
    const el = ref.current; if (!el) return;
    let started = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        started = true; const dur = 1400, t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur); const eased = 1 - Math.pow(1 - p, 3);
          setDisp(pre + (target * eased).toFixed(decimals) + suf);
          if (p < 1) requestAnimationFrame(tick); else setDisp(value);
        };
        requestAnimationFrame(tick); io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <span ref={ref}>{disp}</span>;
}

export function Marquee({ items, className = '', sep = '·' }: { items: string[]; className?: string; sep?: string }) {
  const seq = [...items, ...items];
  return (
    <div className={`marquee ${className}`}>
      <div className="marquee-track">
        {seq.map((t, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="px-5">{t}</span><span className="opacity-50">{sep}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function BakuClock() {
  const [t, setT] = useState('--:--:--');
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Baku' }));
    f(); const id = setInterval(f, 1000); return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{t}</span>;
}
