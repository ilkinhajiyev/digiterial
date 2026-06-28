import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { BlockRenderer } from '@/components/site/blocks';

export const metadata: Metadata = { title: 'Xidmətlər — Veb, SEO, Reklam', description: 'Veb, SEO, reklam, brendinq, AI və strategiya.', alternates: { canonical: '/xidmetler' } };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  return <BlockRenderer blocks={[
  { type:'hero', props:{ eyebrow:'Xidmətlərimiz', h1:'Hər şey bir dam altında.', lead:'Strategiyadan icraya — hər mərhələ bir komandadan.', b1:'Pulsuz audit', b2:'Əlaqə' } },
  { type:'services', props:{ label:'Nə təklif edirik', heading:'Altı istiqamət, bir məqsəd.', rows:[
    {no:'01',title:'Veb & E-ticarət',tags:'WordPress · WooCommerce · sürət'},
    {no:'02',title:'SEO & Texniki SEO',tags:'açar söz · audit'},
    {no:'03',title:'Google & Meta Ads',tags:'PMax · ROAS'},
    {no:'04',title:'Brendinq & Dizayn',tags:'loqo · UI/UX'},
    {no:'05',title:'AI & Avtomatlaşdırma',tags:'CRM · email'},
    {no:'06',title:'Strategiya & Dəstək',tags:'konsaltinq'} ] } },
  { type:'faq', props:{ label:'FAQ', items:[
    {q:'Layihə nə qədər çəkir?',a:'Landing 1–2 həftə, korporativ sayt 3–5 həftə.'},
    {q:'Qiymətlər necədir?',a:'Pulsuz auditdən sonra şəffaf qiymət.'} ] } },
  { type:'cta', props:{ h2:'Layihənizi danışaq.', p:'Pulsuz audit də daxil.', b1:'Başla' } } ] as any} />;
}
