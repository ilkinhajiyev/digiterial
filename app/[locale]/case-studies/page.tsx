import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { BlockRenderer } from '@/components/site/blocks';

export const metadata: Metadata = { title: 'Case Studies — Uğur Hekayələri', description: 'Problem, həll və ölçülə bilən nəticələr.', alternates: { canonical: '/case-studies' } };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  return <BlockRenderer blocks={[
  { type:'hero', props:{ eyebrow:'Case Studies', h1:'Case yoxdursa — olmayıb.', lead:'Real layihələr, real rəqəmlər.', b1:'Xidmətlər', b2:'Əlaqə' } },
  { type:'cards', props:{ label:'Nəticələr', heading:'Sübut.', items:[
    {h:'RestoBaku',p:'Onlayn sifariş 3 ayda 3 dəfə artdı.'},
    {h:'Aztravel',p:'Lead dəyəri 38% aşağı, ROAS 3.2x.'},
    {h:'NovaFinance',p:'Üzvi trafik 6 ayda iki dəfədən çox.'} ] } },
  { type:'cta', props:{ h2:'Sizin case-iniz buradan başlasın.', p:'Danışaq.', b1:'Əlaqə' } } ] as any} />;
}
