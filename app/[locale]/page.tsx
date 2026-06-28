import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { BlockRenderer } from '@/components/site/blocks';
import { JsonLd, orgLd } from '@/components/site/jsonld';
import { getPage } from '@/lib/data/pages';
import { homeBlocks } from '@/lib/data/defaults';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Digiterial — Rəqəmsal Marketinq Agentliyi',
    description: '360° rəqəmsal agentlik. Veb, SEO, reklam, brendinq və AI.',
    alternates: { canonical: '/', languages: { az: '/', en: '/en', ru: '/ru' } },
    openGraph: { title: 'Digiterial', description: '360° rəqəmsal agentlik.', type: 'website' },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = await getPage('home', locale);
  const dbBlocks = (page?.blocks as any[]) || [];
  const blocks = dbBlocks.length > 1 ? dbBlocks : homeBlocks;
  return (<><JsonLd data={orgLd} /><BlockRenderer blocks={blocks as any} /></>);
}
