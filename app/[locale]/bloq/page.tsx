import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BlockRenderer } from '@/components/site/blocks';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; const t = await getTranslations({ locale, namespace: 'pages.blog' });
  return { title: `${t('h1a')} ${t('h1b')}`, description: t('lead'), alternates: { canonical: '/bloq' } };
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations('pages.blog'); const c = await getTranslations('common'); const h = await getTranslations('home');
  const blocks = [
    { type: 'hero', props: { eyebrow: t('eyebrow'), h1: t('h1a') + ' ' + t('h1b'), lead: t('lead'), b1: c('services'), b2: c('contact') } },
    { type: 'cta', props: { h2: h('cta.h2'), p: h('cta.p'), b1: h('cta.b1') } },
  ];
  return <BlockRenderer blocks={blocks as any} />;
}
