import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BlockRenderer } from '@/components/site/blocks';
import { dbBlocks } from '@/lib/data/pages';
import { defaultBlocks } from '@/lib/data/default-blocks';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; const t = await getTranslations({ locale, namespace: 'pages.services' });
  return pageMetadata('services', locale, '/xidmetler', { title: t('h1'), description: t('lead') });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const blocks = (await dbBlocks('services', locale)) || (await defaultBlocks('services', locale));
  return <BlockRenderer blocks={blocks} />;
}
