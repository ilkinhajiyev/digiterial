import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { BlockRenderer } from '@/components/site/blocks';

export const metadata: Metadata = { title: 'Bloq — Rəqəmsal Marketinq & SEO', description: 'SEO, reklam, veb və AI haqqında praktiki məqalələr.', alternates: { canonical: '/bloq' } };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  return <BlockRenderer blocks={[
  { type:'hero', props:{ eyebrow:'Bloq', h1:'Fikirlər, taktikalar, nəticələr.', lead:'Buzzword yox — işləyən şeylər.', b1:'Xidmətlər', b2:'Əlaqə' } },
  { type:'cards', props:{ label:'Son yazılar', heading:'Oxu.', items:[
    {h:'2026-da SEO trendləri',p:'AI nəticələri, E-E-A-T və texniki SEO.'},
    {h:'Meta Ads büdcə strategiyası',p:'Kiçik büdcə ilə yüksək ROAS.'},
    {h:'WooCommerce sürət bələdçisi',p:'Core Web Vitals-ı keçmək.'} ] } } ] as any} />;
}
