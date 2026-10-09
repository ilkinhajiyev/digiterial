import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import PageHeader from '@/components/site/page-header';
import ContactForm from '@/components/site/contact-form';
import { JsonLd, orgLd } from '@/components/site/jsonld';
import { getSettings, addressFor } from '@/lib/data/settings';
import { services } from '@/lib/data/services';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; const m = await getTranslations({ locale, namespace: 'meta.contact' });
  return pageMetadata('contact', locale, '/elaqe', { title: m('title'), description: m('desc') });
}

export default async function Contact({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ service?: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const { service } = await searchParams;
  const t = await getTranslations('pages.contact'); const sv = await getTranslations('svc');
  const st = await getSettings();
  const svcNames = services.map((s) => sv(`${s.slug}.title`));
  const wa = (st.whatsapp || '').replace(/\D/g, '');
  const info = [
    { icon: Mail, k: t('iEmail'), v: st.email, href: `mailto:${st.email}` },
    { icon: Phone, k: t('iPhone'), v: st.phone, href: `tel:${st.phone.replace(/\s/g, '')}` },
    ...(wa ? [{ icon: MessageCircle, k: 'WhatsApp', v: `+${wa}`, href: `https://wa.me/${wa}` }] : []),
    { icon: MapPin, k: t('iAddr'), v: addressFor(st, locale, t('addr')) },
    { icon: Clock, k: t('iHours'), v: t('hours') },
  ];
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'ContactPage', mainEntity: orgLd(st as any) }} />
      <PageHeader locale={locale} eyebrow={t('eyebrow')} title={`${t('h1a')} *${t('h1b')}*`} lead={t('lead')} />
      <section className="section pt-12 md:pt-16"><div className="wrap grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7"><ContactForm services={svcNames} defaultService={svcNames.includes(service || '') ? service : ''} /></div>
        <aside className="space-y-5 lg:col-span-5">
          <div className="rounded-2xl bg-surface-2 p-7 text-white md:p-9">
            <h2 className="t-h3 text-[1.6rem]">{t('nextH')}</h2>
            <ol className="mt-7 space-y-5">
              {[t('n1'), t('n2'), t('n3')].map((x, i) => (
                <li key={i} className="flex gap-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand font-mono text-xs text-onbrand">{i + 1}</span><span className="pt-1 text-white/75">{x}</span></li>
              ))}
            </ol>
          </div>
          <dl className="card divide-y divide-[color:var(--line)] px-7">
            {info.map(({ icon: I, k, v, href }) => (
              <div key={k} className="flex items-start gap-4 py-5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand"><I size={16} /></span>
                <div><dt className="text-[.82rem] text-muted">{k}</dt>
                  <dd className="mt-0.5 font-medium">{href ? <a href={href} className="ulink" {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{v}</a> : v}</dd></div>
              </div>
            ))}
          </dl>
        </aside>
      </div></section>
    </>
  );
}
