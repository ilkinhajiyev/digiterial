'use client';
import { useRef, useState } from 'react';

type Props = {
  className?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  /** Soft tilt toward pointer on fine pointers */
  look?: boolean;
  priority?: boolean;
};

/** Interactive Digiterial mascot — hover bounce / heart glow, optional look-at. */
export default function MascotFigure({
  className = '',
  src = '/brand/mascot/digiterial-mascot-front-cutout.png',
  alt = '',
  width = 220,
  height = 300,
  look = true,
  priority = false,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [mood, setMood] = useState<'idle' | 'hover' | 'press'>('idle');

  const onMove = (e: React.PointerEvent) => {
    if (!look || !ref.current) return;
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.setProperty('--mx', `${px * 10}deg`);
    ref.current.style.setProperty('--my', `${-py * 6}deg`);
  };

  const reset = () => {
    if (!ref.current) return;
    ref.current.style.setProperty('--mx', '0deg');
    ref.current.style.setProperty('--my', '0deg');
  };

  return (
    <span
      ref={ref}
      className={`mascot-fig mood-${mood} ${className}`.trim()}
      onPointerEnter={() => setMood('hover')}
      onPointerLeave={() => { setMood('idle'); reset(); }}
      onPointerDown={() => setMood('press')}
      onPointerUp={() => setMood('hover')}
      onPointerMove={onMove}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        draggable={false}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'low'}
      />
      <i className="mascot-glow" aria-hidden="true" />
    </span>
  );
}
