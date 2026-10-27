'use client';
import { useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';

// Saytın bütün scroll və hover animasiyaları. Hər səhifə keçidində yenidən qurulur.
const REVEAL = '.split-h,.sec-head .lead,.svc li,.q,.score,.next-case,.step,.stack span,.principles div,.post,details,.contact-grid>*,.card-i,.compare>div,.cta-band .inner>*,.rv,.deliv li,.oth,.wcard,.ind-card,.prob>div,.sol-row,.factors>div,.gl-item,.svc-row,.bn-card';
const CLIP = '.case-visual,.wcard .img,.inbox,.gal img';
const TILT = '.wcard,.ind-card,.model,.bn-card';
const PARALLAX: [string, number][] = [['.board-wrap', -0.06], ['.sp-hero .panel', -0.05], ['.cta-band h2', 0.05], ['.contact h2', 0.04]];
const GLYPHS = 'ABCDEFGHİJKLMNOPRSTUVYZƏĞÖÜŞÇ0123456789/#_';

function scramble(el: HTMLElement) {
  const text = el.dataset.text || el.textContent || '';
  el.dataset.text = text;
  if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', text);
  const start = performance.now(), dur = 700;
  const step = (t: number) => {
    const k = Math.min((t - start) / dur, 1);
    const fixed = Math.floor(text.length * k);
    el.textContent = text.split('').map((c, i) => (i < fixed || c === ' ' || c === '·' ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('');
    if (k < 1) requestAnimationFrame(step); else el.textContent = text;
  };
  requestAnimationFrame(step);
}

export default function Motion({ locale }: { locale: string }) {
  const pathname = usePathname();

  useEffect(() => { document.documentElement.lang = locale; }, [locale]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    const vh = window.innerHeight;
    const off: (() => void)[] = [];
    const inHero = (el: Element) => !!el.closest('.hero,.sp-hero,.mega,header');

    // 1) Görünmə: aşağıdan qalxma, şəkil pərdəsi, etiket hərfləri, footer yazısı
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        const t = e.target as HTMLElement;
        t.classList.remove('pre', 'clip-pre', 'wm-pre');
        t.classList.add('lit');
        if (t.classList.contains('label')) scramble(t);
        io.unobserve(t);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

    const groups = new Map<Element, number>();
    document.querySelectorAll<HTMLElement>(REVEAL).forEach((t) => {
      if (inHero(t)) return;
      if (t.getBoundingClientRect().top < vh) { t.classList.add('lit'); return; }
      const p = t.parentElement!;
      const g = groups.get(p) || 0;
      groups.set(p, g + 1);
      t.style.setProperty('--d', Math.min(g, 6) * 0.08 + 's');
      t.classList.add('reveal', 'pre');
      io.observe(t);
    });
    document.querySelectorAll<HTMLElement>(CLIP).forEach((t) => {
      if (inHero(t) || t.getBoundingClientRect().top < vh) return;
      t.classList.add('clip-pre');
      io.observe(t);
    });
    document.querySelectorAll<HTMLElement>('main section:not(.hero):not(.sp-hero) .label').forEach((t) => {
      if (t.getBoundingClientRect().top < vh || t.closest('.board,.panel,.case-meta,.post,.wcard')) return;
      io.observe(t);
    });
    document.querySelectorAll<HTMLElement>('.wordmark').forEach((t) => { t.classList.add('wm-pre'); io.observe(t); });
    document.querySelectorAll('.step').forEach((s) => { if (s.getBoundingClientRect().top < vh) s.classList.add('lit'); });

    // 2) Parallaks
    const par = PARALLAX.flatMap(([sel, sp]) => Array.from(document.querySelectorAll<HTMLElement>(sel)).map((el) => ({ el, sp })));
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        par.forEach(({ el, sp }) => {
          const r = el.getBoundingClientRect();
          const c = r.top + r.height / 2 - window.innerHeight / 2;
          el.style.translate = `0 ${(c * sp).toFixed(1)}px`;
        });
      });
    };
    if (par.length) { onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); off.push(() => { window.removeEventListener('scroll', onScroll); par.forEach(({ el }) => { el.style.translate = ''; }); }); }

    if (fine) {
      // 3) Maqnit düymələr
      document.querySelectorAll<HTMLElement>('.btn').forEach((b) => {
        const move = (e: PointerEvent) => {
          const r = b.getBoundingClientRect();
          b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px,${(e.clientY - r.top - r.height / 2) * 0.28}px)`;
        };
        const leave = () => { b.style.transform = ''; };
        b.addEventListener('pointermove', move);
        b.addEventListener('pointerleave', leave);
        off.push(() => { b.removeEventListener('pointermove', move); b.removeEventListener('pointerleave', leave); b.style.transform = ''; });
      });

      // 4) Kartların 3D əyilməsi və parıltı
      document.querySelectorAll<HTMLElement>(TILT).forEach((c) => {
        c.classList.add('tilt');
        const move = (e: PointerEvent) => {
          const r = c.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          c.style.setProperty('--gx', `${px * 100}%`);
          c.style.setProperty('--gy', `${py * 100}%`);
          c.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 7}deg) rotateY(${(px - 0.5) * 9}deg) translateY(-4px)`;
        };
        const leave = () => { c.style.transform = ''; };
        c.addEventListener('pointermove', move);
        c.addEventListener('pointerleave', leave);
        off.push(() => { c.removeEventListener('pointermove', move); c.removeEventListener('pointerleave', leave); c.style.transform = ''; c.classList.remove('tilt'); });
      });

      // 5) Xidmətlər siyahısında kursoru izləyən ikon
      document.querySelectorAll<HTMLElement>('.svc').forEach((list) => {
        const fl = document.createElement('div');
        fl.className = 'svc-float';
        fl.setAttribute('aria-hidden', 'true');
        list.appendChild(fl);
        let tx = 0, ty = 0, cx = 0, cy = 0, loop = 0, current: Element | null = null;
        const tick = () => { cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2; fl.style.left = `${cx}px`; fl.style.top = `${cy}px`; loop = requestAnimationFrame(tick); };
        const move = (e: PointerEvent) => {
          const r = list.getBoundingClientRect();
          tx = e.clientX - r.left; ty = e.clientY - r.top;
          const li = (e.target as Element).closest('li');
          if (li && li !== current) { current = li; fl.innerHTML = li.querySelector('.svc-ic')?.innerHTML || ''; }
          if (!loop) { cx = tx; cy = ty; loop = requestAnimationFrame(tick); }
          fl.classList.add('on');
        };
        const leave = () => { fl.classList.remove('on'); cancelAnimationFrame(loop); loop = 0; current = null; };
        list.addEventListener('pointermove', move);
        list.addEventListener('pointerleave', leave);
        off.push(() => { list.removeEventListener('pointermove', move); list.removeEventListener('pointerleave', leave); cancelAnimationFrame(loop); fl.remove(); });
      });
    }

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      off.forEach((f) => f());
      document.querySelectorAll('.pre,.clip-pre,.wm-pre').forEach((el) => el.classList.remove('pre', 'clip-pre', 'wm-pre'));
    };
  }, [pathname]);

  return null;
}
