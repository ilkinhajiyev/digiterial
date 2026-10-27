import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { PageHero, SecHead, FaqSection, CtaBand, H2 } from '@/components/dg/ui';
import { Arrow, Check, Icon } from '@/components/dg/icons';
import { industries, getIndustry } from '@/lib/content/industries';
import { getService } from '@/lib/content/services';
import { alternates, localePath } from '@/lib/seo';
import { getT, localize, OG_LOCALE } from '@/lib/i18n/server';
import { getWork, SHOTS, type LocalItem } from '@/lib/data/portfolio';

export function generateStaticParams() { return industries.map((i) => ({ slug: i.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const raw = getIndustry(slug);
  if (!raw) return {};
  const i = localize(raw, locale);
  const path = `/saheler/${slug}`;
  return {
    title: i.metaTitle, description: i.metaDesc, alternates: alternates(path, locale),
    openGraph: { title: i.metaTitle, description: i.metaDesc, url: localePath(path, locale), locale: OG_LOCALE[locale], type: 'website' },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = getT(locale);
  const raw = getIndustry(slug);
  if (!raw) notFound();
  const i = localize(raw, locale);
  const work = localize((await getWork(locale).catch(() => [] as LocalItem[])).filter((w) => (w as LocalItem).industry === slug), locale);
  const ld = { '@context': 'https://schema.org', '@type': 'Service', name: i.metaTitle, description: i.metaDesc, url: `https://digiterial.com${localePath(`/saheler/${slug}`, locale)}`, inLanguage: locale, audience: { '@type': 'BusinessAudience', name: i.title }, areaServed: 'AZ', provider: { '@type': 'ProfessionalService', name: 'Digiterial', url: `https://digiterial.com${localePath('/', locale)}` } };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PageHero crumbs={[{ href: '/', label: t('Ana səhifə') }, { href: '/saheler', label: t('Sahələr') }, { label: i.title }]}
        h1={<>{i.h1[0]}<em>{i.h1[1]}</em>{i.h1[2]}</>} lead={i.lead}>
        <Link className="btn btn-accent" href="/elaqe">{t('Sahəmə uyğun plan istəyirəm')} <Arrow /></Link>
        <a className="btn btn-ghost" href="#hell">{t('Həll yolları')}</a>
      </PageHero>
      <section>
        <div className="wrap">
          <SecHead label={t('Tipik problemlər')} title={t('Tanış gəlir?')} lead={t('{name} sahəsində ən çox rastlaşdığımız üç problem.', { name: i.title })} />
          <div className="prob">
            {i.challenges.map((c, k) => <div key={c.h} className="rv"><span className="n">0{k + 1}</span><h3>{c.h}</h3><p>{c.p}</p></div>)}
          </div>
        </div>
      </section>
      <section id="hell">
        <div className="wrap">
          <SecHead label={t('Həll yolları')} title={t('Necə kömək edirik.')} lead={t('Hər həll uyğun xidmət səhifəsinə bağlıdır: ətraflı oxuya bilərsiniz.')} />
          <div className="sol">
            {i.solutions.map((s) => {
              const sv = getService(s.service);
              return (
                <Link key={s.h} href={`/xidmetler/${s.service}`} className="sol-row">
                  <span className="ic">{sv && <Icon name={sv.icon} />}</span>
                  <div><h3>{s.h}</h3><p>{s.p}</p></div>
                  <span className="svc-name">{sv && t(sv.title)}</span>
                  <Arrow />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <section>
        <div className="wrap duo2">
          <div><div className="label">{t('Yoxlama siyahısı')}</div><H2 className="mid" style={{ marginTop: 18 }}>{t('Rəqəmsal sağlamlığınızı yoxlayın.')}</H2>
            <p className="lead" style={{ marginTop: 18 }}>{t('Bu bəndlərdən neçəsi sizdə var? Çatışmayanları birlikdə tamamlaya bilərik.')}</p></div>
          <ul className="deliv">{i.checklist.map((c) => <li key={c}><span className="ck"><Check /></span>{c}</li>)}</ul>
        </div>
      </section>
      {work.length > 0 && (
        <section className="rwork">
          <div className="wrap">
            <SecHead label={t('Bu sahədə işlərimiz')} title={t('Real layihələr.')} lead={t('Bu sahədə hazırladığımız saytlardan nümunələr. Görüntülər canlı saytlardandır.')} />
            <div className="rgrid">
              {work.map((w) => (
                <Link key={w.id} className="rmini" href={`/isler/${w.slug}`}>
                  <span className="rmini-img">{SHOTS[w.slug || ''] && <img src={SHOTS[w.slug!]!.desktop} alt={t('{name} saytı', { name: w.client || '' })} loading="lazy" />}</span>
                  <span className="label">{(w.tags || '').split(',')[0]}</span>
                  <h3>{w.client}</h3>
                  <p>{w.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <FaqSection items={i.faq} title={t('Tez-tez soruşulanlar')} label={t('Suallar')} />
      <section>
        <div className="wrap">
          <div className="label">{t('Digər sahələr')}</div>
          <div className="others">
            {localize(industries, locale).filter((x) => x.slug !== i.slug).map((x) => <Link className="oth" key={x.slug} href={`/saheler/${x.slug}`}><span className="ic"><Icon name={x.icon} /></span><span>{x.title}</span><Arrow /></Link>)}
          </div>
        </div>
      </section>
      <CtaBand title={t('{name} üçün plan quraq.', { name: i.title })} text={t('30 dəqiqəlik görüşdə vəziyyətinizi dinləyək və ən sürətli nəticə verəcək addımları müəyyənləşdirək.')} />
    </>
  );
}
