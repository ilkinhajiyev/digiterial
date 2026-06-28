import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { BakuClock } from '@/components/site/interactive';

export default function SiteFooter() {
  const t = useTranslations('footer');
  return (
    <footer className="pt-20 pb-9 border-t border-white/15">
      <div className="wrap">
        <div className="flex flex-wrap justify-between gap-10 pb-10 mb-10 border-b border-white/15">
          <div className="max-w-[36ch]">
            <div className="font-display font-bold text-2xl flex items-center">Digiterial<span className="w-2 h-2 rounded-full bg-brand ml-1" /></div>
            <p className="text-mut-d mt-3 text-sm">{t('tagline')} Strategiya, dizayn, inkişaf və marketinq bir komandadan.</p>
          </div>
          <div className="font-mono text-sm text-mut-d text-right leading-loose">
            <b className="text-white font-medium">Bakı, Azərbaycan</b><br />40.4093° N · 49.8671° E<br />B.e – C · <BakuClock />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div><h5 className="font-mono text-[.7rem] tracking-widest uppercase text-mut-d mb-4">Kəşf et</h5>
            <Link className="block py-1 text-neutral-300 hover:text-brand text-sm" href="/xidmetler">Xidmətlər</Link>
            <Link className="block py-1 text-neutral-300 hover:text-brand text-sm" href="/isler">İşlər</Link>
            <Link className="block py-1 text-neutral-300 hover:text-brand text-sm" href="/bloq">Bloq</Link>
            <Link className="block py-1 text-neutral-300 hover:text-brand text-sm" href="/elaqe">Əlaqə</Link></div>
          <div><h5 className="font-mono text-[.7rem] tracking-widest uppercase text-mut-d mb-4">Əlaqə</h5>
            <a className="block py-1 text-neutral-300 hover:text-brand text-sm" href="mailto:salam@digiterial.com">salam@digiterial.com</a>
            <a className="block py-1 text-neutral-300 hover:text-brand text-sm" href="tel:+994604996340">+994 60 499 63 40</a></div>
          <div><h5 className="font-mono text-[.7rem] tracking-widest uppercase text-mut-d mb-4">İzlə</h5>
            <a className="block py-1 text-neutral-300 hover:text-brand text-sm" href="#">Instagram</a>
            <a className="block py-1 text-neutral-300 hover:text-brand text-sm" href="#">LinkedIn</a></div>
          <div><h5 className="font-mono text-[.7rem] tracking-widest uppercase text-mut-d mb-4">Hüquqi</h5>
            <a className="block py-1 text-neutral-300 hover:text-brand text-sm" href="#">Məxfilik</a>
            <a className="block py-1 text-neutral-300 hover:text-brand text-sm" href="#">Şərtlər</a></div>
        </div>
        <div className="font-display font-bold text-[clamp(3rem,14vw,10rem)] tracking-tighter leading-none mt-14 flex items-end">
          digiterial<span className="w-3.5 h-3.5 rounded-full bg-brand ml-1.5" />
        </div>
        <div className="flex justify-between mt-10 pt-6 border-t border-white/15 text-mut-d text-sm flex-wrap gap-3">
          <span>© 2018–2026 Digiterial. {t('rights')}</span>
        </div>
      </div>
    </footer>
  );
}
