import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BlockRenderer } from '@/components/site/blocks';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; const t = await getTranslations({ locale, namespace: 'pages.services' });
  return { title: t('h1'), description: t('lead'), alternates: { canonical: '/xidmetler' } };
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations('pages.services'); const c = await getTranslations('common'); const h = await getTranslations('home');
  const blocks = [
    { type: 'hero', props: { eyebrow: t('eyebrow'), h1: t('h1'), lead: t('lead'), b1: c('audit'), b2: c('work') } },
    { type: 'services', props: { label: h('servicesHead.label'), heading: t('h1') } },
    { type: 'cta', props: { h2: h('cta.h2'), p: h('cta.p'), b1: h('cta.b1') } },
  ];
  return <BlockRenderer blocks={blocks as any} />;
}
