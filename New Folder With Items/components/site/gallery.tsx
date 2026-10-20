'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';

export default function Gallery({ images, title = '' }: { images: string[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const n = images?.length || 0;
  const go = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + n) % n)), [n]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => { window.removeEventListener('keydown', onKey); document.documentElement.style.overflow = ''; lastFocus.current?.focus(); };
  }, [open, go]);

  if (!n) return null;
  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {images.map((src, i) => (
          <button key={i} type="button" onClick={(e) => { lastFocus.current = e.currentTarget; setOpen(i); }}
            aria-label={`${title} — ${i + 1} / ${n}`}
            className={`img-zoom group relative overflow-hidden rounded-2xl border border-[color:var(--line)] bg-surface ${i % 5 === 0 ? 'col-span-2 md:row-span-2' : ''}`}>
            <img src={src} alt="" loading="lazy" decoding="async" className="aspect-square h-full w-full object-cover" />
            <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-surface text-fg opacity-0 backdrop-blur transition group-hover:opacity-100"><Expand size={15} /></span>
          </button>
        ))}
      </div>

      {open !== null && (
        <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/95 p-4 backdrop-blur" onClick={() => setOpen(null)}>
          <button ref={closeRef} type="button" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-brand hover:text-onbrand" aria-label="Close"><X size={20} /></button>
          {n > 1 && <button type="button" className="absolute left-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-brand hover:text-onbrand md:left-8" aria-label="Previous" onClick={(e) => { e.stopPropagation(); go(-1); }}><ChevronLeft size={22} /></button>}
          <img src={images[open]} alt="" className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
          {n > 1 && <button type="button" className="absolute right-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-brand hover:text-onbrand md:right-8" aria-label="Next" onClick={(e) => { e.stopPropagation(); go(1); }}><ChevronRight size={22} /></button>}
          <div className="absolute bottom-5 font-mono text-xs text-white/60">{open + 1} / {n}</div>
        </div>
      )}
    </>
  );
}
