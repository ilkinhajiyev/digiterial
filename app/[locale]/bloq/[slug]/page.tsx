import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import PageHeader from '@/components/site/page-header';
import { BlockRenderer } from '@/components/site/blocks';
import { JsonLd } from '@/components/site/jsonld';
import { getPost, readingMinutes } from '@/lib/data/posts';
import { buildMetadata, SITE_URL } from '@/lib/seo';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params; const p = await getPost(slug);
  if (!p) return {};
  return buildMetadata({ locale: p.locale || locale, path: `/bloq/${p.slug}`, title: p.title, description: p.excerpt, image: p.cover_url, type: 'article' });
}

/** Sadə, təhlükəsiz mətn formatı: boş sətir = abzas, "## " = başlıq, "- " = siyahı. HTML qəbul edilmir. */
function Body({ text }: { text: string }) {
  const blocks = text.replace(/\r/g, '').split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="prose-site">
      {blocks.map((b, i) => {
        if (b.startsWith('## ')) return <h2 key={i}>{b.slice(3)}</h2>;
        if (b.startsWith('### ')) return <h3 key={i}>{b.slice(4)}</h3>;
        if (b.startsWith('> ')) return <blockquote key={i}>{b.replace(/^> ?/gm, '')}</blockquote>;
        if (/^- /m.test(b) && b.split('\n').every((l) => l.startsWith('- '))) return <ul key={i}>{b.split('\n').map((l, j) => <li key={j}>{l.slice(2)}</li>)}</ul>;
        return <p key={i}>{b.split('\n').map((l, j, a) => <span key={j}>{l}{j < a.length - 1 && <br />}</span>)}</p>;
      })}
    </div>
  );
}

export default async function PostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params; setRequestLocale(locale);
  const post = await getPost(slug);
  if (!post) notFound();
  const t = await getTranslations('pages.blog'); const h = await getTranslations('home');
  const date = post.published_at || post.created_at;
  const ld = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.excerpt, datePublished: date, image: post.cover_url || undefined, inLanguage: post.locale, publisher: { '@type': 'Organization', name: 'Digiterial', url: SITE_URL } };
  return (
    <>
      <JsonLd data={ld} />
      <PageHeader back={{ href: '/bloq', label: t('back') }} eyebrow={`${new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(date))} · ${readingMinutes(post.body)} ${t('min')}`} title={post.title} lead={post.excerpt} />
      {post.cover_url && <div className="wrap"><img src={post.cover_url} alt="" className="aspect-[16/8] w-full rounded-[1.5rem] object-cover" /></div>}
      <article className="section"><div className="wrap"><div className="mx-auto max-w-[68ch]"><Body text={post.body || ''} /></div></div></article>
      <BlockRenderer blocks={[{ type: 'cta', props: { h2: h('cta.h2'), p: h('cta.p'), b1: h('cta.b1') } }]} />
    </>
  );
}
