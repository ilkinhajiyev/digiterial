'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from '@/i18n/navigation';
import { useT } from '@/lib/i18n/client';

// Siçanı izləyən halqa: linklərdə böyüyür, kartlarda "Bax" yazısı göstərir. Yalnız siçanlı cihazlarda.
const CARDS = '.case,.wcard,.post,.oth,.next-case';
const LINKS = 'a,button,summary,label,input,select,textarea';

export default function Cursor() {
  const tr = useT();
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const r = ring.current, d = dot.current;
    if (!r || !d) return;
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('has-cursor');
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      d.style.transform = `translate(${x}px,${y}px)`;
      const t = e.target as Element;
      const card = t.closest?.(CARDS);
      r.classList.toggle('card', !!card);
      r.classList.toggle('link', !card && !!t.closest?.(LINKS));
      r.classList.remove('off');
    };
    const leave = () => r.classList.add('off');
    const down = () => r.classList.add('down');
    const up = () => r.classList.remove('down');
    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      r.style.transform = `translate(${rx}px,${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  // Səhifə dəyişəndə vəziyyəti sıfırla
  useEffect(() => { ring.current?.classList.remove('card', 'link'); }, [pathname]);

  return (
    <>
      <div className="cur-ring off" ref={ring} aria-hidden="true"><span>{tr('Bax')}</span></div>
      <div className="cur-dot" ref={dot} aria-hidden="true" />
    </>
  );
}
