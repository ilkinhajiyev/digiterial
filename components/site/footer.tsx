import { getTranslations } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { BakuClock } from '@/components/site/interactive';
import Logo from '@/components/site/logo';
import type { SiteSettings } from '@/lib/data/settings';

const ICONS: Record<string, string> = {
  instagram: 'M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.5-.1 4.8c-.1 3.2-1.6 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.9-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.5 2.2 15.2 2.2 12s0-3.5.1-4.8C2.4 4 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 3.2a6.6 6.6 0 100 13.2 6.6 6.6 0 000-13.2zm0 10.9a4.3 4.3 0 110-8.6 4.3 4.3 0 010 8.6zm6.8-11.1a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z',
  linkedin: 'M4.98 3.5a2 2 0 11-.02 4 2 2 0 01.02-4zM3 8.98h4v12H3v-12zm6.5 0h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v6.35h-4v-5.6c0-1.34-.02-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-4v-12z',
  tiktok: 'M16.5 3c.4 2 1.7 3.6 3.5 4v2.8c-1.3 0-2.5-.4-3.5-1v6.4a5.7 5.7 0 11-5.7-5.7c.3 0 .6 0 .9.1v2.9a2.8 2.8 0 102 2.7V3h2.8z',
  facebook: 'M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0022 12z',
  youtube: 'M23 7.2a3 3 0 00-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 001 7.2 31 31 0 00.5 12a31 31 0 00.5 4.8 3 3 0 002.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 002.1-2.1 31 31 0 00.5-4.8 31 31 0 00-.5-4.8zM9.7 15.1V8.9L15.5 12l-5.8 3.1z',
};

export default async function SiteFooter({ st }: { st: SiteSettings }) {
  const t = await getTranslations('footer');
  const n = await getTranslations('nav');
  const socials = (['instagram', 'linkedin', 'tiktok', 'facebook', 'youtube'] as const)
    .filter((k) => st.social[k]).map((k) => ({ k, n: k[0].toUpperCase() + k.slice(1), u: st.social[k]!, d: ICONS[k] }));
  const nav = [['/xidmetler', n('services')], ['/isler', n('work')], ['/case-studies', n('cases')], ['/haqqimizda', n('about')], ['/bloq', n('blog')], ['/elaqe', n('contact')]] as const;
  const head = 'mb-4 font-mono text-[.7rem] uppercase tracking-[.14em] text-mut-d';
  const link = 'block w-fit py-1.5 text-[.95rem] text-[#D8D3C9] transition hover:text-brand';

  return (
    <footer className="section-dark relative overflow-hidden rounded-t-[2rem] pb-8 pt-16 md:pt-24">
      <div className="wrap">
        <Link href="/elaqe" className="group flex flex-col gap-6 border-b border-white/10 pb-14 md:flex-row md:items-end md:justify-between">
          <h2 className="t-display max-w-[14ch] text-[clamp(2.2rem,6vw,5rem)] text-bone">{t('ctaH')}</h2>
          <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-brand text-ink transition duration-500 ease-out group-hover:rotate-45 md:h-28 md:w-28">
            <ArrowUpRight size={36} strokeWidth={1.5} />
          </span>
        </Link>

        <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-12">
          <div className="col-span-2 md:col-span-4">
            <Logo brand={st.brand} className="text-bone [&>span:first-child]:bg-bone [&>span:first-child]:text-ink" />
            <p className="mt-4 max-w-[34ch] text-[.95rem] leading-relaxed text-[#A39E94]">{t('tagline')}</p>
            {socials.length > 0 && (
              <div className="mt-6 flex gap-2">
                {socials.map((s) => (
                  <a key={s.k} href={s.u} target="_blank" rel="noopener noreferrer" aria-label={s.n}
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-[#D8D3C9] transition hover:border-brand hover:bg-brand hover:text-ink">
                    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="currentColor" aria-hidden><path d={s.d} /></svg>
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="md:col-span-2 md:col-start-6">
            <div className={head}>{t('discover')}</div>
            {nav.map(([href, label]) => <Link key={href} href={href} className={link}>{label}</Link>)}
          </div>
          <div className="md:col-span-3">
            <div className={head}>{t('contact')}</div>
            <a className={link} href={`mailto:${st.email}`}>{st.email}</a>
            <a className={link} href={`tel:${st.phone.replace(/\s/g, '')}`}>{st.phone}</a>
            {st.whatsapp && <a className={link} href={`https://wa.me/${st.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
          </div>
          <div className="col-span-2 md:col-span-3">
            <div className={head}>{t('office')}</div>
            <p className="text-[.95rem] leading-relaxed text-[#D8D3C9]">{st.address || t('hq')}</p>
            <p className="mt-3 inline-flex items-center gap-2 font-mono text-[.8rem] text-[#A39E94]"><span className="live-dot" /> {t('hours')} <BakuClock /></p>
          </div>
        </div>

        <div aria-hidden className="select-none font-display text-[clamp(3.5rem,17vw,15rem)] font-semibold leading-[.8] tracking-[-.06em] text-white/[.06]">
          {(st.brand || 'digiterial').toLowerCase()}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-[#8C877D]">
          <span>© {new Date().getFullYear()} {st.brand}. {t('rights')}</span>
          <a href="#top" className="ulink decoration-white/20">{(await getTranslations('common'))('backTop')} ↑</a>
        </div>
      </div>
    </footer>
  );
}
