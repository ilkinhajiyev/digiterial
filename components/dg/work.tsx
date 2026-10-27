import { Link } from '@/i18n/navigation';
import { SHOTS, type PItem } from '@/lib/data/portfolio';
import { useServerT, useLocalize } from '@/lib/i18n/server';

export function WorkGrid({ items: raw }: { items: PItem[] }) {
  const t = useServerT();
  const L = useLocalize();
  const items = L(raw);
  if (!items.length) return <div className="empty">{t('Hələ layihə əlavə edilməyib. Admin paneldən Portfolio bölməsinə layihə əlavə edin.')}</div>;
  return (
    <div className="work-grid">
      {items.map((it) => (
        <Link key={it.id} className="wcard" href={`/isler/${it.slug || it.id}`}>
          <div className="img">
            {(it.image_url || SHOTS[it.slug || '']?.desktop) ? <img src={it.image_url || SHOTS[it.slug || '']!.desktop} alt={it.title} loading="lazy" /> : (
              <div className="case-visual" style={{ height: '100%', aspectRatio: 'auto' }}>
                <div className="browser" aria-hidden="true"><div className="b-bar"><i /><i /><i /><em>{it.client || it.title}</em></div>
                  <div className="b-body"><div className="b-nav"><b>{(it.client || it.title).split(' ')[0]}</b><span><i /><i /><i /></span></div><div className="b-h">{it.description || it.title}</div><div className="b-cta" /></div></div>
              </div>
            )}
          </div>
          <div className="meta">
            <span className="label">{it.category === 'smm' ? t('SMM') : t('Veb sayt')}{it.client ? ` · ${it.client}` : ''}</span>
            <h3>{it.title}</h3>
            {it.description && <p style={{ margin: 0, color: 'var(--muted)' }}>{it.description}</p>}
          </div>
        </Link>
      ))}
    </div>
  );
}
