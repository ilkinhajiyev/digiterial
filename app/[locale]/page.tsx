import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BlockRenderer } from '@/components/site/blocks';
import { JsonLd, orgLd } from '@/components/site/jsonld';
import { getPage } from '@/lib/data/pages';
import { getPortfolio } from '@/lib/data/portfolio';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  return { title: 'Digiterial', description: t('lead'), alternates: { canonical: '/', languages: { az: '/', en: '/en', ru: '/ru' } } };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations('home'); const th = await getTranslations('hero');
  const [page, portfolio] = await Promise.all([getPage('home', locale), getPortfolio(locale)]);
  const localized = [
    { type: 'hero', props: { eyebrow: th('eyebrow'), h1: th('h1'), lead: th('lead'), b1: th('b1'), b2: th('b2'), b1Href: '/elaqe', b2Href: '/isler', showAside: true } },
    { type: 'marquee', props: { items: [t('marquee.i1'), t('marquee.i2'), t('marquee.i3'), t('marquee.i4'), t('marquee.i5'), t('marquee.i6')] } },
    { type: 'band', props: { label: t('band.label'), big: t('band.big'), h3: t('band.h3'), p: t('band.p') } },
    { type: 'services', props: { label: t('servicesHead.label'), heading: t('servicesHead.heading'), light: true } },
    { type: 'workbench', props: { label: t('workbench.label'), heading: t('workbench.heading'), text: t('workbench.text'), items: [{ h: t('workbench.h1'), p: t('workbench.p1') }, { h: t('workbench.h2'), p: t('workbench.p2') }, { h: t('workbench.h3'), p: t('workbench.p3') }, { h: t('workbench.h4'), p: t('workbench.p4') }] } },
    ...(portfolio.length ? [{ type: 'selectedWork', props: { label: t('selectedWork.label'), heading: t('selectedWork.heading'), viewAll: t('selectedWork.viewAll'), items: portfolio.slice(0, 4) } }] : []),
    { type: 'process', props: { label: t('process.label'), heading: t('process.heading'), text: t('process.text'), items: [{ h: t('process.h1'), p: t('process.p1') }, { h: t('process.h2'), p: t('process.p2') }, { h: t('process.h3'), p: t('process.p3') }] } },
    { type: 'legacy', props: { label: t('legacy.label'), heading: t('legacy.heading'), text: t('legacy.text'), since: t('legacy.since'), items: [t('legacy.i1'), t('legacy.i2'), t('legacy.i3')] } },
    { type: 'toolkit', props: { label: t('toolkit.label'), heading: t('toolkit.heading'), text: t('toolkit.text'), row1: [t('toolkit.r1'), t('toolkit.r2'), t('toolkit.r3'), t('toolkit.r4')], row2: [t('toolkit.r5'), t('toolkit.r6'), t('toolkit.r7'), t('toolkit.r8')] } },
    { type: 'principles', props: { label: t('principles.label'), heading: t('principles.heading'), items: [{ h: t('principles.h1'), p: t('principles.p1') }, { h: t('principles.h2'), p: t('principles.p2') }, { h: t('principles.h3'), p: t('principles.p3') }] } },
    { type: 'faq', props: { label: t('faq.label'), items: [{ q: t('faq.q1'), a: t('faq.a1') }, { q: t('faq.q2'), a: t('faq.a2') }, { q: t('faq.q3'), a: t('faq.a3') }, { q: t('faq.q4'), a: t('faq.a4') }] } },
    { type: 'cta', props: { h2: t('cta.h2'), p: t('cta.p'), b1: t('cta.b1') } },
  ];
  const dbBlocks = (page?.blocks as any[]) || [];
  // Keep the complete designed homepage when the visual builder still has an older block list.
  // Saved builder content overrides matching sections; newly designed sections stay visible.
  const dbByType = new Map(dbBlocks.map((block) => [block.type, block]));
  const blocks = localized.map((block) => {
    const saved = dbByType.get(block.type);
    return saved ? { ...block, props: { ...block.props, ...saved.props } } : block;
  });
  return (<><JsonLd data={orgLd} /><BlockRenderer blocks={blocks as any} /></>);
}
