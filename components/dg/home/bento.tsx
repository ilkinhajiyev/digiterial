import { Link } from '@/i18n/navigation';
import { services } from '@/lib/content/services';
import { Arrow, Icon, Check } from '../icons';
import { useServerT, useLocalize } from '@/lib/i18n/server';
import type { T } from '@/lib/i18n/core';

// Bento xidmət kartları: hər kartda xidmətə uyğun kiçik "məhsul" vizualı
const mini = (t: T): Record<string, React.ReactNode> => ({
  'veb-saytlar': (
    <div className="mini-web" aria-hidden="true">
      {['Performans', 'Əlçatanlıq', 'SEO'].map((l) => <span key={l}><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" /><circle cx="18" cy="18" r="15" className="v" /></svg><b>90+</b><small>{t(l)}</small></span>)}
    </div>
  ),
  seo: (
    <div className="mini-seo" aria-hidden="true">
      {[['sirketiniz.az', 1], ['rəqib-1.az', 2], ['kataloq.az', 3]].map(([d, n]) => <span key={d as string} className={n === 1 ? 'me' : ''}><em>{n}</em><b>{d}</b></span>)}
    </div>
  ),
  reklam: (
    <div className="mini-ads" aria-hidden="true">
      {[38, 52, 46, 70, 64, 88, 96].map((h, k) => <i key={k} style={{ height: `${h}%` }} />)}
      <span>ROAS · CPA · CTR</span>
    </div>
  ),
  'email-marketinq': (
    <div className="mini-mail" aria-hidden="true">
      {['Trigger: səbət tərk edildi', 'Gözləmə: 1 saat', 'Email: "Səbətiniz gözləyir"'].map((x, k) => <span key={x} style={{ ['--k' as string]: k } as React.CSSProperties}>{t(x)}</span>)}
    </div>
  ),
  'ai-avtomatlasdirma': (
    <div className="mini-chat" aria-hidden="true">
      <span className="u">{t('Salam, sayt sifariş etmək istəyirəm.')}</span>
      <span className="b">{t('Salam! Hansı sayt lazımdır: landing, korporativ, yoxsa onlayn mağaza?')}</span>
      <span className="crm">{t('Yeni lead · CRM-ə əlavə edildi')}</span>
    </div>
  ),
  'korporativ-email': (
    <div className="mini-dns" aria-hidden="true">
      {['MX', 'SPF', 'DKIM', 'DMARC'].map((x) => <span key={x}><b>{x}</b><Check w={3} /></span>)}
    </div>
  ),
});
const BIG = ['veb-saytlar', 'reklam', 'email-marketinq', 'ai-avtomatlasdirma'];

export default function Bento() {
  const t = useServerT();
  const L = useLocalize();
  const MINI = mini(t);
  return (
    <div className="bento">
      {L(services).map((s) => (
        <Link key={s.slug} href={`/xidmetler/${s.slug}`} className={`bn-card${BIG.includes(s.slug) ? ' big' : ''}`}>
          <div className="bc-top"><span className="ic"><Icon name={s.icon} /></span>{s.isNew && <em className="new">{t('Yeni')}</em>}</div>
          <h3>{s.title}</h3>
          <p>{s.homeDesc}</p>
          {MINI[s.slug]}
          <span className="bc-more">{t('Ətraflı')} <Arrow /></span>
        </Link>
      ))}
    </div>
  );
}
