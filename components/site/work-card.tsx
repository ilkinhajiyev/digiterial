import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { PItem } from '@/lib/data/portfolio';

export default function WorkCard({ it, more, large = false }: { it: PItem; more: string; large?: boolean }) {
  return (
    <Link href={`/isler/${it.slug || it.id}`} className={`group block ${large ? 'md:col-span-2 lg:col-span-1' : ''}`}>
      <div className="img-zoom relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#E6E1D6]">
        {it.image_url
          ? <img src={it.image_url} alt={it.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
          : <div className="grid h-full w-full place-items-center p-6 text-center font-display text-2xl tracking-tight text-ink/40">{it.title}</div>}
        <span className="absolute left-4 top-4 rounded-full bg-bone/90 px-3 py-1 font-mono text-[.68rem] uppercase tracking-[.12em] backdrop-blur">{it.category === 'smm' ? 'SMM' : 'Web'}</span>
        <span className="absolute bottom-4 right-4 grid h-11 w-11 translate-y-2 place-items-center rounded-full bg-brand text-ink opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100" aria-hidden><ArrowUpRight size={18} /></span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="t-h3 transition group-hover:text-brand-deep">{it.title}</h3>
          {(it.client || it.description) && <p className="mt-1 line-clamp-2 text-[.93rem] text-[color:var(--ink-2)]">{it.client || it.description}</p>}
        </div>
        {it.metric && <span className="shrink-0 rounded-full bg-ink px-3 py-1 font-mono text-[.72rem] text-bone">{it.metric}</span>}
      </div>
      <span className="sr-only">{more}</span>
    </Link>
  );
}
