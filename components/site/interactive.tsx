'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from '@/i18n/navigation';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el || reduced()) return;
    el.classList.add('reveal');
    if (delay) el.style.transitionDelay = `${delay}ms`;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return <div ref={ref} className={className}>{children}</div>;
}

/** Uşaqları avtomatik olaraq index əsaslı gecikmə ilə Reveal edir — kaskad effekti */
export function Stagger({ children, className = '', step = 80, itemClassName = '' }: { children: React.ReactNode[]; className?: string; step?: number; itemClassName?: string }) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal key={i} delay={i * step} className={itemClassName}>{child}</Reveal>
      ))}
    </div>
  );
}

/** Fərə görə yüngül 3D əyilmə effekti (magnetik kart hiss) */
export function Tilt({ children, className = '', max = 8 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    const el = ref.current; if (!el || reduced()) return;
    const onMove = (e: MouseEvent) => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(0)`;
      });
    };
    const onLeave = () => { el.style.transform = ''; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); if (raf.current) cancelAnimationFrame(raf.current); };
  }, [max]);
  return <div ref={ref} className={`tilt ${className}`}>{children}</div>;
}

/** Kursoru izləyən incə işıq ləkəsi — premium hiss */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced() || typeof window === 'undefined' || window.matchMedia('(hover: none)').matches) return;
    const el = ref.current; if (!el) return;
    let raf: number | null = null;
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    const apply = () => { if (el) el.style.transform = `translate(${x}px, ${y}px)`; };
    const onMove = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => { apply(); raf = null; });
    };
    window.addEventListener('mousemove', onMove);
    return () => { window.removeEventListener('mousemove', onMove); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} className="cursor-glow" aria-hidden />;
}

/** Səhifələr arası keçiddə incə fade/rise animasiyası */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <div key={pathname} className="page-in">{children}</div>;
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
