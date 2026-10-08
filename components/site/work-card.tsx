import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Tilt } from '@/components/site/fx';
import type { PItem } from '@/lib/data/portfolio';

export default function WorkCard({ it, more, index = 0 }: { it: PItem; more: string; index?: number }) {
  return (
    <Link href={`/isler/${it.slug || it.id}`} className={`group block ${index % 2 ? 'md:mt-24' : ''}`}>
      <Tilt>
        <div className="img-zoom relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-coal">
          {it.image_url
            ? <img src={it.image_url} alt={it.title} loading="lazy" decoding="async" className="h-full w-full object-cover grayscale-[35%] transition duration-700 group-hover:grayscale-0" />
            : <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_30%_25%,#3a3226,#111114_70%)] p-8 text-center font-display text-4xl italic text-bone/60">{it.title}</div>}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-ink/40 px-3 py-1 font-mono text-[.65rem] uppercase tracking-[.18em] text-bone backdrop-blur-md">{it.category === 'smm' ? 'SMM' : 'Web'}</span>
          {it.metric && <span className="absolute bottom-5 left-5 font-display text-3xl italic text-brand">{it.metric}</span>}
          <span className="absolute bottom-5 right-5 grid h-12 w-12 place-items-center rounded-full bg-bone text-ink opacity-0 transition duration-500 group-hover:rotate-45 group-hover:opacity-100" aria-hidden><ArrowUpRight size={18} /></span>
        </div>
      </Tilt>
      <div className="mt-6 flex items-baseline justify-between gap-4 border-b border-[color:var(--line)] pb-5">
        <h3 className="t-h3 transition-colors duration-500 group-hover:text-brand">{it.title}</h3>
        <span className="font-mono text-xs text-ash">({String(index + 1).padStart(2, '0')})</span>
      </div>
      {(it.client || it.description) && <p className="t-small mt-3 line-clamp-2">{it.client || it.description}</p>}
      <span className="sr-only">{more}</span>
    </Link>
  );
}
