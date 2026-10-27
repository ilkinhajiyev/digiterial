import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { PageHero, CtaBand } from '@/components/dg/ui';
import { glossary } from '@/lib/content/glossary';
import { getService } from '@/lib/content/services';
import { alternates, localePath } from '@/lib/seo';
import { getT, localize, OG_LOCALE } from '@/lib/i18n/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  const title = t('Rəqəmsal marketinq lüğəti — SEO, reklam, analitika terminləri');
  const description = t('ROAS, CTR, SEO, canonical, hreflang, SPF, DKIM, DMARC və digər rəqəmsal marketinq terminlərinin sadə dildə izahı.');
  return {
    title, description, alternates: alternates('/lugat', locale),
    openGraph: { title, description, url: localePath('/lugat', locale), locale: OG_LOCALE[locale], type: 'website' },
  };
}

const CATS = ['SEO', 'Reklam', 'Analitika', 'Veb', 'Email'] as const;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = getT(locale);
  const terms = localize(glossary, locale);
  const url = `https://digiterial.com${localePath('/lugat', locale)}`;
  const ld = { '@context': 'https://schema.org', '@type': 'DefinedTermSet', name: t('Rəqəmsal marketinq lüğəti'), url, inLanguage: locale, hasDefinedTerm: terms.map((x) => ({ '@type': 'DefinedTerm', name: x.term, description: x.def, url: `${url}#${x.slug}` })) };
  const sorted = [...terms].sort((a, b) => a.term.localeCompare(b.term, locale));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PageHero crumbs={[{ href: '/', label: t('Ana səhifə') }, { label: t('Lüğət') }]} h1={<>{t('Rəqəmsal marketinq')} <em>{t('lüğəti.')}</em></>}
        lead={t('Agentliklə danışanda və hesabat oxuyanda rastlaşdığınız terminlər, sadə dildə. Hər birinin yanında uyğun xidmətə keçid var.')} />
      <section style={{ paddingTop: 48 }}>
        <div className="wrap">
          <nav className="gl-cats" aria-label={t('Kateqoriyalar')}>{CATS.map((c) => <a key={c} href={`#cat-${c}`}>{t(c)} <span>{terms.filter((x) => x.cat === c).length}</span></a>)}</nav>
          {CATS.map((c) => (
            <div key={c} id={`cat-${c}`} className="gl-group">
              <h2 className="gl-h">{t(c)}</h2>
              <dl className="gl">
                {sorted.filter((x) => x.cat === c).map((x) => {
                  const sv = x.service ? getService(x.service) : null;
                  return (
                    <div key={x.slug} id={x.slug} className="gl-item">
                      <dt>{x.term}{x.full && <small>{x.full}</small>}</dt>
                      <dd>{x.def}{sv && <> <Link href={`/xidmetler/${sv.slug}`}>{t(sv.title)} →</Link></>}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          ))}
        </div>
      </section>
      <CtaBand title={t('Termin yox, nəticə lazımdır?')} text={t('Bütün bunları sizin yerinizə quraq və hər ay sadə dildə hesabat verək.')} />
    </>
  );
}
