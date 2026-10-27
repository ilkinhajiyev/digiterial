import { Link } from '@/i18n/navigation';
import { services } from '@/lib/content/services';
import { industries } from '@/lib/content/industries';
import type { SiteSettings } from '@/lib/data/settings';
import { getT, localize } from '@/lib/i18n/server';

export default function Footer({ st, locale }: { st: SiteSettings; locale: string }) {
  const t = getT(locale);
  const socials = (['instagram', 'linkedin', 'tiktok', 'facebook', 'youtube'] as const)
    .filter((k) => st.social[k])
    .map((k) => ({ label: k[0].toUpperCase() + k.slice(1), url: st.social[k]! }));
  const brand = (st.brand || 'digiterial').toLowerCase();
  return (
    <footer className="nfoot">
      <div className="wrap">
        <div className="nfoot-cta">
          <p className="display">{t('Brendinizi birlikdə')} <em>{t('böyüdək.')}</em></p>
          <Link className="btn btn-accent" href="/elaqe">{t('Layihəni müzakirə et')}</Link>
        </div>
        <div className="nfoot-grid">
          <div className="nfoot-brand">
            <Link className="logo" href="/">{brand}<i>.</i></Link>
            <p>{t('Bakıda kreativ və performans agentliyi. Strategiya, dizayn, reklam və texnologiya bir komandada, 2018-dən bəri.')}</p>
            <address>
              <a href={`mailto:${st.email}`}>{st.email}</a>
              <a href={`tel:${st.phone.replace(/\s/g, '')}`}>{st.phone}</a>
              <span>{t(st.address || 'Bakı, Azərbaycan')} · {t('B.e – Cümə')}, 10:00–18:00</span>
            </address>
          </div>
          <nav aria-label={t('Xidmətlər')}><h4>{t('Xidmətlər')}</h4>{localize(services, locale).map((s) => <Link key={s.slug} href={`/xidmetler/${s.slug}`}>{s.title}</Link>)}</nav>
          <nav aria-label={t('Sahələr')}><h4>{t('Sahələr')}</h4>{localize(industries, locale).map((i) => <Link key={i.slug} href={`/saheler/${i.slug}`}>{i.title}</Link>)}</nav>
          <nav aria-label={t('Resurslar')}><h4>{t('Resurslar')}</h4><Link href="/bloq">{t('Bloq')}</Link><Link href="/lugat">{t('Marketinq lüğəti')}</Link><Link href="/faq">{t('Suallar')}</Link><Link href="/emekdasliq">{t('Əməkdaşlıq və qiymət')}</Link></nav>
          <nav aria-label={t('Agentlik')}><h4>{t('Agentlik')}</h4><Link href="/haqqimizda">{t('Haqqımızda')}</Link><Link href="/isler">{t('İşlər')}</Link><Link href="/case-studies">{t('Case study')}</Link><Link href="/elaqe">{t('Əlaqə')}</Link>
            {socials.map((s) => <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>)}
            {st.whatsapp && <a href={`https://wa.me/${st.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
          </nav>
        </div>
        <p className="wordmark" aria-hidden="true">
          {brand.split('').map((c, i) => <span key={i} style={{ ['--i' as string]: i } as React.CSSProperties}>{c}</span>)}<i>.</i>
        </p>
        <div className="copy">
          <span>© 2018–{new Date().getFullYear()} Digiterial. {t('Bütün hüquqlar qorunur.')}</span>
          <span>{t('Bakı, Azərbaycan')}</span>
        </div>
      </div>
    </footer>
  );
}
