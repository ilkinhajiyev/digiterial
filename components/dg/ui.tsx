// Bütün səhifələrdə təkrarlanan bölmələr (server komponentləri)
import { Link } from '@/i18n/navigation';
import { Arrow, Check, Ic, type IconName } from './icons';
import { services } from '@/lib/content/services';
import { useServerT, useLocalize } from '@/lib/i18n/server';
import { localePath } from '@/lib/seo';
import { useLocale } from 'next-intl';

// Başlığı sözlərə bölür: scroll zamanı söz-söz animasiya üçün (Motion komponenti)
export function H2({ children, className = '', style }: { children: string; className?: string; style?: React.CSSProperties }) {
  const words = children.trim().split(/\s+/);
  return (
    <h2 className={`display split-h ${className}`} style={style} aria-label={children}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          <span className="w"><span style={{ ['--wi' as string]: i } as React.CSSProperties}>{w}</span></span>{i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </h2>
  );
}

export function SecHead({ label, title, lead }: { label: string; title: string; lead?: string }) {
  return (
    <div className="sec-head">
      <div><div className="label">{label}</div><H2 style={{ marginTop: 18 }}>{title}</H2></div>
      {lead && <p className="lead">{lead}</p>}
    </div>
  );
}

export function Steps({ steps }: { steps: [string, string][] }) {
  const t = useServerT();
  return (
    <div className="steps">
      {steps.map(([h, p], i) => (
        <div className="step" key={i}><span className="n">{t('Addım {n}', { n: i + 1 })}</span><h3>{t(h)}</h3><p>{t(p)}</p></div>
      ))}
    </div>
  );
}

export function FaqSection({ items: raw, title, label }: { items: { q: string; a: string }[]; title?: string; label?: string }) {
  const t = useServerT();
  const locale = useLocale();
  const items = useLocalize()(raw);
  title ??= t('Suallarınız var?');
  label ??= t('Tez-tez verilən suallar');
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: locale, mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  return (
    <section id="faq">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="wrap faq">
        <div><div className="label">{label}</div><H2 className="mid" style={{ marginTop: 18 }}>{title}</H2></div>
        <div>
          {items.map((f, i) => (
            <details key={i}><summary>{f.q}<span className="pm">+</span></summary><p>{f.a}</p></details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBand({ title, text, button }: { title: string; text: string; button?: string }) {
  const t = useServerT();
  button ??= t('Layihəni müzakirə edək');
  return (
    <section className="cta-band">
      <div className="wrap inner">
        <div><H2>{title}</H2><p>{text}</p></div>
        <Link className="btn btn-accent" href="/elaqe">{button} <Arrow /></Link>
      </div>
    </section>
  );
}

export function Cards({ items, four }: { items: { icon: IconName; h: string; p: string }[]; four?: boolean }) {
  const t = useServerT();
  return (
    <div className={`cards${four ? ' cards-4' : ''}`}>
      {items.map((c, i) => <div className="card-i" key={i}><Ic name={c.icon} /><h3>{t(c.h)}</h3><p>{t(c.p)}</p></div>)}
    </div>
  );
}

export function Deliverables({ items }: { items: string[] }) {
  const t = useServerT();
  return (
    <section>
      <div className="wrap duo2">
        <div><div className="label">{t('Təhvil verilənlər')}</div><H2 className="mid" style={{ marginTop: 18 }}>{t('Sonda əlinizdə nə olur.')}</H2></div>
        <ul className="deliv">{items.map((d, i) => <li key={i}><span className="ck"><Check /></span>{t(d)}</li>)}</ul>
      </div>
    </section>
  );
}

export function OtherServices({ current }: { current: string }) {
  const t = useServerT();
  const L = useLocalize();
  return (
    <section>
      <div className="wrap">
        <div className="label">{t('Digər xidmətlər')}</div>
        <div className="others">
          {L(services).filter((s) => s.slug !== current).map((s) => (
            <Link className="oth" key={s.slug} href={`/xidmetler/${s.slug}`}><Ic name={s.icon} /><span>{s.title}</span><Arrow /></Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Crumbs({ items }: { items: { href?: string; label: string }[] }) {
  const t = useServerT();
  const locale = useLocale();
  const ld = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, ...(c.href ? { item: `https://digiterial.com${localePath(c.href, locale) === '/' ? '' : localePath(c.href, locale)}` } : {}) })) };
  return (
    <nav className="crumbs" aria-label={t('Səhifə yolu')}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      {items.map((c, i) => (
        <span key={i} style={{ display: 'contents' }}>
          {i > 0 && <span aria-hidden="true">/</span>}
          {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
        </span>
      ))}
    </nav>
  );
}

// Alt səhifələrin hero hissəsi
export function PageHero({ crumbs, h1, lead, children, visual }: { crumbs: { href?: string; label: string }[]; h1: React.ReactNode; lead: string; children?: React.ReactNode; visual?: React.ReactNode }) {
  return (
    <section className="sp-hero">
      <div className={`wrap ${visual ? 'sp-grid' : ''}`} style={visual ? undefined : { position: 'relative', zIndex: 1 }}>
        <div>
          <Crumbs items={crumbs} />
          <h1 className="display">{h1}</h1>
          <p className="lead">{lead}</p>
          {children && <div className="ctas">{children}</div>}
        </div>
        {visual}
      </div>
    </section>
  );
}
