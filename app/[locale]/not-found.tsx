import { getTranslations } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import LiquidOrb from '@/components/site/liquid-orb';

export default async function NotFound() {
  const t = await getTranslations('notFound'); const n = await getTranslations('nav');
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden pb-20 pt-40">
      <LiquidOrb className="absolute inset-0 opacity-70" />
      <div className="wrap relative">
        <div aria-hidden className="font-display text-[clamp(8rem,28vw,24rem)] italic leading-[.75] tracking-[-.04em] text-outline">{t('code')}</div>
        <h1 className="t-h1 mt-10">{t('title')}</h1>
        <p className="t-lead mt-6 max-w-[44ch]">{t('text')}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn-gold">{t('home')} <ArrowUpRight size={18} className="arr" /></Link>
          <Link href="/elaqe" className="btn-ghost">{n('contact')}</Link>
        </div>
      </div>
    </section>
  );
}
