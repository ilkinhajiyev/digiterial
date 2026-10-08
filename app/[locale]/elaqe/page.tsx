import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import PageHeader from '@/components/site/page-header';
import ContactForm from '@/components/site/contact-form';
import { JsonLd, orgLd } from '@/components/site/jsonld';
import { getSettings } from '@/lib/data/settings';
import { services } from '@/lib/data/services';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; const t = await getTranslations({ locale, namespace: 'pages.contact' });
  return pageMetadata('contact', locale, '/elaqe', { title: `${t('h1a')} ${t('h1b')}`, description: t('lead') });
}

export default async function Contact({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ service?: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const { service } = await searchParams;
  const t = await getTranslations('pages.contact'); const sv = await getTranslations('svc');
  const st = await getSettings();
  const svcNames = services.map((s) => sv(`${s.slug}.title`));
  const info = [
    { icon: Mail, k: t('iEmail'), v: st.email, href: `mailto:${st.email}` },
    { icon: Phone, k: t('iPhone'), v: st.phone, href: `tel:${st.phone.replace(/\s/g, '')}` },
    ...(st.whatsapp ? [{ icon: MessageCircle, k: 'WhatsApp', v: `+${st.whatsapp.replace(/\D/g, '')}`, href: `https://wa.me/${st.whatsapp.replace(/\D/g, '')}` }] : []),
    { icon: MapPin, k: t('iAddr'), v: st.address || t('addr') },
    { icon: Clock, k: t('iHours'), v: t('hours') },
  ];
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'ContactPage', mainEntity: orgLd(st as any) }} />
      <PageHeader eyebrow={t('eyebrow')} title={`${t('h1a')} *${t('h1b')}*`} lead={t('lead')} />
      <section className="pb-24 md:pb-36"><div className="wrap grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7"><ContactForm services={svcNames} defaultService={svcNames.includes(service || '') ? service : ''} /></div>
        <aside className="space-y-12 lg:col-span-4 lg:col-start-9">
          <div>
            <h2 className="t-h3 text-[2.2rem]">{t('nextH')}</h2>
            <ol className="mt-8 space-y-6">
              {[t('n1'), t('n2'), t('n3')].map((x, i) => (
                <li key={i} className="flex gap-5"><span className="font-display text-3xl italic leading-none text-brand">{i + 1}</span><span className="t-small pt-1">{x}</span></li>
              ))}
            </ol>
          </div>
          <dl className="border-t border-[color:var(--line)]">
            {info.map(({ icon: I, k, v, href }) => (
              <div key={k} className="flex items-start gap-4 border-b border-[color:var(--line)] py-5">
                <I size={16} strokeWidth={1.5} className="mt-1 shrink-0 text-brand" />
                <div><dt className="font-mono text-[.66rem] uppercase tracking-[.2em] text-ash">{k}</dt>
                  <dd className="mt-1 font-medium">{href ? <a href={href} className="ulink" {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{v}</a> : v}</dd></div>
              </div>
            ))}
          </dl>
        </aside>
      </div></section>
    </>
  );
}
