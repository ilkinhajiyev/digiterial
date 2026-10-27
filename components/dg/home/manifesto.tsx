'use client';
import { useEffect, useRef } from 'react';
import { useT } from '@/lib/i18n/client';

// Scroll etdikcə söz-söz işıqlanan manifest mətni
const TEXT = 'Gözəl görünmək azdır. Hər sayt, hər kampaniya və hər məktub bir işə xidmət etməlidir:';
const GOLD = 'müştəri gətirmək.';
const TAIL = 'Biz dizaynı strategiya ilə, kreativi rəqəmlə birləşdiririk.';

export default function Manifesto() {
  const t = useT();
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    const ws = Array.from(p.querySelectorAll<HTMLElement>('.w'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { ws.forEach((w) => w.classList.add('on')); return; }
    let raf = 0;
    const upd = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = p.getBoundingClientRect();
        const k = Math.max(0, Math.min(1, (window.innerHeight * 0.82 - r.top) / (r.height + window.innerHeight * 0.3)));
        const n = Math.round(k * ws.length);
        ws.forEach((w, i) => w.classList.toggle('on', i < n));
      });
    };
    upd();
    window.addEventListener('scroll', upd, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', upd); };
  }, []);
  const words = (s: string, g?: boolean) => s.split(' ').map((w, i) => <span key={(g ? 'g' : '') + i + w}><span className={`w${g ? ' g' : ''}`}>{w}</span> </span>);
  return (
    <section className="manifesto">
      <div className="wrap">
        <span className="eyebrow">{t('Yanaşmamız')}</span>
        <p ref={ref} aria-label={`${t(TEXT)} ${t(GOLD)} ${t(TAIL)}`}>
          <span aria-hidden="true">{words(t(TEXT))}{words(t(GOLD), true)}{words(t(TAIL))}</span>
        </p>
        <div className="sig"><span />{t('Digiterial komandası')}</div>
      </div>
    </section>
  );
}
