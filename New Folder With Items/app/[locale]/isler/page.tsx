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
  const { locale } = await params; const m = await getTranslations({ locale, namespace: 'meta.work' });
  return pageMetadata('work', locale, '/isler', { title: m('title'), description: m('desc') });
}

function Group({ id, label, heading, items, more }: { id: string; label: string; heading: string; items: PItem[]; more: string }) {
  return (
    <Reveal as="section" className="section pt-10 md:pt-14">
      <div className="wrap scroll-mt-24" id={id}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><div className="eyebrow">{label}</div><h2 className="t-h2 mt-4">{heading}</h2></div>
          <span className="chip">{String(items.length).padStart(2, '0')}</span>
        </div>
        <div className="mt-12 grid gap-x-5 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => <WorkCard key={it.id} it={it} more={more} index={i} />)}
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
      <PageHeader locale={locale} eyebrow={t('eyebrow')} title={`${t('h1a')} *${t('h1b')}*`} lead={t('lead')}>
        {items.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="chip border-brand bg-brand text-onbrand">{t('all')} · {items.length}</span>
            {web.length > 0 && <a href="#web" className="chip hover:border-fg hover:text-fg">{p('web')} · {web.length}</a>}
            {smm.length > 0 && <a href="#smm" className="chip hover:border-fg hover:text-fg">{p('smm')} · {smm.length}</a>}
          </div>
        )}
      </PageHeader>
      {items.length === 0 && (
        <section className="section pt-12"><div className="wrap">
          <div className="dot-grid grid place-items-center rounded-2xl border border-dashed border-[color:var(--line-2)] px-6 py-24 text-center">
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
