import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMeta } from '@/lib/catalog/meta';
import { readCatalog } from '@/lib/catalog/store';
import { isLocale } from '@/lib/catalog/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : 'az';
  const blog = readCatalog().pages.blog[loc];
  return pageMeta(loc, '/blog', blog.mainTitle, blog.subtitle);
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  setRequestLocale(locale);
  const t = await getTranslations('blog');
  const blog = readCatalog().pages.blog[locale];
  const items = [blog.item1, blog.item2, blog.item3];
  return (
    <div>
      <p className="text-sm font-medium text-[#0A286E]">{blog.badge}</p>
      <h1 className="mt-2 text-3xl font-semibold">{blog.mainTitle}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6">{blog.subtitle}</p>
      <p className="mt-2 text-sm text-[#6B7280]">{t('note')}</p>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <article key={item.title} className="rounded-2xl border border-[#E4E7EB] bg-white p-4">
            <h2 className="font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6">{item.desc}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
