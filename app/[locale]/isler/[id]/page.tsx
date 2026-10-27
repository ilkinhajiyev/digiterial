import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { PageHero, H2, CtaBand } from '@/components/dg/ui';
import { Arrow } from '@/components/dg/icons';
import { getPortfolioItem, getWork, SHOTS, type LocalItem } from '@/lib/data/portfolio';
import { getIndustry } from '@/lib/content/industries';
import { Link } from '@/i18n/navigation';
import { Laptop, Phone } from '@/components/dg/devices';
import { alternates, localePath } from '@/lib/seo';
import { getT, localize, OG_LOCALE } from '@/lib/i18n/server';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const raw = await getPortfolioItem(id);
  if (!raw) return {};
  const it = localize(raw, locale);
  const path = `/isler/${it.slug || it.id}`;
  const description = it.description || it.title;
  return {
    title: it.title, description, alternates: alternates(path, locale),
    openGraph: { title: it.title, description, url: localePath(path, locale), locale: OG_LOCALE[locale], type: 'website', images: it.image_url ? [it.image_url] : [] },
  };
}

export default async function WorkItem({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = getT(locale);
  const raw = await getPortfolioItem(id);
  if (!raw) notFound();
  const it = localize(raw, locale);
  const loc = it as LocalItem;
  const rawInd = loc.industry ? getIndustry(loc.industry) : undefined;
  const ind = rawInd ? localize(rawInd, locale) : undefined;
  const more = localize((await getWork(locale).catch(() => [] as LocalItem[])).filter((w) => w.slug !== it.slug).slice(0, 3), locale);
  const gallery = SHOTS[it.slug || ''] ? [] : it.gallery?.length ? it.gallery : it.image_url ? [it.image_url] : [];
  const ld = { '@context': 'https://schema.org', '@type': 'CreativeWork', name: it.title, about: it.description, url: `https://digiterial.com${localePath(`/isler/${it.slug || it.id}`, locale)}`, inLanguage: locale, creator: { '@type': 'Organization', name: 'Digiterial' } };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PageHero crumbs={[{ href: '/', label: t('Ana səhifə') }, { href: '/isler', label: t('İşlər') }, { label: it.client || it.title }]} h1={it.title} lead={it.description || ''}>
        {it.url && it.url !== '#' && <a className="btn btn-accent" href={it.url} target="_blank" rel="noopener noreferrer">{t('Sayta keçin')} <Arrow /></a>}
      </PageHero>
      {SHOTS[it.slug || ''] && (
        <section style={{ paddingBlock: 48 }}><div className="wrap rcase-media detail">
          <Laptop src={SHOTS[it.slug!]!.desktop} alt={t('{name} saytı', { name: it.client || it.title })} scroll={SHOTS[it.slug!]!.full} priority />
          {SHOTS[it.slug!]!.mobile && <Phone src={SHOTS[it.slug!]!.mobile!} alt={t('{name} mobil versiyası', { name: it.client || it.title })} />}
        </div></section>
      )}
      {(it.tags || it.metric) && (
        <section style={{ paddingBlock: 32 }}><div className="wrap"><div className="stack" style={{ marginTop: 0 }}>{it.metric && <span>{it.metric}</span>}{it.tags?.split(',').map((t) => <span key={t}>{t.trim()}</span>)}</div></div></section>
      )}
      {it.body && (
        <section><div className="wrap duo2">
          <div><div className="label">{t('Layihə haqqında')}</div><H2 className="mid" style={{ marginTop: 18 }}>{t('Məqsəd, həll və nəticə.')}</H2></div>
          <div className="article" style={{ maxWidth: 'none' }}>{it.body.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}</div>
        </div></section>
      )}
      {gallery.length > 0 && <section><div className="wrap"><div className="label" style={{ marginBottom: 24 }}>{t('Qalereya')}</div><div className="gal">{gallery.map((g, i) => <img key={i} src={g} alt={`${it.title} — ${i + 1}`} loading="lazy" />)}</div></div></section>}
      {(loc.year || ind || it.url) && (
        <section style={{ paddingBlock: 40 }}><div className="wrap pfacts">
          {it.client && <div><span className="label">{t('Müştəri')}</span><b>{it.client}</b></div>}
          {loc.year && <div><span className="label">{t('İl')}</span><b>{loc.year}</b></div>}
          {ind && <div><span className="label">{t('Sahə')}</span><b><Link href={`/saheler/${ind.slug}`}>{ind.title}</Link></b></div>}
          {it.url && it.url !== '#' && <div><span className="label">{t('Sayt')}</span><b><a href={it.url} target="_blank" rel="noopener noreferrer">{it.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a></b></div>}
        </div></section>
      )}
      {more.length > 0 && (
        <section className="rwork"><div className="wrap">
          <div className="label" style={{ marginBottom: 28 }}>{t('Digər işlər')}</div>
          <div className="rgrid three">
            {more.map((w) => (
              <Link key={w.id} className="rmini" href={`/isler/${w.slug || w.id}`}>
                <span className="rmini-img">{SHOTS[w.slug || ''] && <img src={SHOTS[w.slug!]!.desktop} alt={t('{name} saytı', { name: w.client || w.title })} loading="lazy" />}</span>
                <h3>{w.client || w.title}</h3><p>{w.description}</p>
              </Link>
            ))}
          </div>
        </div></section>
      )}
      <CtaBand title={t('Oxşar layihə istəyirsiniz?')} text={t('Hədəfinizi danışaq və sizə uyğun həll təklif edək.')} />
    </>
  );
}
