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
    { type: 'hero', props: { eyebrow: th('eyebrow'), h1: th('h1'), lead: th('lead'), b1: th('b1'), b2: th('b2') } },
    { type: 'marquee', props: { items: ['VEB', 'SEO', 'GOOGLE ADS', 'META ADS', 'BRENDİNQ', 'SMM', 'UI/UX', 'AI'] } },
    { type: 'band', props: { label: t('band.label'), big: t('band.big'), h3: t('band.h3'), p: t('band.p') } },
    { type: 'services', props: { label: t('servicesHead.label'), heading: t('servicesHead.heading'), light: true } },
    { type: 'portfolio', props: { label: t('portfolioHead.label'), heading: t('portfolioHead.heading'), viewAll: t('portfolioHead.viewAll'), locale } },
    { type: 'stats', props: { label: t('stats.label'), statement: t('stats.statement'), items: [{ v: '240+', l: t('stats.l1') }, { v: '+312%', l: t('stats.l2') }, { v: '98', l: t('stats.l3') }, { v: '4.9', l: t('stats.l4') }], receipt: t('stats.receipt') } },
    { type: 'testimonials', props: { label: t('testimonials.label'), items: [{ q: `"${t('testimonials.q1')}"`, by: t('testimonials.by1') }, { q: `"${t('testimonials.q2')}"`, by: t('testimonials.by2') }] } },
    { type: 'clients', props: { label: t('clients.label'), items: ['RestoBaku', 'Aztravel', 'NovaFinance', 'MediClinic', 'UrbanFit', 'GreenMart', 'TechnoAz'] } },
    { type: 'cta', props: { h2: t('cta.h2'), p: t('cta.p'), b1: t('cta.b1') } },
  ];
  const page = await getPage('home', locale);
  const dbBlocks = (page?.blocks as any[]) || [];
  const blocks = dbBlocks.length > 1 ? dbBlocks : localized;
  return (<><JsonLd data={orgLd} /><BlockRenderer blocks={blocks as any} /></>);
}
