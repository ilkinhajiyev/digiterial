'use client';
import { Link } from '@/i18n/navigation';
import { useT } from '@/lib/i18n/client';
import MascotFigure from '../mascot-figure';

/** Quiet Daylight brand moment — interactive mascot, not a sticker cluster. */
export default function MascotMoment() {
  const t = useT();
  return (
    <section className="mascot-moment" aria-label={t('Digiterial maskotu')}>
      <div className="wrap mascot-moment-in">
        <figure className="mascot-moment-fig">
          <MascotFigure
            className="mascot-moment-fig-inner"
            width={380}
            height={520}
            alt={t('Digiterial maskotu — ağ robot, firuzəyi ürək gözlər')}
            priority={false}
          />
        </figure>
        <div className="mascot-moment-copy">
          <p className="eyebrow">{t('Maskot')}</p>
          <h2 className="display">{t('Kiçik robot.')} <em>{t('Böyük ürək.')}</em></h2>
          <p className="lead">
            {t(
              'Daylight Atelier-in üzüdür: sakit, dəqiq və firuzəyi ürək gözlərlə. Hover et — o da cavab verir.',
            )}
          </p>
          <Link className="btn btn-ghost" href="/haqqimizda">
            {t('Haqqımızda')}
          </Link>
        </div>
      </div>
    </section>
  );
}
