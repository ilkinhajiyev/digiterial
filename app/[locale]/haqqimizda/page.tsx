import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BlockRenderer } from '@/components/site/blocks';
import { dbBlocks } from '@/lib/data/pages';
import { defaultBlocks } from '@/lib/data/default-blocks';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; const m = await getTranslations({ locale, namespace: 'meta.about' });
  return pageMetadata('about', locale, '/haqqimizda', { title: m('title'), description: m('desc') });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const blocks = (await dbBlocks('about', locale)) || (await defaultBlocks('about', locale));
  return <BlockRenderer blocks={blocks} />;
}
