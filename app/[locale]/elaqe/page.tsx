import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ContactForm from '@/components/site/contact-form';
import { JsonLd } from '@/components/site/jsonld';
import { getPage } from '@/lib/data/pages';
import { getDefaultPageBlocks, resolvePageBlocks } from '@/lib/data/page-content';
import { defaultSettings, getSettings } from '@/lib/data/settings';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; const t = await getTranslations({ locale, namespace: 'pages.contact' });
  const page = await getPage('contact', locale);
  return { title: page?.seo_title || `${t('h1a')} ${t('h1b')}`, description: page?.meta_desc || t('lead'), alternates: { canonical: page?.slug || '/elaqe' } };
}
export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const [page, settings] = await Promise.all([getPage('contact', locale), getSettings().catch(() => defaultSettings)]);
  const blocks = resolvePageBlocks(getDefaultPageBlocks('contact', locale), page?.blocks as any[]);
  const p = blocks.find(block => block.type === 'contact')?.props || getDefaultPageBlocks('contact', locale)[0].props;
  const info = [
    { label: p.emailLabel, value: settings.email, href: `mailto:${settings.email}` },
    { label: p.phoneLabel, value: settings.phone, href: `tel:${settings.phone.replace(/\D/g, '')}` },
    { label: p.addressLabel, value: settings.address || '', href: '' },
    { label: p.hoursLabel, value: p.hours, href: '' },
  ];
  const ld = { '@context': 'https://schema.org', '@type': 'ContactPage', mainEntity: { '@type': 'Organization', name: settings.brand, email: settings.email, telephone: settings.phone, address: settings.address } };
  return (
    <>
      <JsonLd data={ld} />
      <section className="pt-32 md:pt-40 pb-16 border-b border-white/15"><div className="wrap">
        <div className="font-mono text-sm tracking-[.2em] uppercase text-brand mb-6">{p.eyebrow}</div>
        <h1 className="font-display font-bold text-[clamp(2.6rem,7vw,5.6rem)] leading-[.96] tracking-tight">{p.h1} <span className="text-brand">{p.accent}</span></h1>
        <p className="mt-6 max-w-[60ch] text-neutral-300 text-lg">{p.lead}</p>
      </div></section>
      <section className="py-20"><div className="wrap grid lg:grid-cols-[1.1fr_.9fr] gap-12">
        <ContactForm />
        <div>{info.map(item => (
          <div key={item.label} className="py-4 border-b border-white/15"><div className="font-mono text-xs uppercase tracking-wide text-mut-d mb-1.5">{item.label}</div>{item.href ? <a href={item.href} className="font-display text-lg font-bold hover:text-brand transition-colors">{item.value}</a> : <b className="font-display text-lg">{item.value}</b>}</div>
        ))}</div>
      </div></section>
    </>
  );
}
