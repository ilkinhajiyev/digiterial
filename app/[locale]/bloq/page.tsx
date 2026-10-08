import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import PageHeader from '@/components/site/page-header';
import { BlockRenderer } from '@/components/site/blocks';
import { getPosts } from '@/lib/data/posts';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; const t = await getTranslations({ locale, namespace: 'pages.blog' });
  return pageMetadata('blog', locale, '/bloq', { title: `${t('h1a')} ${t('h1b')}`, description: t('lead') });
}

export default async function Blog({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations('pages.blog'); const h = await getTranslations('home'); const n = await getTranslations('nav');
  const posts = await getPosts(locale);
  const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={`${t('h1a')} *${t('h1b')}*`} lead={t('lead')} />
      <section className="pb-20"><div className="wrap">
        {posts.length === 0 ? (
          <div className="card flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-12">
            <div><p className="t-h3">{t('empty')}</p><p className="mt-2 text-[color:var(--ink-2)]">{t('emptyP')}</p></div>
            <Link href="/elaqe" className="btn-primary">{n('cta')} <ArrowUpRight size={18} className="arr" /></Link>
          </div>
        ) : (
          <div className="grid gap-x-4 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.id} href={`/bloq/${p.slug}`} className="group block">
                <div className="img-zoom aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-sage">
                  {p.cover_url ? <img src={p.cover_url} alt="" loading="lazy" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center p-8 font-display text-xl tracking-tight text-ink/50">{p.keyword || p.title}</div>}
                </div>
                <time className="mt-5 block font-mono text-xs text-mut" dateTime={p.published_at || p.created_at}>{fmt.format(new Date(p.published_at || p.created_at))}</time>
                <h2 className="t-h3 mt-2 transition group-hover:text-brand-deep">{p.title}</h2>
                {p.excerpt && <p className="mt-2 line-clamp-3 text-[color:var(--ink-2)]">{p.excerpt}</p>}
              </Link>
            ))}
          </div>
        )}
      </div></section>
      <BlockRenderer blocks={[{ type: 'cta', props: { h2: h('cta.h2'), p: h('cta.p'), b1: h('cta.b1') } }]} />
    </>
  );
}
