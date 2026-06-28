import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { BlockRenderer } from '@/components/site/blocks';

export const metadata: Metadata = { title: 'İşlər — Portfolio', description: 'Veb, SEO, reklam və brendinq layihələri.', alternates: { canonical: '/isler' } };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  return <BlockRenderer blocks={[
  { type:'hero', props:{ eyebrow:'Portfolio', h1:'Sözdən çox — nəticə.', lead:'Fərqli sektorlar, eyni oyun planı.', b1:'Xidmətlər', b2:'Əlaqə' } },
  { type:'cards', props:{ label:'Seçilmiş işlər', heading:'Son layihələr.', items:[
    {h:'RestoBaku',p:'+214% onlayn sifariş · 1.6s LCP'},
    {h:'Aztravel',p:'3.2x ROAS · −38% lead dəyəri'},
    {h:'NovaFinance',p:'+127% üzvi trafik · 98 PageSpeed'} ] } },
  { type:'cta', props:{ h2:'Növbəti uğur sizin olsun.', p:'Pulsuz audit alın.', b1:'Başla' } } ] as any} />;
}
