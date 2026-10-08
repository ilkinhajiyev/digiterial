import { getTranslations } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { BakuClock } from '@/components/site/interactive';
import { Accent } from '@/components/site/accent';
import type { SiteSettings } from '@/lib/data/settings';

export default async function SiteFooter({ st }: { st: SiteSettings }) {
  const t = await getTranslations('footer');
  const n = await getTranslations('nav');
  const c = await getTranslations('common');
  const socials = (['instagram', 'linkedin', 'tiktok', 'facebook', 'youtube'] as const)
    .filter((k) => st.social[k]).map((k) => ({ k, n: k[0].toUpperCase() + k.slice(1), u: st.social[k]! }));
  const nav = [['/xidmetler', n('services')], ['/isler', n('work')], ['/case-studies', n('cases')], ['/haqqimizda', n('about')], ['/bloq', n('blog')], ['/elaqe', n('contact')]] as const;
  const head = 'mb-5 font-mono text-[.66rem] uppercase tracking-[.22em] text-ash';
  const link = 'block w-fit py-1.5 text-[.95rem] text-[color:var(--fg-2)] transition-colors hover:text-brand';

  return (
    <footer className="relative overflow-hidden border-t border-[color:var(--line)] pt-24 md:pt-32">
      <div className="wrap">
        <Link href="/elaqe" className="group block">
          <div className="eyebrow">{n('cta')}</div>
          <div className="mt-8 flex items-end justify-between gap-6">
            <h2 className="t-display max-w-[12ch] text-[clamp(3rem,8vw,8rem)] leading-[.88] transition-colors duration-500 group-hover:text-brand"><Accent text={t('ctaH')} /></h2>
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full border border-[color:var(--line-2)] transition duration-700 ease-out group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand group-hover:text-ink md:h-32 md:w-32">
              <ArrowUpRight size={34} strokeWidth={1.25} />
            </span>
          </div>
        </Link>

        <div className="mt-20 grid grid-cols-2 gap-10 border-t border-[color:var(--line)] py-14 md:grid-cols-12">
          <div className="col-span-2 md:col-span-4">
            <p className="max-w-[32ch] font-display text-[1.6rem] leading-snug text-bone">{t('tagline')}</p>
          </div>
          <div className="md:col-span-2 md:col-start-6">
            <div className={head}>{t('discover')}</div>
            {nav.map(([href, label]) => <Link key={href} href={href} className={link}>{label}</Link>)}
          </div>
          <div className="md:col-span-2">
            <div className={head}>{t('contact')}</div>
            <a className={link} href={`mailto:${st.email}`}>{st.email}</a>
            <a className={link} href={`tel:${st.phone.replace(/\s/g, '')}`}>{st.phone}</a>
            {st.whatsapp && <a className={link} href={`https://wa.me/${st.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
            {socials.map((s) => <a key={s.k} className={link} href={s.u} target="_blank" rel="noopener noreferrer">{s.n}</a>)}
          </div>
          <div className="col-span-2 md:col-span-3">
            <div className={head}>{t('office')}</div>
            <p className="text-[.95rem] leading-relaxed text-[color:var(--fg-2)]">{st.address || t('hq')}</p>
            <p className="mt-4 inline-flex items-center gap-2.5 font-mono text-[.75rem] text-ash"><span className="live-dot" /> {t('hours')} <BakuClock /></p>
          </div>
        </div>
      </div>

      <div aria-hidden className="select-none overflow-hidden whitespace-nowrap text-center font-display text-[clamp(5rem,22vw,22rem)] italic leading-[.75] tracking-[-.04em]">
        <span className="bg-gradient-to-b from-white/[.12] to-transparent bg-clip-text text-transparent">{st.brand || 'Digiterial'}</span>
      </div>

      <div className="wrap">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--line)] py-6 font-mono text-[.7rem] uppercase tracking-[.16em] text-ash">
          <span>© {new Date().getFullYear()} <span className="normal-case">{st.brand}</span>. {t('rights')}</span>
          <a href="#top" className="transition hover:text-bone">{c('backTop')} ↑</a>
        </div>
      </div>
    </footer>
  );
}
