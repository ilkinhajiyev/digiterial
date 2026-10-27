'use client';
import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useT } from '@/lib/i18n/client';
import { Icon, Chevron, Check, Arrow, type IconName } from './icons';
import { Flag, LANGS } from './flag';

type MenuKey = 'svc' | 'ind' | 'res';
export type HeaderPost = { slug: string; title: string; category: string; date: string };
// Serverdə tərcümə olunmuş menyu (layout.tsx)
export type HeaderMenu = {
  groups: { key: string; title: string; items: { slug: string; icon: IconName; title: string; menuDesc: string; isNew?: boolean }[] }[];
  industries: { slug: string; icon: IconName; title: string; short: string }[];
};

const RES = [
  { href: '/bloq', title: 'Bloq', desc: 'SEO, reklam və veb haqqında praktik yazılar', icon: 'news' as const },
  { href: '/lugat', title: 'Marketinq lüğəti', desc: 'ROAS, CTR, DMARC və digər terminlər', icon: 'book' as const },
  { href: '/faq', title: 'Tez-tez verilən suallar', desc: 'Müddət, qiymət, nəticə', icon: 'check' as const },
  { href: '/emekdasliq', title: 'Əməkdaşlıq və qiymət', desc: 'Necə işləyirik, təklif necə hazırlanır', icon: 'users' as const },
];

export default function Header({ brand = 'digiterial', logoUrl, phone, email, latest, menu: m }: { brand?: string; logoUrl?: string; phone?: string; email?: string; latest?: HeaderPost; menu: HeaderMenu }) {
  const t = useT();
  const pathname = usePathname();
  const locale = useLocale();
  const [menu, setMenu] = useState<MenuKey | null>(null);
  const [lang, setLang] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [mmOpen, setMmOpen] = useState<MenuKey | null>(null);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const progress = useRef<HTMLDivElement>(null);
  const closeT = useRef<ReturnType<typeof setTimeout>>();
  const hdr = useRef<HTMLElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMenu(null); setLang(false); setMobile(false); }, [pathname]);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
      const hide = y > last && y > 400;
      setHidden(hide); setSolid(y > 24);
      if (hide) { setMenu(null); setLang(false); }
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (menu && !hdr.current?.contains(t)) setMenu(null);
      if (lang && !langRef.current?.contains(t)) setLang(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenu(null); setLang(false); } };
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onDoc); document.removeEventListener('keydown', onKey); };
  }, [menu, lang]);

  const fine = () => typeof window !== 'undefined' && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const open = (k: MenuKey) => { clearTimeout(closeT.current); setMenu(k); };
  const soon = () => { clearTimeout(closeT.current); closeT.current = setTimeout(() => setMenu(null), 200); };
  const trig = (k: MenuKey, label: string) => (
    <button className="mega-btn" aria-expanded={menu === k} aria-controls={`mega-${k}`}
      onClick={() => setMenu((m) => (m === k ? null : k))}
      onPointerEnter={() => fine() && open(k)} onPointerLeave={() => fine() && soon()}>
      {label} <Chevron />
    </button>
  );
  const panelProps = (k: MenuKey) => ({
    id: `mega-${k}`, hidden: menu !== k, className: `mega${menu === k ? ' open' : ''}`,
    onPointerEnter: () => fine() && open(k), onPointerLeave: () => fine() && soon(),
  });
  const active = (p: string) => (pathname.startsWith(p) ? 'page' : undefined);
  let k = 0;

  return (
    <>
      <div className="progress" ref={progress} aria-hidden="true" />
      <header ref={hdr} className={`top${hidden ? ' hide' : ''}${solid || menu ? ' solid' : ''}`}>
        <div className="wrap nav">
          <Link className="logo" href="/" aria-label={t('Digiterial ana səhifə')}>
            {logoUrl ? <img src={logoUrl} alt={brand} style={{ height: 30, width: 'auto' }} /> : <>{brand.toLowerCase()}<i>.</i></>}
          </Link>
          <ul>
            <li>{trig('svc', t('Xidmətlər'))}</li>
            <li>{trig('ind', t('Sahələr'))}</li>
            <li><Link href="/isler" aria-current={active('/isler')}>{t('İşlər')}</Link></li>
            <li>{trig('res', t('Resurslar'))}</li>
            <li><Link href="/haqqimizda" aria-current={active('/haqqimizda')}>{t('Haqqımızda')}</Link></li>
          </ul>
          <div className="nav-right">
            <div className="lang" ref={langRef}>
              <button className="lang-btn" aria-haspopup="menu" aria-expanded={lang} aria-controls="langMenu" aria-label={t('Dili seçin')} onClick={() => setLang((v) => !v)}>
                <Flag code={locale} /><span>{locale.toUpperCase()}</span><Chevron />
              </button>
              <div className="lang-menu" id="langMenu" role="menu" hidden={!lang}>
                {LANGS.map((l) => (
                  <Link key={l.code} href={pathname} locale={l.code} className="lang-opt" role="menuitemradio" aria-checked={locale === l.code} onClick={() => setLang(false)}>
                    <Flag code={l.code} size="lg" /><span><b>{l.label}</b><small>{l.code.toUpperCase()}</small></span><span className="tick"><Check w={3} /></span>
                  </Link>
                ))}
              </div>
            </div>
            <Link className="btn btn-accent nav-cta" href="/elaqe">{t('Layihəni müzakirə et')}</Link>
            <button className="burger" aria-expanded={mobile} aria-controls="mmenu" aria-label={mobile ? t('Menyunu bağla') : t('Menyunu aç')} onClick={() => setMobile((v) => !v)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">{mobile ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 9h16M4 15h16" />}</svg>
            </button>
          </div>
        </div>

        {/* Xidmətlər */}
        <div {...panelProps('svc')}>
          <div className="wrap mega-in mega-svc">
            {m.groups.map((g) => (
              <div className="mega-col" key={g.key}>
                <h6>{g.title}</h6>
                {g.items.map((s) => (
                  <Link key={s.slug} href={`/xidmetler/${s.slug}`} style={{ ['--k' as string]: k++ } as React.CSSProperties}>
                    <span className="ic"><Icon name={s.icon} /></span>
                    <b>{s.title}{s.isNew && <em className="new">{t('Yeni')}</em>}</b>
                    <span>{s.menuDesc}</span>
                  </Link>
                ))}
              </div>
            ))}
            <div className="mega-side" style={{ ['--k' as string]: k } as React.CSSProperties}>
              {latest && (
                <Link className="mega-post" href={`/bloq/${latest.slug}`}>
                  <small>{t('Bloqda yeni')} · {latest.category}</small>
                  <strong>{latest.title}</strong>
                  <span>{t('Oxu')} <Arrow /></span>
                </Link>
              )}
              <Link className="mega-case" href="/isler/ramoil-company-mmc">
                <small>{t('Seçilmiş iş')}</small>
                <strong>{t('RAMOIL COMPANY MMC üçün korporativ veb-sayt')}</strong>
              </Link>
            </div>
          </div>
          <div className="wrap mega-foot">
            <Link href="/xidmetler">{t('Bütün xidmətlər')} <Arrow /></Link>
            <span>{phone && <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>}{email && <a href={`mailto:${email}`}>{email}</a>}</span>
          </div>
        </div>

        {/* Sahələr */}
        <div {...panelProps('ind')}>
          <div className="wrap mega-in mega-ind">
            <div className="mega-intro">
              <h6>{t('Sahələr')}</h6>
              <p>{t('Sahənizin müştəri yoluna uyğun qurulmuş sayt, SEO və reklam.')}</p>
              <Link className="btn btn-ghost" href="/saheler">{t('Bütün sahələr')} <Arrow /></Link>
            </div>
            <div className="mega-grid">
              {m.industries.map((i, n) => (
                <Link key={i.slug} href={`/saheler/${i.slug}`} style={{ ['--k' as string]: n } as React.CSSProperties}>
                  <span className="ic"><Icon name={i.icon} /></span>
                  <b>{i.title}</b>
                  <span>{i.short}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Resurslar */}
        <div {...panelProps('res')}>
          <div className="wrap mega-in mega-res">
            <div className="mega-grid two">
              {RES.map((r, n) => (
                <Link key={r.href} href={r.href} style={{ ['--k' as string]: n } as React.CSSProperties}>
                  <span className="ic"><Icon name={r.icon} /></span>
                  <b>{t(r.title)}</b>
                  <span>{t(r.desc)}</span>
                </Link>
              ))}
            </div>
            <div className="mega-feat" style={{ ['--k' as string]: 4 } as React.CSSProperties}>
              <small>{t('Haradan başlamaq?')}</small>
              <strong>{t('30 dəqiqəlik tanışlıq görüşü')}</strong>
              <p>{t('Hədəflərinizi dinləyək və ən sürətli böyümə yolunu birlikdə müəyyənləşdirək.')}</p>
              <Link className="btn" href="/elaqe">{t('Görüş təyin et')}</Link>
            </div>
          </div>
        </div>

        {/* Mobil menyu */}
        <div className="wrap mobile-menu" id="mmenu" hidden={!mobile}>
          {([['svc', t('Xidmətlər')], ['ind', t('Sahələr')], ['res', t('Resurslar')]] as [MenuKey, string][]).map(([key, label]) => (
            <div className="mm-group" key={key}>
              <button className="mm-toggle" aria-expanded={mmOpen === key} aria-controls={`mm-${key}`} onClick={() => setMmOpen((v) => (v === key ? null : key))}>{label} <Chevron /></button>
              <div className="mm-list" id={`mm-${key}`} hidden={mmOpen !== key}>
                {key === 'svc' && m.groups.flatMap((g) => g.items).map((s) => (
                  <Link key={s.slug} href={`/xidmetler/${s.slug}`}><span className="ic"><Icon name={s.icon} /></span>{s.title}{s.isNew && <em className="new">{t('Yeni')}</em>}</Link>
                ))}
                {key === 'ind' && m.industries.map((i) => <Link key={i.slug} href={`/saheler/${i.slug}`}><span className="ic"><Icon name={i.icon} /></span>{i.title}</Link>)}
                {key === 'res' && RES.map((r) => <Link key={r.href} href={r.href}><span className="ic"><Icon name={r.icon} /></span>{t(r.title)}</Link>)}
              </div>
            </div>
          ))}
          <Link href="/isler">{t('İşlər')}</Link><Link href="/haqqimizda">{t('Haqqımızda')}</Link><Link href="/elaqe">{t('Əlaqə')}</Link>
          <div className="mm-langs" role="radiogroup" aria-label={t('Dil')}>
            {LANGS.map((l) => <Link key={l.code} href={pathname} locale={l.code} role="radio" aria-checked={locale === l.code}><Flag code={l.code} />{l.code.toUpperCase()}</Link>)}
          </div>
        </div>
      </header>
    </>
  );
}
