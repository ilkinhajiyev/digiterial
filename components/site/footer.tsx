import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { BakuClock } from '@/components/site/interactive';
import { getSettings, defaultSettings } from '@/lib/data/settings';

const ICONS: Record<string, string> = {
  instagram: 'M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.5-.1 4.8c-.1 3.2-1.6 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.9-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.5 2.2 15.2 2.2 12s0-3.5.1-4.8C2.4 4 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 3.2a6.6 6.6 0 100 13.2 6.6 6.6 0 000-13.2zm0 10.9a4.3 4.3 0 110-8.6 4.3 4.3 0 010 8.6zm6.8-11.1a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z',
  linkedin: 'M4.98 3.5a2 2 0 11-.02 4 2 2 0 01.02-4zM3 8.98h4v12H3v-12zm6.5 0h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v6.35h-4v-5.6c0-1.34-.02-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-4v-12z',
  tiktok: 'M16.5 3c.4 2 1.7 3.6 3.5 4v2.8c-1.3 0-2.5-.4-3.5-1v6.4a5.7 5.7 0 11-5.7-5.7c.3 0 .6 0 .9.1v2.9a2.8 2.8 0 102 2.7V3h2.8z',
  facebook: 'M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0022 12z',
};

export default async function SiteFooter() {
  const t = await getTranslations('footer');
  const st = await getSettings().catch(() => defaultSettings);
  const socials = (['instagram', 'linkedin', 'tiktok', 'facebook'] as const).filter((k) => st.social[k]).map((k) => ({ n: k[0].toUpperCase() + k.slice(1), u: st.social[k]!, d: ICONS[k] }));
  return (
    <footer className="pt-20 pb-9 border-t border-white/15">
      <div className="wrap">
        <div className="flex flex-wrap justify-between gap-10 pb-10 mb-10 border-b border-white/15">
          <div className="max-w-[36ch]">
            <div className="font-display font-bold text-2xl flex items-center">{st.brand}<span className="w-2 h-2 rounded-full bg-brand ml-1" /></div>
            <p className="text-mut-d mt-3 text-sm">{t('tagline')}</p>
            <div className="flex gap-2.5 mt-5">
              {socials.map((s) => (<a key={s.n} href={s.u} target="_blank" aria-label={s.n} className="w-10 h-10 rounded-full border border-white/15 grid place-items-center text-neutral-300 hover:bg-brand hover:text-ink hover:border-brand transition"><svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor"><path d={s.d} /></svg></a>))}
            </div>
          </div>
          <div className="font-mono text-sm text-mut-d text-right leading-loose"><b className="text-white font-medium">{t('hq')}</b><br />40.4093° N · 49.8671° E<br />{t('hours')} <BakuClock /></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div><h5 className="font-mono text-[.7rem] tracking-widest uppercase text-mut-d mb-4">{t('discover')}</h5>
            <Link className="block py-1 text-neutral-300 hover:text-brand text-sm w-fit ulink" href="/xidmetler">{t('services')}</Link>
            <Link className="block py-1 text-neutral-300 hover:text-brand text-sm w-fit ulink" href="/isler">{t('work')}</Link>
            <Link className="block py-1 text-neutral-300 hover:text-brand text-sm w-fit ulink" href="/bloq">{t('blog')}</Link>
            <Link className="block py-1 text-neutral-300 hover:text-brand text-sm w-fit ulink" href="/elaqe">{t('contact')}</Link></div>
          <div><h5 className="font-mono text-[.7rem] tracking-widest uppercase text-mut-d mb-4">{t('contact')}</h5>
            <a className="block py-1 text-neutral-300 hover:text-brand text-sm w-fit ulink" href={`mailto:${st.email}`}>{st.email}</a>
            <a className="block py-1 text-neutral-300 hover:text-brand text-sm w-fit ulink" href={`tel:${st.phone.replace(/\s/g, '')}`}>{st.phone}</a></div>
          <div><h5 className="font-mono text-[.7rem] tracking-widest uppercase text-mut-d mb-4">{t('social')}</h5>
            {socials.map((s) => <a key={s.n} className="block py-1 text-neutral-300 hover:text-brand text-sm w-fit ulink" href={s.u} target="_blank">{s.n}</a>)}</div>
          <div><h5 className="font-mono text-[.7rem] tracking-widest uppercase text-mut-d mb-4">{t('legal')}</h5>
            <a className="block py-1 text-neutral-300 hover:text-brand text-sm w-fit ulink" href="#">{t('privacy')}</a>
            <a className="block py-1 text-neutral-300 hover:text-brand text-sm w-fit ulink" href="#">{t('terms')}</a></div>
        </div>
        <div className="font-display font-bold text-[clamp(3rem,14vw,10rem)] tracking-tighter leading-none mt-14 flex items-end">{(st.brand || 'digiterial').toLowerCase()}<span className="w-3.5 h-3.5 rounded-full bg-brand ml-1.5" /></div>
        <div className="mt-10 pt-6 border-t border-white/15 text-mut-d text-sm">© 2018–2026 {st.brand}. {t('rights')}</div>
      </div>
    </footer>
  );
}
