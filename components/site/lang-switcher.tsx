'use client';
import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';

const langs = [
  { code: 'az', short: 'AZ', label: 'Azərbaycan' },
  { code: 'en', short: 'EN', label: 'English' },
  { code: 'ru', short: 'RU', label: 'Русский' },
  { code: 'de', short: 'DE', label: 'Deutsch' },
] as const;

export default function LangSwitcher({ align = 'right' }: { align?: 'left' | 'right' }) {
  const pathname = usePathname();
  const active = useLocale();
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cur = langs.find((l) => l.code === active) || langs[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc); document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open} aria-label={`${t('language')}: ${cur.label}`}
        className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 font-mono text-[.75rem] text-[color:var(--fg-2)] transition hover:text-bone">
        <Globe size={15} strokeWidth={1.6} />{cur.short}<ChevronDown size={14} className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul role="listbox" className={`absolute top-12 z-50 w-48 overflow-hidden rounded-2xl border border-white/10 bg-coal/95 p-1.5 shadow-[0_30px_60px_-20px_rgba(0,0,0,.9)] backdrop-blur-xl ${align === 'right' ? 'right-0' : 'left-0'}`}>
          {langs.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === active}>
              <Link href={pathname} locale={l.code} onClick={() => setOpen(false)} hrefLang={l.code}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition hover:bg-white/[.05] ${l.code === active ? 'text-bone' : 'text-[color:var(--fg-3)]'}`}>
                <span><span className="mr-2 font-mono text-xs text-ash">{l.short}</span>{l.label}</span>
                {l.code === active && <Check size={15} className="text-brand" />}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
