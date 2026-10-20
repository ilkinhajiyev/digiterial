import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, Clock, CalendarDays } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import PageHeader from '@/components/site/page-header';
import { BlockRenderer } from '@/components/site/blocks';
import { JsonLd } from '@/components/site/jsonld';
import RichText, { headingsOf } from '@/components/site/rich-text';
import PostCover from '@/components/site/post-cover';
import { getPost, getPosts, readingMinutes } from '@/lib/data/posts';
import { allArticles, articleTranslations } from '@/lib/data/articles';
import { buildMetadata, SITE_URL, localePath } from '@/lib/seo';
import { defaultLocale } from '@/i18n/routing';

export const revalidate = 300;

export function generateStaticParams() {
  return allArticles().map((a) => ({ locale: a.locale, slug: a.slug }));
}

function altLanguages(group?: string, fallbackLocale?: string, slug?: string) {
  const list = group ? articleTranslations(group) : [];
  if (!list.length) return undefined;
  const out: Record<string, string> = {};
  for (const a of list) out[a.locale] = localePath(a.locale, `/bloq/${a.slug}`);
  out['x-default'] = out[defaultLocale] || out[fallbackLocale || 'az'] || localePath(fallbackLocale || 'az', `/bloq/${slug}`);
  return out;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params; const p = await getPost(slug);
  if (!p || (p.locale && p.locale !== locale)) return {};
  return buildMetadata({
    locale, path: `/bloq/${p.slug}`, title: p.metaTitle || p.title, description: p.excerpt, image: p.cover_url, type: 'article',
    languages: altLanguages(p.group, p.locale, p.slug), publishedTime: p.published_at,
  });
}

export default async function PostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params; setRequestLocale(locale);
  const post = await getPost(slug);
  if (!post) notFound();
  // Məqalə başqa dildədirsə, həmin dilin URL-inə yönləndir
  if (post.locale && post.locale !== locale) {
    // Dil dəyişdirildikdə həmin məqalənin tərcüməsinə keç (varsa)
    const tr = post.group ? articleTranslations(post.group).find((a) => a.locale === locale) : undefined;
    redirect(tr ? localePath(locale, `/bloq/${tr.slug}`) : localePath(post.locale, `/bloq/${post.slug}`));
  }

  const t = await getTranslations('pages.blog');
  const date = post.published_at || post.created_at;
  const minutes = readingMinutes(post.body);
  const toc = headingsOf(post.body || '');
  const related = (await getPosts(locale)).filter((p) => p.slug !== post.slug).slice(0, 3);
  const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  const url = `${SITE_URL}${localePath(locale, `/bloq/${post.slug}`)}`;
  const ld = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.excerpt,
    datePublished: date, dateModified: date, inLanguage: locale, url, mainEntityOfPage: url,
    keywords: post.keyword, articleSection: post.category, wordCount: (post.body || '').split(/\s+/).length,
    image: post.cover_url || `${SITE_URL}/og-kinetic.png`,
    author: { '@type': 'Organization', name: 'Digiterial', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'Digiterial', url: SITE_URL, logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.svg` } },
  };

  return (
    <>
      <JsonLd data={ld} />
      <PageHeader locale={locale} back={{ href: '/bloq', label: t('eyebrow') }} eyebrow={post.category || t('eyebrow')} title={post.title} lead={post.excerpt}>
        <div className="flex flex-wrap gap-2">
          <span className="chip"><CalendarDays size={14} /><time dateTime={date}>{fmt.format(new Date(date))}</time></span>
          <span className="chip"><Clock size={14} />{minutes} {t('min')}</span>
          <span className="chip">{t('author')}</span>
        </div>
      </PageHeader>

      <div className="wrap pt-10">
        <div className="aspect-[21/9] overflow-hidden rounded-2xl border border-[color:var(--line)]">
          {post.cover_url ? <img src={post.cover_url} alt={post.title} className="h-full w-full object-cover" /> : <PostCover title={post.title} category={post.category} keyword={post.keyword} large />}
        </div>
      </div>

      <section className="section pt-14"><div className="wrap grid gap-12 lg:grid-cols-12">
        {toc.length > 1 && (
          <aside className="lg:col-span-3">
            <nav aria-label={t('toc')} className="lg:sticky lg:top-28">
              <div className="eyebrow mb-4">{t('toc')}</div>
              <ol className="space-y-2.5 border-l border-[color:var(--line-2)] text-[.92rem]">
                {toc.map((h) => <li key={h.id}><a href={`#${h.id}`} className="-ml-px block border-l border-transparent pl-4 text-muted transition hover:border-brand hover:text-fg">{h.text}</a></li>)}
              </ol>
            </nav>
          </aside>
        )}
        <article className={toc.length > 1 ? 'lg:col-span-8 lg:col-start-5' : 'mx-auto max-w-[72ch] lg:col-span-12'}>
          <RichText text={post.body || ''} />
          <div className="mt-14 flex flex-col gap-6 rounded-2xl border border-brand/30 bg-brand-soft p-7 sm:flex-row sm:items-center sm:justify-between md:p-8">
            <div><p className="t-h3">{t('ctaH')}</p><p className="t-small mt-2">{t('ctaP')}</p></div>
            <Link href="/elaqe" className="btn-accent shrink-0">{t('ctaB')} <ArrowRight size={18} className="arr" /></Link>
          </div>
        </article>
      </div></section>

      {post.faq && post.faq.length > 0 && <BlockRenderer blocks={[{ type: 'faq', props: { label: t('faq'), items: post.faq } }]} />}

      {related.length > 0 && (
        <section className="section pt-0"><div className="wrap">
          <h2 className="t-h2">{t('related')}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {related.map((p) => (
              <Link key={p.id} href={`/bloq/${p.slug}`} className="card card-hover group overflow-hidden">
                <div className="aspect-[16/9]">{p.cover_url ? <img src={p.cover_url} alt="" loading="lazy" className="h-full w-full object-cover" /> : <PostCover title={p.title} category={p.category} keyword={p.keyword} />}</div>
                <div className="p-6"><h3 className="t-h3 text-[1.15rem] transition group-hover:text-brand">{p.title}</h3><p className="t-small mt-2 line-clamp-2">{p.excerpt}</p></div>
              </Link>
            ))}
          </div>
        </div></section>
      )}
    </>
  );
}
