import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ContactForm from '@/components/site/contact-form';
import { JsonLd } from '@/components/site/jsonld';
import { getSettings, defaultSettings } from '@/lib/data/settings';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; const t = await getTranslations({ locale, namespace: 'pages.contact' });
  return { title: `${t('h1a')} ${t('h1b')}`, description: t('lead'), alternates: { canonical: '/elaqe' } };
}
export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations('pages.contact');
  const st = await getSettings().catch(() => defaultSettings);
  const ld = { '@context': 'https://schema.org', '@type': 'ContactPage', mainEntity: { '@type': 'Organization', name: st.brand, email: st.email, telephone: st.phone } };
  const info: [string, string][] = [[t('iEmail'), st.email], [t('iPhone'), st.phone], [t('iAddr'), st.address || t('addr')], [t('iHours'), t('hours')]];
  return (
    <>
      <JsonLd data={ld} />
      <section className="pt-32 md:pt-40 pb-16 border-b border-white/15"><div className="wrap">
        <div className="font-mono text-sm tracking-[.2em] uppercase text-brand mb-6">{t('eyebrow')}</div>
        <h1 className="font-display font-bold text-[clamp(2.6rem,7vw,5.6rem)] leading-[.96] tracking-tight">{t('h1a')} <span className="text-brand">{t('h1b')}</span></h1>
        <p className="mt-6 max-w-[60ch] text-neutral-300 text-lg">{t('lead')}</p>
      </div></section>
      <section className="py-20"><div className="wrap grid lg:grid-cols-[1.1fr_.9fr] gap-12">
        <ContactForm />
        <div>{info.map(([k, v]) => (
          <div key={k} className="py-4 border-b border-white/15"><div className="font-mono text-xs uppercase tracking-wide text-mut-d mb-1.5">{k}</div><b className="font-display text-lg">{v}</b></div>
        ))}</div>
      </div></section>
    </>
  );
}
