'use client';
import { useEffect, useRef } from 'react';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * "Signal Field" — nöqtə matrisi + böyümə xətti (Canvas 2D, kitabxanasız).
 * Kursora yaxın nöqtələr böyüyür və kobalt rəngə keçir (maqnit sahəsi effekti);
 * fonda yumşaq dalğa, üstündə tədricən çəkilən böyümə əyrisi.
 * Ekrandan çıxanda dayanır, reduced-motion-da statik kadr.
 */
export function SignalField({ className = '', labels = [] as string[] }: { className?: string; labels?: string[] }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const still = reduced();
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true, t0 = performance.now();
    const m = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    // Böyümə əyrisi: soldan sağa yüksələn, kiçik dalğalanmalı
    const curve = (u: number, t: number) => {
      const base = Math.pow(u, 1.7);
      const wob = Math.sin(u * 9 + t * .6) * .025 * (1 - u) + Math.sin(u * 23 - t) * .008;
      return h * .86 - (base + wob) * h * .68;
    };

    const draw = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const t = still ? 2 : (now - t0) / 1000;
      m.x += (m.tx - m.x) * .12; m.y += (m.ty - m.y) * .12;
      ctx.clearRect(0, 0, w, h);

      const gap = w < 480 ? 18 : 22;
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const dx = x - m.x, dy = y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const near = Math.max(0, 1 - dist / 150);
          const wave = (Math.sin(x * .018 + t * 1.2) + Math.sin(y * .022 - t * .9)) * .25 + .5;
          const under = y > curve(x / w, t) ? 1 : 0;
          const r = .9 + wave * .55 + near * 2.4 + under * .35;
          const a = .1 + wave * .08 + near * .75 + under * .1;
          ctx.fillStyle = near > .05 || under ? `rgba(61,255,168,${Math.min(1, a + (under ? .1 : 0))})` : `rgba(255,255,255,${a * .8})`;
          ctx.beginPath(); ctx.arc(x + dx * -near * .12, y + dy * -near * .12, r, 0, Math.PI * 2); ctx.fill();
        }
      }

      // Böyümə xətti (tədricən çəkilir, sonra "nəfəs alır")
      const prog = still ? 1 : Math.min(1, t / 2.4);
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, 'rgba(61,255,168,0)'); grad.addColorStop(.25, 'rgba(61,255,168,.9)'); grad.addColorStop(1, 'rgba(61,255,168,1)');
      ctx.strokeStyle = grad; ctx.lineWidth = 2.5; ctx.shadowColor = 'rgba(61,255,168,.6)'; ctx.shadowBlur = 14; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.beginPath();
      const steps = 120;
      for (let i = 0; i <= steps * prog; i++) { const u = i / steps; const y = curve(u, t); i ? ctx.lineTo(u * w, y) : ctx.moveTo(u * w, y); }
      ctx.stroke(); ctx.shadowBlur = 0;

      // Qeyd nöqtələri və etiketlər
      const marks = [.28, .58, .9];
      marks.forEach((u, i) => {
        if (u > prog) return;
        const x = u * w, y = curve(u, t);
        ctx.fillStyle = '#050506'; ctx.strokeStyle = '#3DFFA8'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
        const label = labels[i]; if (!label) return;
        ctx.font = '500 12px "Inter Tight Variable", system-ui, sans-serif';
        const tw = ctx.measureText(label).width + 20, bx = Math.min(w - tw - 8, Math.max(8, x - tw / 2)), by = y - 42;
        ctx.fillStyle = '#3DFFA8'; ctx.beginPath(); (ctx as any).roundRect ? (ctx as any).roundRect(bx, by, tw, 26, 13) : ctx.rect(bx, by, tw, 26); ctx.fill();
        ctx.fillStyle = '#02140B'; ctx.fillText(label, bx + 10, by + 17);
      });

      if (!still) raf = requestAnimationFrame(draw);
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(draw); };
    const onMove = (e: PointerEvent) => { const r = c.getBoundingClientRect(); m.tx = e.clientX - r.left; m.ty = e.clientY - r.top; };
    const onLeave = () => { m.tx = -9999; m.ty = -9999; };
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) start(); });
    const ro = new ResizeObserver(() => { resize(); if (still) start(); });
    io.observe(c); ro.observe(c);
    c.addEventListener('pointermove', onMove); c.addEventListener('pointerleave', onLeave);
    const onVis = () => { if (!document.hidden) start(); };
    document.addEventListener('visibilitychange', onVis);
    resize(); start();
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); c.removeEventListener('pointermove', onMove); c.removeEventListener('pointerleave', onLeave); document.removeEventListener('visibilitychange', onVis); };
  }, [labels.join('|')]);

  return <canvas ref={ref} aria-hidden className={`block h-full w-full touch-pan-y ${className}`} />;
}
