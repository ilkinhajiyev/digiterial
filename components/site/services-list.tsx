'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { services } from '@/lib/data/services';
import { ServiceIcon } from '@/components/site/service-icons';

export default function ServicesList({ label, heading }: { label: string; heading: string }) {
  const t = useTranslations('svc');
  return (
    <section className="py-20 md:py-28 bg-paper text-ink"><div className="wrap">
      <div className="elbl text-ink/55">{label}</div>
      <h2 className="font-display font-bold text-[clamp(1.9rem,5vw,3.6rem)] mt-4 max-w-[16ch]">{heading}</h2>
      <div className="mt-8 border-t border-ink/15 overflow-hidden rounded-2xl">
        {services.map((s, idx) => (
          <Link key={s.slug} href={`/xidmetler/${s.slug}`}
            className="group grid grid-cols-[40px_1fr_auto] sm:grid-cols-[64px_1fr_auto] gap-4 sm:gap-6 items-center px-4 sm:px-6 py-5 sm:py-7 bg-white hover:bg-ink border-b border-ink/10 transition-colors duration-300">
            <span className="font-mono text-brand text-sm sm:text-base">{String(idx + 1).padStart(2, '0')}</span>
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <span className="text-ink/35 group-hover:text-brand transition-colors hidden sm:block shrink-0"><ServiceIcon slug={s.slug} className="w-7 h-7" /></span>
              <h3 className="font-display font-bold text-[clamp(1.25rem,3.4vw,2.4rem)] text-ink group-hover:text-brand transition-colors truncate">{t(`${s.slug}.title`)}</h3>
            </div>
            <span className="font-mono text-xs sm:text-sm text-ink/45 group-hover:text-brand transition-colors flex items-center gap-2"><span className="hidden md:inline">{t(`${s.slug}.tag`)}</span><span className="group-hover:translate-x-1 transition-transform">→</span></span>
          </Link>
        ))}
      </div>
    </div></section>
  );
}
