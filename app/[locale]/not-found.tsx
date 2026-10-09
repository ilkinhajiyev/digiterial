import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('notFound'); const n = await getTranslations('nav');
  return (
    <section className="relative overflow-hidden pb-24 pt-36 md:pt-48">
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(circle_at_30%_40%,#000,transparent_70%)]" />
      <div className="wrap relative">
        <div aria-hidden className="text-[clamp(7rem,24vw,18rem)] font-semibold leading-[.8] tracking-[-.08em] text-brand">{t('code')}</div>
        <h1 className="t-h2 mt-10">{t('title')}</h1>
        <p className="t-lead mt-5 max-w-[48ch]">{t('text')}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn-accent">{t('home')} <ArrowRight size={18} className="arr" /></Link>
          <Link href="/elaqe" className="btn-ghost">{n('contact')}</Link>
        </div>
      </div>
    </section>
  );
}
