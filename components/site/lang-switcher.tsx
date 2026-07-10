'use client';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

function Flag({ code }: { code: string }) {
  // Azərbaycan
  if (code === 'az') return (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect width="24" height="8" fill="#0098C3" /><rect y="8" width="24" height="8" fill="#ED2939" /><rect y="16" width="24" height="8" fill="#3F9C35" />
      <circle cx="10.8" cy="12" r="3" fill="#fff" /><circle cx="11.9" cy="12" r="2.4" fill="#ED2939" />
      <path d="M14.2 10.6l.5 1.1 1.2.1-.9.8.3 1.2-1.1-.7-1.1.7.3-1.2-.9-.8 1.2-.1z" fill="#fff" />
    </svg>
  );
  // Rusiya
  if (code === 'ru') return (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect width="24" height="8" fill="#fff" /><rect y="8" width="24" height="8" fill="#0039A6" /><rect y="16" width="24" height="8" fill="#D52B1E" />
    </svg>
  );
  // İngilis dili → Böyük Britaniya (Union Jack)
  if (code === 'en') return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <clipPath id="uk-c"><circle cx="30" cy="30" r="30" /></clipPath>
      <g clipPath="url(#uk-c)">
        <rect width="60" height="60" fill="#012169" />
        <path d="M0,0 L60,60 M60,0 L0,60" stroke="#fff" strokeWidth="12" />
        <path d="M0,0 L60,60 M60,0 L0,60" stroke="#C8102E" strokeWidth="6" />
        <path d="M30,0 V60 M0,30 H60" stroke="#fff" strokeWidth="20" />
        <path d="M30,0 V60 M0,30 H60" stroke="#C8102E" strokeWidth="12" />
      </g>
    </svg>
  );
  // Alman → Almaniya
  if (code === 'de') return (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect width="24" height="8" fill="#000" /><rect y="8" width="24" height="8" fill="#DD0000" /><rect y="16" width="24" height="8" fill="#FFCE00" />
    </svg>
  );
  return null;
}

const langs = [
  { code: 'az', label: 'Azərbaycan' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'de', label: 'Deutsch' },
];

export default function LangSwitcher({ size = 'sm', onPick }: { size?: 'sm' | 'lg'; onPick?: () => void }) {
  const pathname = usePathname();
  const active = useLocale();
  const dim = size === 'lg' ? 'w-9 h-9' : 'w-7 h-7';
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {langs.map((l) => (
        <Link key={l.code} href={pathname} locale={l.code} onClick={onPick} aria-label={l.label}
          className={`relative ${dim} rounded-full overflow-hidden grid place-items-center transition-all duration-300 hover:scale-110
            ${active === l.code ? 'ring-2 ring-brand ring-offset-2 ring-offset-ink scale-105' : 'opacity-55 hover:opacity-100 ring-1 ring-white/15'}`}>
          <Flag code={l.code} />
        </Link>
      ))}
    </div>
  );
}
