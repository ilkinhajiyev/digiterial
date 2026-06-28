'use client';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

function Flag({ code }: { code: string }) {
  if (code === 'az') return (<svg viewBox="0 0 24 24" className="w-full h-full"><rect width="24" height="8" fill="#0098C3" /><rect y="8" width="24" height="8" fill="#ED2939" /><rect y="16" width="24" height="8" fill="#3F9C35" /><circle cx="10.8" cy="12" r="3" fill="#fff" /><circle cx="11.9" cy="12" r="2.4" fill="#ED2939" /><path d="M14.2 10.6l.5 1.1 1.2.1-.9.8.3 1.2-1.1-.7-1.1.7.3-1.2-.9-.8 1.2-.1z" fill="#fff" /></svg>);
  if (code === 'ru') return (<svg viewBox="0 0 24 24" className="w-full h-full"><rect width="24" height="8" fill="#fff" /><rect y="8" width="24" height="8" fill="#0039A6" /><rect y="16" width="24" height="8" fill="#D52B1E" /></svg>);
  return (<svg viewBox="0 0 24 24" className="w-full h-full"><rect width="24" height="24" fill="#fff" /><rect x="9" width="6" height="24" fill="#CE1124" /><rect y="9" width="24" height="6" fill="#CE1124" /></svg>);
}

const langs = [{ code: 'az', label: 'Azərbaycan' }, { code: 'en', label: 'English' }, { code: 'ru', label: 'Русский' }];

export default function LangSwitcher({ size = 'sm', onPick }: { size?: 'sm' | 'lg'; onPick?: () => void }) {
  const pathname = usePathname();
  const active = useLocale();
  const dim = size === 'lg' ? 'w-9 h-9' : 'w-7 h-7';
  return (
    <div className="flex items-center gap-2">
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
