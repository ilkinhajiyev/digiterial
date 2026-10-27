'use client';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { Arrow } from '../icons';
import { useT } from '@/lib/i18n/client';

export type ShowcaseItem = { slug: string; client: string; url?: string; desktop: string };

// SaaS hero: mərkəzləşmiş başlıq + real layihələri göstərən brauzer pəncərəsi (tab-larla keçid)
export default function Hero({ serviceCount, showcase }: { serviceCount: number; showcase: ShowcaseItem[] }) {
  const t = useT();
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto || showcase.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const iv = setInterval(() => setI((x) => (x + 1) % showcase.length), 4500);
    return () => clearInterval(iv);
  }, [auto, showcase.length]);
  const cur = showcase[i];
  return (
    <section className="shero">
      <div className="shero-glow" aria-hidden="true" />
      <div className="shero-grid" aria-hidden="true" />
      <svg className="shero-globe" viewBox="0 0 400 400" aria-hidden="true">
        <circle cx="200" cy="200" r="190" />
        {[-120, -60, 0, 60, 120].map((y) => <ellipse key={y} cx="200" cy={200 + y} rx={Math.sqrt(190 * 190 - y * y)} ry={Math.sqrt(190 * 190 - y * y) * 0.12} />)}
        {[0, 1, 2, 3, 4, 5].map((k) => <ellipse key={k} className="mer" cx="200" cy="200" rx="190" ry="190" style={{ animationDelay: `${-k * 2}s` }} />)}
      </svg>
      <div className="wrap shero-in">
        <Link href="/xidmetler/email-marketinq" className="pill"><span className="pill-tag">{t('Yeni')}</span>{t('Email marketinq və korporativ email xidmətləri')} <Arrow /></Link>
        <h1 className="display">{t('Qlobal standartda')} <em>{t('rəqəmsal böyümə')}</em></h1>
        <p className="lead">{t('Sayt, SEO, reklam, brendinq və avtomatlaşdırma bir komandada. Bakıda 2018-dən bəri {n} xidmət, çoxdilli saytlar və beynəlxalq bazarlar üçün kampaniyalar. Bir hədəf: ölçülə bilən nəticə.', { n: serviceCount })}</p>
        <div className="ctas">
          <Link className="btn btn-accent" href="/elaqe">{t('Layihəni müzakirə et')} <Arrow /></Link>
          <Link className="btn btn-ghost" href="/isler">{t('İşlərə bax')}</Link>
        </div>
      </div>
      {cur && (
        <div className="wrap wide">
          <div className="showcase">
            <div className="sc-tabs" role="tablist" aria-label={t('Layihələr')}>
              {showcase.map((s, k) => (
                <button key={s.slug} role="tab" aria-selected={k === i} onClick={() => { setAuto(false); setI(k); }}>{s.client}</button>
              ))}
            </div>
            <div className="sc-window">
              <div className="sc-bar"><i /><i /><i /><span>{(cur.url || '').replace(/^https?:\/\//, '').replace(/\/$/, '')}</span></div>
              <div className="sc-view">
                {showcase.map((s, k) => (
                  <img key={s.slug} src={s.desktop} alt={t('{name} saytının ana səhifəsi', { name: s.client })} className={k === i ? 'on' : ''} loading={k === 0 ? 'eager' : 'lazy'} fetchPriority={k === 0 ? 'high' : undefined} decoding="async" />
                ))}
              </div>
            </div>
            <Link className="sc-link" href={`/isler/${cur.slug}`}>{t('{name} layihəsinə bax', { name: cur.client })} <Arrow /></Link>
          </div>
        </div>
      )}
    </section>
  );
}
