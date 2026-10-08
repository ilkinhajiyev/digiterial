'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import LangSwitcher from '@/components/site/lang-switcher';
import Logo from '@/components/site/logo';

const items = [
  { key: 'services', href: '/xidmetler' },
  { key: 'work', href: '/isler' },
  { key: 'cases', href: '/case-studies' },
  { key: 'about', href: '/haqqimizda' },
  { key: 'blog', href: '/bloq' },
] as const;

export default function SiteHeader({ logoUrl, brand = 'Digiterial', email, phone }: { logoUrl?: string; brand?: string; email: string; phone: string }) {
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 8);
    f(); window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.documentElement.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-bone focus:px-4 focus:py-2 focus:text-ink">{tc('skip')}</a>
      <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${scrolled || open ? 'border-b border-white/[.07] bg-ink/75 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'}`}>
        <div className="wrap flex h-[76px] items-center justify-between gap-4">
          <Link href="/" aria-label={`${brand} — ${t('home')}`} className="shrink-0"><Logo brand={brand} logoUrl={logoUrl} /></Link>

          <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
            {items.map((i, idx) => (
              <Link key={i.key} href={i.href} aria-current={isActive(i.href) ? 'page' : undefined}
                className={`group relative py-2 text-[.9rem] transition-colors duration-300 ${isActive(i.href) ? 'text-bone' : 'text-[color:var(--fg-3)] hover:text-bone'}`}>
                <sup className="mr-1 font-mono text-[.55rem] text-brand/80">0{idx + 1}</sup>{t(i.key)}
                <span className={`absolute -bottom-0.5 left-0 h-px bg-brand transition-all duration-500 ease-out ${isActive(i.href) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <LangSwitcher />
            <Link href="/elaqe" className="btn-primary hidden min-h-[44px] px-5 text-sm sm:inline-flex">{t('cta')} <ArrowUpRight size={16} className="arr" /></Link>
            <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? t('close') : t('menu')}
              className="relative grid h-11 w-11 place-items-center rounded-full border border-white/15 text-bone lg:hidden">
              <span className={`absolute h-[1.5px] w-4 bg-current transition duration-300 ${open ? 'rotate-45' : '-translate-y-[4px]'}`} />
              <span className={`absolute h-[1.5px] w-4 bg-current transition duration-300 ${open ? '-rotate-45' : 'translate-y-[4px]'}`} />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-nav" inert={!open ? true : undefined} aria-hidden={!open}
        className={`fixed inset-x-0 bottom-0 top-[76px] z-40 overflow-y-auto bg-ink transition duration-500 ease-out lg:hidden ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div aria-hidden className="aurora pointer-events-none absolute inset-0" />
        <div className="wrap relative flex min-h-full flex-col pb-8 pt-4">
          <nav aria-label="Mobile" className="flex-1">
            <Link href="/" className="flex items-center justify-between border-b border-white/[.08] py-3 font-display text-[2.6rem] leading-none">{t('home')}</Link>
            {items.map((i, idx) => (
              <Link key={i.key} href={i.href} aria-current={isActive(i.href) ? 'page' : undefined}
                className="flex items-center justify-between border-b border-white/[.08] py-3 font-display text-[2.6rem] leading-none">
                <span className={isActive(i.href) ? 'italic text-brand' : ''}>{t(i.key)}</span>
                <span className="font-mono text-xs text-ash">0{idx + 1}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-8 space-y-4">
            <Link href="/elaqe" className="btn-gold w-full">{t('cta')} <ArrowUpRight size={18} className="arr" /></Link>
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[.75rem] text-ash">
              <a href={`mailto:${email}`} className="ulink">{email}</a>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="ulink">{phone}</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
