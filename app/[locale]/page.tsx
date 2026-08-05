import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BlockRenderer } from '@/components/site/blocks';
import { JsonLd, orgLd } from '@/components/site/jsonld';
import { getPage } from '@/lib/data/pages';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  return { title: 'Digiterial', description: t('lead'), alternates: { canonical: '/', languages: { az: '/', en: '/en', ru: '/ru' } } };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations('home'); const th = await getTranslations('hero');
  const localized = [
    { type: 'hero', props: { eyebrow: th('eyebrow'), h1: th('h1'), lead: th('lead'), b1: th('b1'), b2: th('b2'), b1Href: '/elaqe', b2Href: '/isler', showAside: true } },
    { type: 'band', props: { label: t('band.label'), big: t('band.big'), h3: t('band.h3'), p: t('band.p') } },
    { type: 'services', props: { label: t('servicesHead.label'), heading: t('servicesHead.heading'), light: true } },
    { type: 'process', props: { label: t('process.label'), heading: t('process.heading'), text: t('process.text'), items: [{ h: t('process.h1'), p: t('process.p1') }, { h: t('process.h2'), p: t('process.p2') }, { h: t('process.h3'), p: t('process.p3') }] } },
    { type: 'cta', props: { h2: t('cta.h2'), p: t('cta.p'), b1: t('cta.b1') } },
  ];
  const page = await getPage('home', locale);
  const dbBlocks = (page?.blocks as any[]) || [];
  const blocks = dbBlocks.length > 1 ? dbBlocks : localized;
  return (<><JsonLd data={orgLd} /><BlockRenderer blocks={blocks as any} /></>);
}
