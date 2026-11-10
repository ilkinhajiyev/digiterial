'use client';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { Arrow } from '../icons';
import { useT } from '@/lib/i18n/client';
import MascotFigure from '../mascot-figure';

export type ShowcaseItem = { slug: string; client: string; url?: string; desktop: string };

/** Full-bleed hero: brand is the signal; one headline, lead, CTAs; work imagery as atmosphere. */
export default function Hero({ serviceCount, showcase }: { serviceCount: number; showcase: ShowcaseItem[] }) {
  const t = useT();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (showcase.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const iv = setInterval(() => setI((x) => (x + 1) % showcase.length), 5200);
    return () => clearInterval(iv);
  }, [showcase.length]);
  const cur = showcase[i];

  return (
    <section className="shero" aria-label={t('Digiterial ana səhifə')}>
      <div className="shero-media" aria-hidden="true">
        {showcase.map((s, k) => (
          <img
            key={s.slug}
            src={s.desktop}
            alt=""
            className={k === i ? 'on' : ''}
            loading={k === 0 ? 'eager' : 'lazy'}
            fetchPriority={k === 0 ? 'high' : undefined}
            decoding="async"
          />
        ))}
        <div className="shero-veil" />
        <div className="shero-grain" />
      </div>

      <div className="wrap shero-in">
        <p className="shero-brand">
          Digiterial<span aria-hidden="true">.</span>
        </p>
        <h1 className="display">
          {t('Qlobal standartda')} <em>{t('rəqəmsal böyümə')}</em>
        </h1>
        <p className="lead">
          {t(
            'Sayt, SEO, reklam, brendinq və avtomatlaşdırma bir komandada. Bakıda 2018-dən bəri {n} xidmət — ölçülə bilən nəticə üçün.',
            { n: serviceCount },
          )}
        </p>
        <div className="ctas">
          <Link className="btn btn-accent" href="/elaqe">
            {t('Layihəni müzakirə et')} <Arrow />
          </Link>
          <Link className="btn btn-ghost" href="/isler">
            {t('İşlərə bax')}
          </Link>
        </div>
        {cur && (
          <p className="shero-credit">
            <span>{t('Seçilmiş iş')}</span>
            <Link href={`/isler/${cur.slug}`}>{cur.client}</Link>
          </p>
        )}
        <figure className="shero-mascot">
          <MascotFigure className="shero-mascot-fig" width={220} height={300} alt="" priority={false} />
        </figure>
      </div>
    </section>
  );
}
