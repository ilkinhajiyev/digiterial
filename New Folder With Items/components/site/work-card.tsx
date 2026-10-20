import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { PItem } from '@/lib/data/portfolio';

export default function WorkCard({ it, more, index = 0 }: { it: PItem; more: string; index?: number }) {
  return (
    <Link href={`/isler/${it.slug || it.id}`} className="group block">
      <div className="img-zoom relative aspect-[4/3] overflow-hidden rounded-2xl border border-[color:var(--line)] bg-surface">
        {it.image_url
          ? <img src={it.image_url} alt={it.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
          : <div className="dot-grid grid h-full w-full place-items-center p-8 text-center text-2xl font-semibold tracking-[-.04em] text-fg/40">{it.title}</div>}
        <span className="absolute left-4 top-4 rounded-full bg-surface/90 px-3 py-1 font-mono text-[.68rem] font-medium uppercase tracking-[.1em] backdrop-blur">{it.category === 'smm' ? 'SMM' : 'Web'}</span>
        <span className="absolute bottom-4 right-4 grid h-11 w-11 translate-y-2 place-items-center rounded-full bg-brand text-onbrand opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100" aria-hidden><ArrowUpRight size={18} /></span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="t-h3 transition-colors group-hover:text-brand">{it.title}</h3>
          {(it.client || it.description) && <p className="t-small mt-1 line-clamp-2">{it.client || it.description}</p>}
        </div>
        {it.metric ? <span className="shrink-0 rounded-full bg-brand-soft px-3 py-1 text-[.8rem] font-semibold text-brand">{it.metric}</span> : <span className="idx">{String(index + 1).padStart(2, '0')}</span>}
      </div>
      <span className="sr-only">{more}</span>
    </Link>
  );
}
