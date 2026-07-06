'use client';
import { useEffect, useState } from 'react';

export default function Gallery({ images }: { images: string[] }) {
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((o) => (o === null ? o : (o + 1) % images.length));
      if (e.key === 'ArrowLeft') setOpen((o) => (o === null ? o : (o - 1 + images.length) % images.length));
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, images.length]);

  if (!images?.length) return null;
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <button key={i} onClick={() => setOpen(i)}
            className={`relative overflow-hidden rounded-2xl group ${i % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
            <img src={src} alt={`Şəkil ${i + 1}`} loading="lazy"
              className="w-full h-full object-cover aspect-square group-hover:scale-105 transition duration-500" />
            <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition flex items-center justify-center text-brand opacity-0 group-hover:opacity-100">⤢</span>
          </button>
        ))}
      </div>

      {open !== null && (
        <div className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur flex items-center justify-center p-4" onClick={() => setOpen(null)}>
          <button className="absolute top-5 right-5 text-white/70 hover:text-brand text-2xl" aria-label="Bağla">✕</button>
          <button className="absolute left-4 md:left-8 text-white/60 hover:text-brand text-4xl" aria-label="Əvvəlki"
            onClick={(e) => { e.stopPropagation(); setOpen((o) => (o! - 1 + images.length) % images.length); }}>‹</button>
          <img src={images[open]} alt="" className="max-h-[85vh] max-w-[92vw] object-contain rounded-xl" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-4 md:right-8 text-white/60 hover:text-brand text-4xl" aria-label="Növbəti"
            onClick={(e) => { e.stopPropagation(); setOpen((o) => (o! + 1) % images.length); }}>›</button>
          <div className="absolute bottom-5 font-mono text-xs text-mut">{open + 1} / {images.length}</div>
        </div>
      )}
    </>
  );
}
