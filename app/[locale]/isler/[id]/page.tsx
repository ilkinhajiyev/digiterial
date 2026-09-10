import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getPortfolioItem } from '@/lib/data/portfolio';
import Gallery from '@/components/site/gallery';
import { JsonLd } from '@/components/site/jsonld';

const CATN: Record<string, string> = { web: 'Veb sayt', smm: 'SMM' };

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params; const it = await getPortfolioItem(id);
  if (!it) return {};
  return { title: `${it.title} — Portfolio`, description: it.description || it.title, alternates: { canonical: `/isler/${it.slug || it.id}` }, openGraph: { images: it.image_url ? [it.image_url] : [] } };
}

export default async function PortfolioDetail({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params; setRequestLocale(locale);
  const tr = await getTranslations('portfolio');
  const it = await getPortfolioItem(id);
  if (!it) notFound();
  const gallery = (it.gallery && it.gallery.length) ? it.gallery : (it.image_url ? [it.image_url] : []);
  const ld = { '@context': 'https://schema.org', '@type': 'CreativeWork', name: it.title, about: it.description };

  return (
    <>
      <JsonLd data={ld} />
      <section className="pt-32 md:pt-40 pb-12 border-b border-white/15"><div className="wrap">
        <Link href="/isler" className="font-mono text-xs text-mut hover:text-brand transition">← {tr('back')}</Link>
        <div className="flex items-center gap-3 mt-6 mb-4">
          <span className="font-mono text-[.7rem] uppercase tracking-widest border border-brand text-brand rounded-full px-3 py-1">{CATN[it.category]}</span>
          {it.metric && <span className="font-mono text-sm text-brand">{it.metric}</span>}
        </div>
        <h1 className="font-display font-bold text-[clamp(2.4rem,7vw,5rem)] leading-[.96] tracking-tight">{it.title}</h1>
        {it.client && <p className="mt-4 text-mut-d font-mono text-sm uppercase tracking-wide">{it.client}</p>}
        {it.tags && <div className="flex flex-wrap gap-2 mt-6">{it.tags.split(',').map((t, i) => <span key={i} className="font-mono text-xs text-mut border border-white/15 rounded-full px-3 py-1">{t.trim()}</span>)}</div>}
        {it.url && it.url !== '#' && <a href={it.url} target="_blank" className="inline-flex hbtn hbtn-y mt-7">{tr('visit')} ↗</a>}
      </div></section>

      {it.body && (
        <section className="py-16 md:py-20 border-b border-white/15"><div className="wrap grid md:grid-cols-[.35fr_.65fr] gap-8">
          <div className="elbl h-fit">{tr('about')}</div>
          <div className="space-y-4">{it.body.split('\n').filter(Boolean).map((para, i) => <p key={i} className="text-neutral-200 text-lg leading-relaxed">{para}</p>)}</div>
        </div></section>
      )}

      {gallery.length > 0 && (
        <section className="py-16 md:py-20"><div className="wrap">
          <div className="elbl mb-8">{tr('gallery')}</div>
          <Gallery images={gallery} />
        </div></section>
      )}

      <section className="bg-brand text-ink py-16 md:py-20"><div className="wrap">
        <h2 className="font-display font-bold text-[clamp(2rem,6vw,4rem)] max-w-[14ch] leading-[.95]">{tr('similar')}</h2>
        <div className="flex justify-between items-end gap-6 flex-wrap mt-8">
          <p className="max-w-[40ch] text-lg">{tr('ctaP')}</p>
          <Link href="/elaqe" className="hbtn hbtn-d">{tr('detail')} ↗</Link>
        </div>
      </div></section>
    </>
  );
}
