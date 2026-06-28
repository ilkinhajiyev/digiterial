'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import LangSwitcher from '@/components/site/lang-switcher';

const items = [
  { key: 'work', href: '/isler', n: '01' },
  { key: 'services', href: '/xidmetler', n: '02' },
  { key: 'cases', href: '/case-studies', n: '03' },
  { key: 'about', href: '/haqqimizda', n: '04' },
  { key: 'blog', href: '/bloq', n: '05' },
] as const;

export default function SiteHeader() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 20); f(); window.addEventListener('scroll', f); return () => window.removeEventListener('scroll', f); }, []);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-ink/85 backdrop-blur-md border-b border-white/15' : 'bg-transparent'}`}>
        <div className="wrap flex items-center justify-between h-[68px] md:h-[74px]">
          <Link href="/" className="font-display font-bold text-lg md:text-xl tracking-tight flex items-center z-50">
            Digiterial<span className="w-2 h-2 rounded-full bg-brand ml-1" />
          </Link>
          <nav className="hidden lg:flex gap-1">
            {items.map((i) => (
              <Link key={i.key} href={i.href} className="text-sm text-neutral-300 px-3 py-2 rounded-full hover:text-brand transition">
                <span className="font-mono text-[.66rem] text-mut mr-1.5">{i.n}</span>{t(i.key)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden md:block"><LangSwitcher size="sm" /></div>
            <Link href="/elaqe" className="hidden lg:inline-flex hbtn hbtn-y text-sm py-2.5">{t('cta')}</Link>
            <button aria-label="Menyu" onClick={() => setOpen(!open)}
              className="lg:hidden w-11 h-11 border border-white/15 rounded-xl flex flex-col items-center justify-center gap-[5px] z-50 active:scale-95 transition">
              <span className={`w-[18px] h-0.5 bg-white transition-all duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`w-[18px] h-0.5 bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`w-[18px] h-0.5 bg-white transition-all duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBİL MENYU */}
      <div className={`lg:hidden fixed inset-0 z-40 bg-ink transition-all duration-400 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="h-full flex flex-col px-6 pt-24 pb-10">
          <nav className="flex-1 flex flex-col justify-center">
            {items.map((i, idx) => (
              <Link key={i.key} href={i.href}
                className="group flex items-baseline gap-4 py-3 border-b border-white/10 active:text-brand"
                style={{ transitionDelay: `${idx * 40}ms` }}>
                <span className="font-mono text-xs text-brand">{i.n}</span>
                <span className="font-display font-bold text-[2rem] leading-tight group-hover:text-brand transition">{t(i.key)}</span>
              </Link>
            ))}
          </nav>
          <div className="space-y-5">
            <Link href="/elaqe" className="hbtn hbtn-y w-full justify-center text-lg py-4">{t('cta')} ↗</Link>
            <div className="flex items-center justify-between pt-2">
              <span className="font-mono text-xs uppercase text-mut">Dil</span>
              <LangSwitcher size="lg" onPick={() => setOpen(false)} />
            </div>
            <div className="flex items-center justify-between font-mono text-xs text-mut pt-4 border-t border-white/10">
              <a href="mailto:salam@digiterial.com" className="hover:text-brand">salam@digiterial.com</a>
              <a href="tel:+994604996340" className="hover:text-brand">+994 60 499 63 40</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
