'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const items = [
  { key: 'work', href: '/isler', n: '01' },
  { key: 'services', href: '/xidmetler', n: '02' },
  { key: 'cases', href: '/case-studies', n: '03' },
  { key: 'about', href: '/haqqimizda', n: '04' },
  { key: 'blog', href: '/bloq', n: '05' },
] as const;

export default function SiteHeader() {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-ink/70 backdrop-blur-md border-b border-white/15">
        <div className="wrap flex items-center justify-between h-[74px]">
          <Link href="/" className="font-display font-bold text-xl tracking-tight flex items-center">
            Digiterial<span className="w-2 h-2 rounded-full bg-brand ml-1" />
          </Link>
          <nav className="hidden lg:flex gap-1">
            {items.map((i) => (
              <Link key={i.key} href={i.href} className="text-sm text-neutral-300 px-3 py-2 rounded-full hover:text-brand">
                <span className="font-mono text-[.66rem] text-mut mr-1.5">{i.n}</span>{t(i.key)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex font-mono text-xs text-mut-d gap-2">
              <Link href="/" locale="az" className="text-brand">AZ</Link>
              <Link href="/" locale="en">EN</Link>
              <Link href="/" locale="ru">RU</Link>
            </div>
            <Link href="/elaqe" className="hidden lg:inline-flex hbtn hbtn-y text-sm py-3">{t('cta')}</Link>
            <button aria-label="Menyu" onClick={() => setOpen(!open)}
              className="lg:hidden w-[42px] h-[42px] border border-white/15 rounded-[10px] flex flex-col items-center justify-center gap-[5px]">
              <span className={`w-[18px] h-0.5 bg-white transition ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`w-[18px] h-0.5 bg-white transition ${open ? 'opacity-0' : ''}`} />
              <span className={`w-[18px] h-0.5 bg-white transition ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </header>
      {open && (
        <nav className="fixed inset-0 z-40 bg-ink/98 backdrop-blur flex flex-col justify-center px-7 gap-1">
          {items.map((i) => (
            <Link key={i.key} href={i.href} onClick={() => setOpen(false)}
              className="font-display font-bold text-3xl py-3 border-b border-white/15 active:text-brand">{t(i.key)}</Link>
          ))}
          <Link href="/elaqe" onClick={() => setOpen(false)} className="hbtn hbtn-y justify-center mt-6 text-lg">{t('cta')}</Link>
        </nav>
      )}
    </>
  );
}
