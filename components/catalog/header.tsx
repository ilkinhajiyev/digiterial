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
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', place);
    };
  }, [open]);

  return (
    <>
    <header ref={headerRef} className="sticky top-0 z-40 border-b border-[#E4E7EB] bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="SOCHİ MMC">
          <Image src="/media/brand/sochi-logo.png" alt="" width={44} height={44} className="h-11 w-11" />
          <span className="hidden text-sm font-semibold tracking-wide text-[#0A286E] sm:block">SOCHİ MMC</span>
        </Link>

        <button
          type="button"
          className="hidden h-11 items-center rounded-full border border-[#D5DAE1] px-4 text-sm font-medium text-[#1C1F24] lg:inline-flex"
          aria-expanded={open}
          aria-controls="category-menu"
          onClick={() => setOpen((value) => !value)}
        >
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
            className="h-11 w-full rounded-full border border-[#D5DAE1] bg-[#F7F8FA] px-4 text-base text-[#1C1F24] outline-none"
          />
        </form>

        <nav aria-label={t('languages')} className="flex items-center gap-1 text-sm font-medium">
          {(['az', 'en', 'ru'] as const).map((code) => (
            <Link
              key={code}
              href={pathname}
              locale={code}
              hrefLang={code}
              className={`rounded px-1.5 py-1 uppercase ${code === locale ? 'text-[#0A286E]' : 'text-[#6B7280]'}`}
              aria-current={code === locale ? 'page' : undefined}
            >
              {code}
            </Link>
          ))}
        </nav>

        <a href={`tel:+${phone.replace(/\D/g, '')}`} className="hidden text-sm font-medium text-[#1C1F24] xl:inline">
          {t('contact')}
        </a>

        <Link href="/sifaris" className="relative inline-flex h-11 items-center rounded-full bg-[#0A286E] px-3 text-sm font-medium text-white">
          <span className="max-w-[7rem] truncate sm:max-w-none">{orderLabel}</span>
          <span className="ml-2 inline-flex min-w-6 justify-center rounded-full bg-white px-1.5 text-xs font-semibold text-[#0A286E]">{count}</span>
        </Link>

        <button
          type="button"
          className="inline-flex h-11 items-center rounded-full border border-[#D5DAE1] px-3 text-sm lg:hidden"
          aria-expanded={open}
          aria-controls="category-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? t('close') : t('menu')}
        </button>
      </div>

      <form action={searchAction} className="mx-auto max-w-6xl px-4 pb-3 md:hidden" role="search">
        <label className="sr-only" htmlFor="q-mobile">
          {t('search')}
        </label>
        <input id="q-mobile" name="q" placeholder={t('search')} className="h-12 w-full rounded-xl border border-[#D5DAE1] bg-[#F7F8FA] px-4 text-base" />
        </form>
    </header>

      {open && (
        <div id="category-menu" className="fixed inset-x-0 bottom-0 z-40 overflow-auto border-t border-[#E4E7EB] bg-white" style={{ top: menuTop }}>
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <div key={category.id}>
                <Link href={`/kataloq/${category.id}`} className="font-semibold text-[#0A286E]">
                  {category.name}
                </Link>
                <ul className="mt-2 space-y-1">
                  {category.subs.map((sub) => (
                    <li key={sub.id}>
                      <Link href={`/kataloq/${category.id}?alt=${sub.id}`} className="text-sm text-[#374151] hover:text-[#0A286E]">
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="space-y-2 text-sm sm:col-span-2 lg:col-span-4">
              <Link href="/xidmetler" className="mr-4 inline-block font-medium">{t('services')}</Link>
              <Link href="/about" className="mr-4 inline-block font-medium">{t('about')}</Link>
              <Link href="/contact" className="mr-4 inline-block font-medium">{t('contact')}</Link>
              <Link href="/sertifikatlar" className="mr-4 inline-block font-medium">{t('certificates')}</Link>
              <Link href="/blog" className="inline-block font-medium">{t('blog')}</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
