import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BlockRenderer } from '@/components/site/blocks';
import { JsonLd, orgLd } from '@/components/site/jsonld';
import { dbBlocks } from '@/lib/data/pages';
import { defaultBlocks } from '@/lib/data/default-blocks';
import { getSettings } from '@/lib/data/settings';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  return pageMetadata('home', locale, '/', { title: `Digiterial — ${t('h1')}`, description: t('lead'), absoluteTitle: true });
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const blocks = (await dbBlocks('home', locale)) || (await defaultBlocks('home', locale));
  const st = await getSettings();
  return (<><JsonLd data={orgLd(st as any)} /><BlockRenderer blocks={blocks} /></>);
}
