import { setRequestLocale } from 'next-intl/server';
import { Browser } from '@/components/catalog/browser';
import { pageMeta } from '@/lib/catalog/meta';
import { readFilters } from '@/lib/catalog/filters';
import { requestOrigin } from '@/lib/catalog/origin';
import { readCatalog } from '@/lib/catalog/store';
import { isLocale } from '@/lib/catalog/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const title = locale === 'en' ? 'Catalog' : locale === 'ru' ? 'Каталог' : 'Kataloq';
  return pageMeta(locale, '/kataloq', title, 'SOCHİ MMC izolyasiya materialları kataloqu.');
}

export default async function CatalogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  setRequestLocale(locale);
  const filters = readFilters(await searchParams);
  return <Browser catalog={readCatalog()} locale={locale} origin={await requestOrigin()} filters={filters} />;
}
