'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Böyük manifest mətni: scroll etdikcə sözlər bir-bir işıqlanır. */
export function ScrollWords({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const segs = String(text || '').split(/\*([^*]+)\*/g);
  const words: { w: string; accent: boolean }[] = [];
  segs.forEach((s, i) => s.split(/\s+/).filter(Boolean).forEach((w) => words.push({ w, accent: i % 2 === 1 })));

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>('[data-w]'));
    if (reduced()) { spans.forEach((s) => (s.style.opacity = '1')); return; }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect(), vh = window.innerHeight;
      // 0 → mətn ekranın aşağısında, 1 → ekranın ortasından keçib
      const p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .35)));
      const lit = p * spans.length * 1.15;
      spans.forEach((s, i) => { s.style.opacity = String(Math.min(1, Math.max(.2, lit - i + .2))); });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, [text]);

  return (
    <p ref={ref} className={`scroll-words ${className}`} aria-label={text.replace(/\*/g, '')}>
      {words.map((x, i) => (
        <span key={i} aria-hidden data-w style={{ opacity: .2 }}>{x.accent ? <em>{x.w}</em> : x.w}{' '}</span>
      ))}
    </p>
  );
}

/** Uşaq elementlərdə siçan mövqeyini --mx/--my kimi yazır (.spot effekti üçün). */
export function Spotlight({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className} onPointerMove={(e) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('.spot'); if (!t) return;
      const r = t.getBoundingClientRect();
      t.style.setProperty('--mx', `${e.clientX - r.left}px`); t.style.setProperty('--my', `${e.clientY - r.top}px`);
    }}>{children}</div>
  );
}

type Svc = { slug: string; title: string; short: string; tag: string };
const MATERIALS = [
  'radial-gradient(circle at 30% 25%, #fff3dc 0%, #e7b76a 22%, #6b4f2a 52%, #17130e 80%)',
  'radial-gradient(circle at 70% 30%, #e9e6ff 0%, #9c8cff 24%, #3b3170 55%, #110f1c 82%)',
  'conic-gradient(from 210deg at 50% 50%, #2a2622, #e7b76a, #fff6e6, #8a6a3f, #2a2622)',
  'radial-gradient(circle at 40% 70%, #ffe1d3 0%, #ff8a5b 22%, #6d2f1c 55%, #140b08 82%)',
  'linear-gradient(135deg, #0f0f12 0%, #3a3a44 35%, #d8d4cc 50%, #3a3a44 65%, #0f0f12 100%)',
  'radial-gradient(circle at 60% 40%, #dcfff0 0%, #6fe0b0 22%, #1f5a45 55%, #08130f 82%)',
];

/** Xidmətlər indeksi: böyük serif sətirlər + kursoru izləyən "material" önizləmə. */
export function ServicesIndex({ items, more }: { items: Svc[]; more: string }) {
  const [active, setActive] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0 });

  useEffect(() => () => cancelAnimationFrame(pos.current.raf), []);
  const loop = () => {
    const p = pos.current;
    p.x += (p.tx - p.x) * .14; p.y += (p.ty - p.y) * .14;
    if (box.current) box.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
    p.raf = requestAnimationFrame(loop);
  };

  return (
    <div className="relative" onPointerMove={(e) => {
      if (e.pointerType !== 'mouse') return;
      const r = e.currentTarget.getBoundingClientRect();
      pos.current.tx = e.clientX - r.left; pos.current.ty = e.clientY - r.top;
      if (!pos.current.raf) { pos.current.x = pos.current.tx; pos.current.y = pos.current.ty; loop(); }
    }} onPointerLeave={() => { setActive(null); cancelAnimationFrame(pos.current.raf); pos.current.raf = 0; }}>
      <ul className="border-t border-[color:var(--line)]">
        {items.map((s, i) => (
          <li key={s.slug}>
            <Link href={`/xidmetler/${s.slug}`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}
              className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-[color:var(--line)] py-7 transition-colors duration-500 md:grid-cols-[5rem_1fr_16rem_3rem] md:py-9">
              <span className="font-mono text-xs text-ash transition group-hover:text-brand">({String(i + 1).padStart(2, '0')})</span>
              <span className={`font-display text-[clamp(2rem,5.2vw,4.6rem)] leading-[.95] tracking-[-.02em] transition-[color,transform] duration-700 ease-out group-hover:translate-x-3 ${active !== null && active !== i ? 'text-white/25' : 'text-bone'}`}>
                {s.title}
              </span>
              <span className="hidden text-[.9rem] leading-relaxed text-ash md:block">{s.short}</span>
              <span className="grid h-11 w-11 place-items-center rounded-full border border-[color:var(--line-2)] transition duration-500 group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand group-hover:text-ink">
                <ArrowUpRight size={18} /><span className="sr-only">{more}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {/* Kursoru izləyən önizləmə (yalnız masaüstü) */}
      <div ref={box} aria-hidden className={`pointer-events-none absolute left-0 top-0 z-10 hidden h-64 w-52 overflow-hidden rounded-[1.25rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,.9)] transition-[opacity,scale] duration-500 ease-out lg:block ${active === null ? 'scale-75 opacity-0' : 'scale-100 opacity-100'}`}>
        {items.map((s, i) => (
          <div key={s.slug} className={`absolute inset-0 flex flex-col justify-between p-5 transition-opacity duration-500 ${active === i ? 'opacity-100' : 'opacity-0'}`} style={{ background: MATERIALS[i % MATERIALS.length] }}>
            <span className="font-mono text-[.65rem] uppercase tracking-[.2em] text-white/80 mix-blend-difference">{s.tag}</span>
            <span className="font-display text-3xl italic text-white mix-blend-difference">{String(i + 1).padStart(2, '0')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Kartın siçana görə yüngül 3D əyilməsi. */
export function Tilt({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className={`transition-transform duration-700 ease-out [transform-style:preserve-3d] ${className}`}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || reduced()) return;
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        e.currentTarget.style.transform = `perspective(1200px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      }}
      onPointerLeave={(e) => { e.currentTarget.style.transform = ''; }}>
      {children}
    </div>
  );
}
