'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { localePath } from '@/lib/seo';
import { orderCount } from '@/lib/catalog/order';
import type { Locale } from '@/lib/catalog/types';

export type MenuCategory = { id: string; name: string; subs: { id: string; name: string }[] };

export function Header({
  categories,
  phone,
  orderLabel,
}: {
  categories: MenuCategory[];
  phone: string;
  orderLabel: string;
}) {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const [count, setCount] = useState(0);
  const searchAction = localePath('/kataloq', locale);

  useEffect(() => {
    const read = () => setCount(orderCount());
    read();
    window.addEventListener('sochi-order', read);
    window.addEventListener('storage', read);
    return () => {
      window.removeEventListener('sochi-order', read);
      window.removeEventListener('storage', read);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const place = () => setMenuTop(headerRef.current?.getBoundingClientRect().bottom || 0);
    place();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', place);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', place);
    };
  }, [open]);

  return (
    <>
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-[#E6E8EC] bg-white">
      <div className="mx-auto flex max-w-[1280px] items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="SOCHİ MMC">
          <Image src="/media/brand/sochi-logo.png" alt="" width={40} height={40} className="h-10 w-10" />
          <span className="text-[15px] font-bold tracking-tight text-[#0A286E]">SOCHİ MMC</span>
        </Link>

        <button
          type="button"
          className="hidden h-10 shrink-0 items-center gap-2 rounded-lg bg-[#0A286E] px-3.5 text-sm font-semibold text-white lg:inline-flex"
          aria-expanded={open}
          aria-controls="category-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden className="text-base leading-none">☰</span>
          {t('categories')}
        </button>

        <form action={searchAction} className="hidden min-w-0 flex-1 md:block" role="search">
          <label className="sr-only" htmlFor="q-desktop">
            {t('search')}
          </label>
          <input
            id="q-desktop"
            name="q"
            placeholder={t('search')}
            className="h-10 w-full rounded-lg border border-transparent bg-[#F3F4F6] px-4 text-sm text-[#1A1A1A] outline-none focus:border-[#0A286E]"
          />
        </form>

        <nav aria-label={t('languages')} className="hidden items-center text-[13px] font-semibold sm:flex">
          {(['az', 'en', 'ru'] as const).map((code) => (
            <Link
              key={code}
              href={pathname}
              locale={code}
              hrefLang={code}
              className={`px-1.5 py-1 uppercase ${code === locale ? 'text-[#0A286E]' : 'text-[#8A9099]'}`}
              aria-current={code === locale ? 'page' : undefined}
            >
              {code}
            </Link>
          ))}
        </nav>

        <a href={`tel:+${phone.replace(/\D/g, '')}`} className="hidden text-sm font-medium text-[#1A1A1A] xl:inline">
          {t('contact')}
        </a>

        <Link href="/sifaris" aria-label={orderLabel} className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#0A286E] text-white sm:h-10 sm:w-auto sm:gap-2 sm:px-3">
          <svg viewBox="0 0 24 24" className="h-5 w-5 sm:hidden" aria-hidden fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6h15l-1.5 9h-12z" /><path d="M6 6 5 3H2" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>
          <span className="hidden text-sm font-semibold sm:inline">{orderLabel}</span>
          <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-md bg-white px-1 text-xs font-bold text-[#0A286E] sm:static">{count}</span>
        </Link>

        <button
          type="button"
          className="inline-flex h-12 shrink-0 items-center rounded-lg border border-[#E6E8EC] bg-white px-3 text-sm font-semibold lg:hidden"
          aria-expanded={open}
          aria-controls="category-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? t('close') : t('menu')}
        </button>
      </div>

      <form action={searchAction} className="mx-auto flex max-w-[1280px] gap-2 px-3 pb-2.5 md:hidden" role="search">
        <label className="sr-only" htmlFor="q-mobile">
          {t('search')}
        </label>
        <input id="q-mobile" name="q" placeholder={t('search')} className="h-12 min-w-0 flex-1 rounded-lg border border-transparent bg-[#F3F4F6] px-4 text-base text-[#1A1A1A] outline-none focus:border-[#0A286E]" />
        <button type="submit" className="h-12 shrink-0 rounded-lg bg-[#0A286E] px-4 text-sm font-semibold text-white">{t('searchSubmit')}</button>
      </form>

      <nav aria-label={t('categories')} className="border-t border-[#F0F1F3]">
        <div className="shelf mx-auto flex max-w-[1280px] gap-1 overflow-x-auto px-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/kataloq/${category.id}`}
              className="inline-flex min-h-12 shrink-0 items-center px-3 text-[13px] font-medium text-[#2B2F36] hover:text-[#0A286E]"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>

      {open && (
        <div id="category-menu" className="fixed inset-x-0 bottom-0 z-40 overflow-auto border-t border-[#E6E8EC] bg-white" style={{ top: menuTop }}>
          <div className="mx-auto grid max-w-[1280px] gap-5 px-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <div key={category.id}>
                <Link href={`/kataloq/${category.id}`} className="flex min-h-12 items-center text-base font-semibold text-[#0A286E]">
                  {category.name}
                </Link>
                <ul>
                  {category.subs.map((sub) => (
                    <li key={sub.id}>
                      <Link href={`/kataloq/${category.id}?alt=${sub.id}`} className="flex min-h-11 items-center text-sm text-[#3A3F47] hover:text-[#0A286E]">
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="space-y-3 text-sm sm:col-span-2 lg:col-span-4">
              <nav aria-label={t('languages')} className="flex gap-2 sm:hidden">
                {(['az', 'en', 'ru'] as const).map((code) => (
                  <Link
                    key={code}
                    href={pathname}
                    locale={code}
                    hrefLang={code}
                    className={`inline-flex h-10 items-center rounded-lg border px-3 uppercase ${code === locale ? 'border-[#0A286E] font-semibold text-[#0A286E]' : 'border-[#E6E8EC] text-[#3A3F47]'}`}
                    aria-current={code === locale ? 'page' : undefined}
                  >
                    {code}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-[#F0F1F3] pt-3">
                <Link href="/xidmetler" className="font-medium">{t('services')}</Link>
                <Link href="/about" className="font-medium">{t('about')}</Link>
                <Link href="/contact" className="font-medium">{t('contact')}</Link>
                <Link href="/sertifikatlar" className="font-medium">{t('certificates')}</Link>
                <Link href="/blog" className="font-medium">{t('blog')}</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
