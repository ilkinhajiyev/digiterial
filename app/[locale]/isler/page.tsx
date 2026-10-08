import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import PageHeader from '@/components/site/page-header';
import WorkCard from '@/components/site/work-card';
import { BlockRenderer } from '@/components/site/blocks';
import { Reveal } from '@/components/site/interactive';
import { getPortfolioFor, type PItem } from '@/lib/data/portfolio';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; const t = await getTranslations({ locale, namespace: 'pages.work' });
  return pageMetadata('work', locale, '/isler', { title: `${t('h1a')} ${t('h1b')}`, description: t('lead') });
}

function Group({ id, label, heading, items, more }: { id: string; label: string; heading: string; items: PItem[]; more: string }) {
  return (
    <Reveal as="section" className="section pt-8 md:pt-12">
      <div className="wrap" id={id}>
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line pt-8">
          <div><div className="eyebrow">{label}</div><h2 className="t-h2 mt-4">{heading}</h2></div>
          <span className="font-mono text-sm text-mut">{String(items.length).padStart(2, '0')}</span>
        </div>
        <div className="mt-10 grid gap-x-4 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => <WorkCard key={it.id} it={it} more={more} />)}
        </div>
      </div>
    </Reveal>
  );
}

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations('pages.work'); const p = await getTranslations('portfolio'); const h = await getTranslations('home');
  const items = await getPortfolioFor(locale);
  const web = items.filter((i) => i.category === 'web');
  const smm = items.filter((i) => i.category === 'smm');
  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={`${t('h1a')} *${t('h1b')}*`} lead={t('lead')}>
        {items.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="chip bg-ink text-bone border-ink">{t('all')} · {items.length}</span>
            {web.length > 0 && <a href="#web" className="chip hover:border-ink">{p('web')} · {web.length}</a>}
            {smm.length > 0 && <a href="#smm" className="chip hover:border-ink">{p('smm')} · {smm.length}</a>}
          </div>
        )}
      </PageHeader>
      {items.length === 0 && (
        <section className="pb-20"><div className="wrap">
          <div className="card grid place-items-center px-6 py-20 text-center">
            <p className="t-h3">{t('empty')}</p>
          </div>
        </div></section>
      )}
      {web.length > 0 && <Group id="web" label={p('web')} heading={p('webHead')} items={web} more={p('detail')} />}
      {smm.length > 0 && <Group id="smm" label={p('smm')} heading={p('smmHead')} items={smm} more={p('detail')} />}
      <BlockRenderer blocks={[{ type: 'cta', props: { h2: p('ctaH'), p: p('ctaP'), b1: h('cta.b1') } }]} />
    </>
  );
}
