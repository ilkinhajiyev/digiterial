import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getPortfolio, fallbackPortfolio, type PItem } from '@/lib/data/portfolio';
import { Reveal } from '@/components/site/interactive';

export const metadata: Metadata = {
  title: 'İşlər — Portfolio', description: 'Veb sayt və SMM layihələri — klikləyib detallara və qalereyaya baxın.', alternates: { canonical: '/isler' },
};

function Grid({ items }: { items: PItem[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {items.map((it) => (
        <Reveal key={it.id}>
          <Link href={`/isler/${it.slug || it.id}`} className="block border border-white/15 rounded-2xl overflow-hidden bg-[#0f0f0f] hover:border-brand hover:-translate-y-1 transition duration-300 group h-full">
            <div className="aspect-[16/10] bg-white/5 overflow-hidden">
              {it.image_url ? <img src={it.image_url} alt={it.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /> : <div className="w-full h-full grid place-items-center text-mut font-display text-2xl">{it.title}</div>}
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-display font-bold text-xl group-hover:text-brand transition">{it.title}</h3>
                {it.metric && <span className="font-mono text-xs text-brand whitespace-nowrap">{it.metric}</span>}
              </div>
              {it.client && <div className="font-mono text-[.7rem] uppercase text-mut mt-1">{it.client}</div>}
              {it.description && <p className="text-mut-d text-sm mt-3">{it.description}</p>}
              <span className="inline-flex items-center gap-2 mt-4 text-sm text-brand group-hover:gap-3 transition-all">Detallar →</span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

export default async function IslerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const all = await getPortfolio();
  const items = all.length ? all : fallbackPortfolio;
  const web = items.filter((i) => i.category === 'web');
  const smm = items.filter((i) => i.category === 'smm');

  return (
    <>
      <section className="pt-32 md:pt-40 pb-14 border-b border-white/15"><div className="wrap">
        <div className="font-mono text-sm tracking-[.2em] uppercase text-brand mb-6">Portfolio</div>
        <h1 className="font-display font-bold text-[clamp(2.6rem,7vw,5.6rem)] leading-[.96] tracking-tight">Sözdən çox — <span className="text-brand">nəticə.</span></h1>
        <p className="mt-6 max-w-[60ch] text-neutral-300 text-lg">Veb sayt və SMM üzrə seçilmiş layihələr. Hər birinə klikləyib detallara və qalereyaya baxın.</p>
      </div></section>

      {web.length > 0 && (<section className="py-16 md:py-20 border-b border-white/15"><div className="wrap">
        <div className="elbl">Veb saytlar</div>
        <h2 className="font-display font-bold text-[clamp(1.8rem,4vw,3rem)] mt-3">Veb & E-ticarət</h2>
        <Grid items={web} />
      </div></section>)}

      {smm.length > 0 && (<section className="py-16 md:py-20"><div className="wrap">
        <div className="elbl">SMM xidmətləri</div>
        <h2 className="font-display font-bold text-[clamp(1.8rem,4vw,3rem)] mt-3">Sosial media & Reklam</h2>
        <Grid items={smm} />
      </div></section>)}

      <section className="bg-brand text-ink py-16 md:py-20"><div className="wrap">
        <h2 className="font-display font-bold text-[clamp(2rem,6vw,4rem)] max-w-[14ch] leading-[.95]">Növbəti uğur sizin olsun.</h2>
        <div className="flex justify-between items-end gap-6 flex-wrap mt-8">
          <p className="max-w-[40ch] text-lg">Pulsuz audit alın.</p>
          <Link href="/elaqe" className="hbtn hbtn-d">Başla ↗</Link>
        </div>
      </div></section>
    </>
  );
}
