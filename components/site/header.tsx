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
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bone">{tc('skip')}</a>
      <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${scrolled || open ? 'border-b border-line bg-paper/85 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'}`}>
        <div className="wrap flex h-[72px] items-center justify-between gap-4">
          <Link href="/" aria-label={`${brand} — ${t('home')}`} className="shrink-0"><Logo brand={brand} logoUrl={logoUrl} /></Link>

          <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
            {items.map((i) => (
              <Link key={i.key} href={i.href} aria-current={isActive(i.href) ? 'page' : undefined}
                className={`rounded-full px-4 py-2 text-[.92rem] transition ${isActive(i.href) ? 'bg-ink text-bone' : 'text-[color:var(--ink-2)] hover:bg-ink/[.06] hover:text-ink'}`}>
                {t(i.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <LangSwitcher />
            <Link href="/elaqe" className="btn-primary hidden min-h-[42px] px-5 text-sm sm:inline-flex">{t('cta')} <ArrowUpRight size={16} className="arr" /></Link>
            <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? t('close') : t('menu')}
              className="relative grid h-11 w-11 place-items-center rounded-full bg-ink text-bone lg:hidden">
              <span className={`absolute h-[1.5px] w-4 bg-current transition duration-300 ${open ? 'rotate-45' : '-translate-y-[4px]'}`} />
              <span className={`absolute h-[1.5px] w-4 bg-current transition duration-300 ${open ? '-rotate-45' : 'translate-y-[4px]'}`} />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-nav" inert={!open ? true : undefined} aria-hidden={!open}
        className={`fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto bg-paper transition duration-300 ease-out lg:hidden ${open ? 'visible opacity-100' : 'invisible -translate-y-2 opacity-0'}`}>
        <div className="wrap flex min-h-full flex-col pb-8 pt-4">
          <nav aria-label="Mobile" className="flex-1">
            <Link href="/" className="flex items-center justify-between border-b border-line py-4 font-display text-[1.65rem] font-medium tracking-tight">{t('home')}</Link>
            {items.map((i, idx) => (
              <Link key={i.key} href={i.href} aria-current={isActive(i.href) ? 'page' : undefined}
                className="flex items-center justify-between border-b border-line py-4 font-display text-[1.65rem] font-medium tracking-tight"
                style={{ transitionDelay: open ? `${idx * 30}ms` : '0ms' }}>
                <span className={isActive(i.href) ? 'text-brand-deep' : ''}>{t(i.key)}</span>
                <span className="font-mono text-xs text-mut">0{idx + 1}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-8 space-y-4">
            <Link href="/elaqe" className="btn-brand w-full">{t('cta')} <ArrowUpRight size={18} className="arr" /></Link>
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[.78rem] text-[color:var(--ink-2)]">
              <a href={`mailto:${email}`} className="ulink">{email}</a>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="ulink">{phone}</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
