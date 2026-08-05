import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BlockRenderer } from '@/components/site/blocks';
import { getPage } from '@/lib/data/pages';
import { getDefaultPageBlocks, resolvePageBlocks } from '@/lib/data/page-content';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; const t = await getTranslations({ locale, namespace: 'pages.cases' });
  const page = await getPage('case-studies', locale);
  return { title: page?.seo_title || `${t('h1a')} ${t('h1b')}`, description: page?.meta_desc || t('lead'), alternates: { canonical: page?.slug || '/case-studies' } };
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const page = await getPage('case-studies', locale);
  const blocks = resolvePageBlocks(getDefaultPageBlocks('case-studies', locale), page?.blocks as any[]);
  return <BlockRenderer blocks={blocks as any} />;
}
