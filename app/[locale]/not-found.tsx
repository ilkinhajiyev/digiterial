import { Link } from '@/i18n/navigation';
import { Arrow } from '@/components/dg/icons';
import { useServerT } from '@/lib/i18n/server';

export default function NotFound() {
  const t = useServerT();
  return (
    <section className="sp-hero" style={{ minHeight: '60vh' }}>
      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        <div className="label">{t('Xəta 404')}</div>
        <h1 className="display" style={{ fontSize: 'clamp(3rem,9vw,8rem)', marginTop: 24 }}>{t('Səhifə')} <em>{t('tapılmadı.')}</em></h1>
        <p className="lead" style={{ marginTop: 24 }}>{t('Ünvan dəyişmiş və ya silinmiş ola bilər. Ana səhifədən davam edin və ya bizə yazın.')}</p>
        <div className="ctas"><Link className="btn btn-accent" href="/">{t('Ana səhifə')} <Arrow /></Link><Link className="btn btn-ghost" href="/elaqe">{t('Əlaqə')}</Link></div>
      </div>
    </section>
  );
}
