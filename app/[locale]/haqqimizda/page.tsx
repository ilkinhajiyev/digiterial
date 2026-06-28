import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { BlockRenderer } from '@/components/site/blocks';

export const metadata: Metadata = { title: 'Haqqımızda — Digiterial', description: '2018-dən bəri Bakıda 360° rəqəmsal agentlik.', alternates: { canonical: '/haqqimizda' } };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  return <BlockRenderer blocks={[
  { type:'hero', props:{ eyebrow:'Haqqımızda', h1:'Həqiqətən nəticə verən agentlik.', lead:'2018-dən bəri Bakıda. Etibarlı kreativ-texnoloji partnyorunuz.', b1:'Komandamız', b2:'Əlaqə' } },
  { type:'cards', props:{ label:'Dəyərlərimiz', heading:'Bizi fərqləndirən.', items:[
    {h:'Nəticə > söz',p:'Slayd deyil, rəqəm.'},
    {h:'Bir komanda',p:'Eyni masada.'},
    {h:'Şəffaflıq',p:'Sabit qiymət.'} ] } },
  { type:'stats', props:{ label:'Rəqəmlərlə', statement:'Kiçik, fokuslu komanda.', items:[
    {v:'2018',l:'Təsis'},{v:'240+',l:'Layihə'},{v:'18',l:'Müştəri'},{v:'9',l:'Üzv'} ], receipt:'Qonşuluqdan dünyaya.' } },
  { type:'cta', props:{ h2:'Bizimlə işləyin.', p:'Növbəti layihəniz buradan.', b1:'Əlaqə' } } ] as any} />;
}
