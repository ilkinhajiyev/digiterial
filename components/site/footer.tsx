import { getTranslations } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { BakuClock } from '@/components/site/interactive';
import { Accent } from '@/components/site/accent';
import Logo from '@/components/site/logo';
import { services } from '@/lib/data/services';
import { addressFor, type SiteSettings } from '@/lib/data/settings';
import { getLocale } from 'next-intl/server';

export default async function SiteFooter({ st }: { st: SiteSettings }) {
  const t = await getTranslations('footer');
  const n = await getTranslations('nav');
  const c = await getTranslations('common');
  const sv = await getTranslations('svc');
  const socials = (['instagram', 'linkedin', 'tiktok', 'facebook', 'youtube'] as const)
    .filter((k) => st.social[k]).map((k) => ({ k, n: k[0].toUpperCase() + k.slice(1), u: st.social[k]! }));
  const nav = [['/isler', n('work')], ['/case-studies', n('cases')], ['/haqqimizda', n('about')], ['/bloq', n('blog')], ['/elaqe', n('contact')]] as const;
  const head = 'mb-5 font-mono text-[.7rem] uppercase tracking-[.14em] text-white/50';
  const link = 'block w-fit py-1.5 text-[.95rem] text-white/80 transition-colors hover:text-white';

  return (
    <footer className="section-dark relative overflow-hidden pt-20 md:pt-28">
      <div className="wrap">
        <div className="grid items-end gap-10 border-b border-white/10 pb-16 md:grid-cols-12">
          <h2 className="t-display text-[clamp(2.4rem,6vw,5.6rem)] md:col-span-8"><Accent text={t('ctaH')} /></h2>
          <div className="md:col-span-4 md:justify-self-end">
            <Link href="/elaqe" className="btn-accent">{c('audit')} <ArrowUpRight size={18} className="arr" /></Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-12">
          <div className="col-span-2 md:col-span-4">
            <Logo brand={st.brand} dark />
            <p className="mt-5 max-w-[36ch] text-[.95rem] leading-relaxed text-white/60">{t('tagline')}</p>
            <p className="mt-6 inline-flex items-center gap-2.5 font-mono text-[.78rem] text-white/60"><span className="live-dot" /> {t('hours')} 10:00–18:00 · <BakuClock /></p>
          </div>
          <div className="md:col-span-3 md:col-start-6">
            <div className={head}>{n('services')}</div>
            {services.map((s) => <Link key={s.slug} href={`/xidmetler/${s.slug}`} className={link}>{sv(`${s.slug}.title`)}</Link>)}
          </div>
          <div className="md:col-span-2">
            <div className={head}>{t('discover')}</div>
            {nav.map(([href, label]) => <Link key={href} href={href} className={link}>{label}</Link>)}
          </div>
          <div className="col-span-2 md:col-span-2">
            <div className={head}>{t('contact')}</div>
            <a className={link} href={`mailto:${st.email}`}>{st.email}</a>
            <a className={link} href={`tel:${st.phone.replace(/\s/g, '')}`}>{st.phone}</a>
            {st.whatsapp && <a className={link} href={`https://wa.me/${st.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
            {socials.map((s) => <a key={s.k} className={link} href={s.u} target="_blank" rel="noopener noreferrer">{s.n}</a>)}
            <p className="mt-4 text-[.9rem] text-white/50">{addressFor(st, await getLocale(), t('hq'))}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6 text-[.85rem] text-white/50">
          <span>© {new Date().getFullYear()} {st.brand}. {t('rights')}</span>
          <a href="#top" className="transition hover:text-white">{c('backTop')} ↑</a>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none select-none overflow-hidden whitespace-nowrap text-center text-[clamp(5rem,20vw,19rem)] font-semibold leading-[.72] tracking-[-.07em] text-white/[.05]">{(st.brand || 'digiterial').toLowerCase()}</div>
    </footer>
  );
}
