import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import PageHeader from '@/components/site/page-header';
import Gallery from '@/components/site/gallery';
import { BlockRenderer } from '@/components/site/blocks';
import { JsonLd } from '@/components/site/jsonld';
import { getPortfolioItem } from '@/lib/data/portfolio';
import { buildMetadata, SITE_URL } from '@/lib/seo';
import { safeUrl } from '@/lib/utils';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params; const it = await getPortfolioItem(id);
  if (!it) return {};
  return buildMetadata({ locale, path: `/isler/${it.slug || it.id}`, title: it.title, description: it.description || it.title, image: it.image_url || undefined });
}

export default async function PortfolioDetail({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params; setRequestLocale(locale);
  const tr = await getTranslations('portfolio'); const h = await getTranslations('home');
  const it = await getPortfolioItem(id);
  if (!it) notFound();
  const gallery = (Array.isArray(it.gallery) && it.gallery.length ? it.gallery : it.image_url ? [it.image_url] : []).filter(Boolean);
  const link = safeUrl(it.url);
  const ld = { '@context': 'https://schema.org', '@type': 'CreativeWork', name: it.title, about: it.description, image: it.image_url || undefined, creator: { '@type': 'Organization', name: 'Digiterial', url: SITE_URL } };
  const tags = (it.tags || '').split(',').map((x) => x.trim()).filter(Boolean);

  return (
    <>
      <JsonLd data={ld} />
      <PageHeader back={{ href: '/isler', label: tr('back') }} eyebrow={it.category === 'smm' ? 'SMM' : 'Web'} title={it.title} lead={it.description}>
        <div className="flex flex-wrap items-center gap-2">
          {it.client && <span className="chip">{it.client}</span>}
          {it.metric && <span className="chip border-ink bg-ink text-bone">{it.metric}</span>}
          {tags.map((t) => <span key={t} className="chip">{t}</span>)}
          {link && <a href={link} target="_blank" rel="noopener noreferrer" className="btn-primary ml-auto">{tr('visit')} <ArrowUpRight size={18} className="arr" /></a>}
        </div>
      </PageHeader>

      {it.image_url && (
        <div className="wrap"><div className="overflow-hidden rounded-[1.5rem] bg-[#E6E1D6]"><img src={it.image_url} alt={it.title} className="aspect-[16/9] w-full object-cover" /></div></div>
      )}

      {it.body && (
        <section className="section"><div className="wrap grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4"><div className="eyebrow">{tr('about')}</div></div>
          <div className="space-y-5 md:col-span-8">{it.body.split('\n').filter(Boolean).map((para, i) => <p key={i} className="t-lead max-w-[62ch]">{para}</p>)}</div>
        </div></section>
      )}

      {gallery.length > 1 && (
        <section className="section pt-0"><div className="wrap">
          <div className="eyebrow mb-8">{tr('gallery')}</div>
          <Gallery images={gallery} title={it.title} />
        </div></section>
      )}

      <BlockRenderer blocks={[{ type: 'cta', props: { h2: tr('similar'), p: tr('ctaP'), b1: h('cta.b1') } }]} />
    </>
  );
}
