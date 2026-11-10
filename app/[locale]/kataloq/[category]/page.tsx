import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Browser } from '@/components/catalog/browser';
import { JsonLd } from '@/components/catalog/jsonld';
import { pageMeta } from '@/lib/catalog/meta';
import { readFilters } from '@/lib/catalog/filters';
import { requestOrigin, publicSiteUrl } from '@/lib/catalog/origin';
import { readCatalog } from '@/lib/catalog/store';
import { pick, isLocale } from '@/lib/catalog/types';
import { localePath } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { locale, category: categoryId } = await params;
  const category = readCatalog().categories.find((item) => item.id === categoryId);
  if (!category || !isLocale(locale)) return {};
  return pageMeta(locale, `/kataloq/${category.id}`, pick(category.name, locale), pick(category.summary, locale));
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, category: categoryId } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const catalog = readCatalog();
  const category = catalog.categories.find((item) => item.id === categoryId);
  if (!category) notFound();
  const path = `/kataloq/${category.id}`;
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'SOCHİ MMC', item: publicSiteUrl() + localePath('/', locale) },
            { '@type': 'ListItem', position: 2, name: pick(category.name, locale), item: publicSiteUrl() + localePath(path, locale) },
          ],
        }}
      />
      <Browser catalog={catalog} locale={locale} origin={await requestOrigin()} category={category} filters={readFilters(await searchParams)} />
    </>
  );
}
