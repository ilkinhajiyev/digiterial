'use client';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { Arrow } from '../icons';
import { useT } from '@/lib/i18n/client';

export type ShowcaseItem = { slug: string; client: string; url?: string; desktop: string };

/** Ember hero: mərkəzləşmiş başlıq, isti işıq kürəsi, əyilmiş brauzer çərçivəsində real layihələr və rəqəm kartları. */
export default function Hero({ serviceCount, showcase }: { serviceCount: number; showcase: ShowcaseItem[] }) {
  const t = useT();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (showcase.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const iv = setInterval(() => setI((x) => (x + 1) % showcase.length), 5200);
    return () => clearInterval(iv);
  }, [showcase.length]);
  const cur = showcase[i];
  const host = (cur?.url || '').replace(/^https?:\/\//, '').replace(/\/$/, '');

  return (
    <section className="shero ember-dark" aria-label={t('Digiterial ana səhifə')}>
      <div className="eh-orb" aria-hidden="true" />
      <div className="eh-orb eh-orb-cut" aria-hidden="true" />
      <div className="eh-lines" aria-hidden="true" />

      <div className="wrap shero-in">
        <Link href="/xidmetler/email-marketinq" className="eh-pill">
          <b>{t('Yeni')}</b>{t('Email marketinq və korporativ email xidmətləri')} <Arrow />
        </Link>
        <h1 className="display">
          {t('Qlobal standartda')} <em>{t('rəqəmsal böyümə')}</em>
        </h1>
        <p className="lead">
          {t('Sayt, SEO, reklam, brendinq və avtomatlaşdırma bir komandada. Bakıda 2018-dən bəri {n} xidmət, çoxdilli saytlar və beynəlxalq bazarlar üçün kampaniyalar. Bir hədəf: ölçülə bilən nəticə.', { n: serviceCount })}
        </p>
        <div className="ctas">
          <Link className="btn btn-primary" href="/elaqe">{t('Layihəni müzakirə et')} <Arrow /></Link>
          <Link className="btn btn-ghost" href="/isler">{t('İşlərə bax')}</Link>
        </div>
      </div>

      {cur && (
        <div className="wrap eh-stage">
          <div className="eh-chip k1" aria-hidden="true">
            {t('Performans balı')}<b>90+</b>
            <svg width="130" height="34" viewBox="0 0 130 34"><path d="M2 30 L22 24 L42 26 L62 16 L82 18 L102 8 L128 3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
          </div>
          <div className="eh-chip k2" aria-hidden="true">{t('Google-da mövqe')}<b>#1</b></div>
          <div className="eh-chip k3" aria-hidden="true">{t('Cavab müddəti')}<b>{t('24 saat')}</b></div>
          <div className="eh-frame">
            <div className="eh-bar">
              <i /><i /><i /><span>{host || cur.client}</span>
              <Link href={`/isler/${cur.slug}`}>{t('Seçilmiş iş')} · {cur.client} <Arrow /></Link>
            </div>
            <div className="eh-view">
              {showcase.map((s, k) => (
                <img key={s.slug} src={s.desktop} alt={t('{name} saytının ana səhifəsi', { name: s.client })} className={k === i ? 'on' : ''}
                  loading={k === 0 ? 'eager' : 'lazy'} fetchPriority={k === 0 ? 'high' : undefined} decoding="async" />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
