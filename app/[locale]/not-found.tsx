import { getTranslations } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('notFound'); const n = await getTranslations('nav');
  return (
    <section className="relative overflow-hidden pb-24 pt-36 md:pt-48">
      <div className="wrap">
        <div aria-hidden className="font-display text-[clamp(7rem,26vw,20rem)] font-semibold leading-[.8] tracking-[-.06em] text-brand">{t('code')}</div>
        <h1 className="t-h2 mt-8">{t('title')}</h1>
        <p className="t-lead mt-4 max-w-[48ch]">{t('text')}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn-primary">{t('home')} <ArrowUpRight size={18} className="arr" /></Link>
          <Link href="/elaqe" className="btn-ghost">{n('contact')}</Link>
        </div>
      </div>
    </section>
  );
}
