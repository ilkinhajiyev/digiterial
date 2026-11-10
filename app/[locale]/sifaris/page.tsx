import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { OrderList } from '@/components/catalog/order-list';
import { requestOrigin } from '@/lib/catalog/origin';
import { publicProducts } from '@/lib/catalog/query';
import { readCatalog } from '@/lib/catalog/store';
import { isLocale } from '@/lib/catalog/types';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function OrderPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  setRequestLocale(locale);
  const t = await getTranslations('order');
  const catalog = readCatalog();
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">{t('title')}</h1>
      <OrderList products={publicProducts(catalog)} origin={await requestOrigin()} whatsappE164={catalog.settings.whatsappE164} />
    </div>
  );
}
