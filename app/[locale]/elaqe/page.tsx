import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import ContactForm from '@/components/site/contact-form';
import { JsonLd } from '@/components/site/jsonld';

export const metadata: Metadata = {
  title: 'Əlaqə — Digiterial', description: 'Pulsuz audit və konsultasiya.', alternates: { canonical: '/elaqe' },
};
const ld = { '@context': 'https://schema.org', '@type': 'ContactPage', mainEntity: { '@type': 'Organization', name: 'Digiterial', email: 'salam@digiterial.com', telephone: '+994604996340' } };

export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  return (
    <>
      <JsonLd data={ld} />
      <section className="pt-40 pb-16 border-b border-white/15"><div className="wrap">
        <div className="font-mono text-sm tracking-[.2em] uppercase text-brand mb-6">Əlaqə</div>
        <h1 className="font-display font-bold text-[clamp(2.6rem,7vw,5.6rem)] leading-[.96] tracking-tight">Gəlin <em className="text-brand not-italic italic">danışaq.</em></h1>
        <p className="mt-6 max-w-[60ch] text-neutral-300 text-lg">Layihəniz və ya ideya — yazın. 24 saat içində cavab veririk. Pulsuz audit də daxil.</p>
      </div></section>
      <section className="py-20"><div className="wrap grid lg:grid-cols-[1.1fr_.9fr] gap-12">
        <ContactForm />
        <div>
          {[['Email','salam@digiterial.com'],['Telefon','+994 60 499 63 40'],['Ünvan','Bakı, Azərbaycan'],['İş saatı','B.e – Cümə · 10:00–18:00']].map(([k,v]) => (
            <div key={k} className="py-4 border-b border-white/15">
              <div className="font-mono text-xs uppercase tracking-wide text-mut-d mb-1.5">{k}</div>
              <b className="font-display text-lg">{v}</b>
            </div>
          ))}
        </div>
      </div></section>
    </>
  );
}
