import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { PageHero, CtaBand, FaqSection } from '@/components/dg/ui';
import { PostCard } from '@/components/dg/home/sections';
import { posts, getPost, formatDate, readingMinutes } from '@/lib/content/blog';
import { alternates, localePath } from '@/lib/seo';
import { getT, localize, OG_LOCALE } from '@/lib/i18n/server';

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const raw = getPost(slug);
  if (!raw) return {};
  const p = localize(raw, locale);
  const path = `/bloq/${slug}`;
  return {
    title: p.title, description: p.description, alternates: alternates(path, locale),
    openGraph: { title: p.title, description: p.description, url: localePath(path, locale), locale: OG_LOCALE[locale], type: 'article', publishedTime: p.date },
  };
}

export default async function PostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = getT(locale);
  const raw = getPost(slug);
  if (!raw) notFound();
  const p = localize(raw, locale);
  const url = `https://digiterial.com${localePath(`/bloq/${p.slug}`, locale)}`;
  const ld = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.description, datePublished: p.date, articleSection: p.category, inLanguage: locale, url, author: { '@type': 'Organization', name: 'Digiterial' }, publisher: { '@type': 'Organization', name: 'Digiterial' }, mainEntityOfPage: url };
  const related = localize(posts, locale).filter((x) => x.slug !== p.slug).slice(0, 3);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PageHero crumbs={[{ href: '/', label: t('Ana səhifə') }, { href: '/bloq', label: t('Bloq') }, { label: p.category }]} h1={p.title} lead={p.description}>
        <span className="label">{p.category} · {formatDate(p.date, locale)} · {t('{n} dəq oxuma', { n: readingMinutes(raw) })}</span>
      </PageHero>
      <section style={{ paddingTop: 48 }}>
        <div className="wrap">
          <article className="article">
            {p.body.map((b, i) => {
              if (b.t === 'ul') return <ul key={i}>{b.items.map((x, j) => <li key={j}>{x}</li>)}</ul>;
              if (b.t === 'h2') return <h2 key={i}>{b.text}</h2>;
              if (b.t === 'h3') return <h3 key={i}>{b.text}</h3>;
              if (b.t === 'quote') return <blockquote key={i}>{b.text}</blockquote>;
              return <p key={i}>{b.text}</p>;
            })}
          </article>
        </div>
      </section>
      {p.faq.length > 0 && <FaqSection items={p.faq} title={t('Tez-tez soruşulanlar')} label={t('Suallar')} />}
      <section><div className="wrap"><div className="label" style={{ marginBottom: 24 }}>{t('Digər yazılar')}</div><div className="posts">{related.map((r) => <PostCard key={r.slug} p={r} />)}</div></div></section>
      <CtaBand title={t('Bu mövzuda köməyə ehtiyacınız var?')} text={t('Layihənizi bizimlə bölüşün, 24 saat ərzində cavab verək.')} />
    </>
  );
}
