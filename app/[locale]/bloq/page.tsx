import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, Clock } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import PageHeader from '@/components/site/page-header';
import PostCover from '@/components/site/post-cover';
import { BlockRenderer } from '@/components/site/blocks';
import { JsonLd } from '@/components/site/jsonld';
import { getPosts, readingMinutes } from '@/lib/data/posts';
import { pageMetadata, SITE_URL, localePath } from '@/lib/seo';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; const m = await getTranslations({ locale, namespace: 'meta.blog' });
  return pageMetadata('blog', locale, '/bloq', { title: m('title'), description: m('desc') });
}

export default async function Blog({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations('pages.blog'); const h = await getTranslations('home'); const n = await getTranslations('nav');
  const posts = await getPosts(locale);
  const [first, ...rest] = posts;
  const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  const ld = {
    '@context': 'https://schema.org', '@type': 'Blog', name: 'Digiterial Blog', url: `${SITE_URL}${localePath(locale, '/bloq')}`, inLanguage: locale,
    blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, datePublished: p.published_at || p.created_at, url: `${SITE_URL}${localePath(locale, `/bloq/${p.slug}`)}` })),
  };
  const meta = (p: typeof first) => (
    <div className="flex flex-wrap items-center gap-3 font-mono text-[.72rem] text-muted">
      <time dateTime={p.published_at || p.created_at}>{fmt.format(new Date(p.published_at || p.created_at))}</time>
      {p.body && <span className="flex items-center gap-1"><Clock size={12} />{readingMinutes(p.body)} {t('min')}</span>}
    </div>
  );

  return (
    <>
      {posts.length > 0 && <JsonLd data={ld} />}
      <PageHeader locale={locale} eyebrow={t('eyebrow')} title={`${t('h1a')} *${t('h1b')}*`} lead={t('lead')} />
      <section className="section pt-12"><div className="wrap">
        {posts.length === 0 ? (
          <div className="dot-grid flex flex-col items-start gap-8 rounded-2xl border border-dashed border-[color:var(--line-2)] p-8 md:flex-row md:items-center md:justify-between md:p-14">
            <div><p className="t-h3 text-[1.6rem]">{t('empty')}</p><p className="t-small mt-2">{t('emptyP')}</p></div>
            <Link href="/elaqe" className="btn-accent">{n('cta')} <ArrowRight size={18} className="arr" /></Link>
          </div>
        ) : (
          <>
            {/* Seçilmiş (ən son) məqalə */}
            <Link href={`/bloq/${first.slug}`} className="card card-hover group grid overflow-hidden lg:grid-cols-2">
              <div className="aspect-[16/10] lg:aspect-auto lg:min-h-[380px]">{first.cover_url ? <img src={first.cover_url} alt="" className="h-full w-full object-cover" /> : <PostCover title={first.title} category={first.category} keyword={first.keyword} large />}</div>
              <div className="flex flex-col justify-center p-7 md:p-10">
                <div className="eyebrow">{t('latest')}</div>
                <h2 className="t-h2 mt-5 text-[clamp(1.7rem,3vw,2.6rem)] transition group-hover:text-brand">{first.title}</h2>
                {first.excerpt && <p className="t-lead mt-5">{first.excerpt}</p>}
                <div className="mt-8 flex items-center justify-between gap-4">{meta(first)}<span className="inline-flex items-center gap-1.5 text-[.92rem] font-medium text-brand">{t('read')} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></span></div>
              </div>
            </Link>
            {rest.length > 0 && (
              <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <Link key={p.id} href={`/bloq/${p.slug}`} className="card card-hover group flex flex-col overflow-hidden">
                    <div className="aspect-[16/9]">{p.cover_url ? <img src={p.cover_url} alt="" loading="lazy" className="h-full w-full object-cover" /> : <PostCover title={p.title} category={p.category} keyword={p.keyword} />}</div>
                    <div className="flex flex-1 flex-col p-6">
                      {meta(p)}
                      <h2 className="t-h3 mt-3 text-[1.2rem] transition group-hover:text-brand">{p.title}</h2>
                      {p.excerpt && <p className="t-small mt-2 line-clamp-3">{p.excerpt}</p>}
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[.9rem] font-medium text-brand">{t('read')} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div></section>
      <BlockRenderer blocks={[{ type: 'cta', props: { h2: h('cta.h2'), p: h('cta.p'), b1: h('cta.b1') } }]} />
    </>
  );
}
