import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { BlockRenderer } from '@/components/site/blocks';

export const metadata: Metadata = {
  title: 'Xidmətlər — Veb, SEO, Reklam, SMM, Brendinq, AI', description: 'Hər şey bir dam altında: veb, SEO, reklam, SMM, brendinq və AI avtomatlaşdırma.', alternates: { canonical: '/xidmetler' },
};

export default async function XidmetlerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const blocks = [
    { type: 'hero', props: { eyebrow: 'Xidmətlərimiz', h1: 'Hər şey bir dam altında.', lead: 'Strategiyadan icraya — biznesinizin rəqəmsal mövcudluğunun hər mərhələsi bir komandadan.', b1: 'Pulsuz audit', b2: 'İşlərimiz' } },
    { type: 'services', props: { label: 'Nə təklif edirik', heading: 'Altı istiqamət, bir məqsəd.' } },
    { type: 'faq', props: { label: 'FAQ', items: [{ q: 'Layihə nə qədər çəkir?', a: 'Landing 1–2 həftə, korporativ sayt 3–5 həftə, SEO/Ads davamlı.' }, { q: 'Qiymətlər necədir?', a: 'Hər layihə fərqlidir — pulsuz auditdən sonra şəffaf təklif veririk.' }, { q: 'Müqavilə bağlanır?', a: 'Bəli, hər layihə üçün aydın şərtlərlə müqavilə imzalanır.' }] } },
    { type: 'cta', props: { h2: 'Layihənizi danışaq.', p: 'Pulsuz audit də daxil.', b1: 'Başla' } },
  ];
  return <BlockRenderer blocks={blocks as any} />;
}
