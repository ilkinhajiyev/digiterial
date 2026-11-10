import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { JsonLd } from '@/components/catalog/jsonld';
import { Purchase } from '@/components/catalog/purchase';
import { ProductCard } from '@/components/catalog/product-card';
import { pageMeta } from '@/lib/catalog/meta';
import { requestOrigin, publicSiteUrl } from '@/lib/catalog/origin';
import { isPublic, publicProducts } from '@/lib/catalog/query';
import { readCatalog } from '@/lib/catalog/store';
import { pick, isLocale } from '@/lib/catalog/types';
import { localePath } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const product = readCatalog().products.find((item) => item.slug === slug);
  if (!product || !isLocale(locale) || !isPublic(product)) return {};
  const variant = product.variants.find((item) => item.status === 'published');
  return pageMeta(locale, `/mehsul/${product.slug}`, pick(product.name, locale), pick(variant?.description, locale).slice(0, 180));
}

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const catalog = readCatalog();
  const product = catalog.products.find((item) => item.slug === slug);
  if (!product || !isPublic(product)) notFound();
  const t = await getTranslations('product');
  const category = catalog.categories.find((item) => item.id === product.categoryId);
  const origin = await requestOrigin();
  const path = `/mehsul/${product.slug}`;
  const url = `${publicSiteUrl()}${localePath(path, locale)}`;
  const variant = product.variants.find((item) => item.status === 'published')!;
  const image = variant.image || product.images[0]?.src;
  const related = publicProducts(catalog).filter((item) => item.categoryId === product.categoryId && item.id !== product.id).slice(0, 4);
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pick(product.name, locale),
    description: pick(variant.description, locale),
    url,
    category: category ? pick(category.name, locale) : undefined,
    image: image ? [`${publicSiteUrl()}${image}`] : undefined,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    hasVariant: product.variants.filter((item) => item.status === 'published').map((item) => {
      const variantSchema: Record<string, unknown> = {
        '@type': 'Product',
        name: pick(item.name, locale),
        image: item.image ? `${publicSiteUrl()}${item.image}` : undefined,
      };
      if (item.sku) variantSchema.sku = item.sku;
      return variantSchema;
    }),
  };
  if (variant.sku) schema.sku = variant.sku;
  return (
    <div>
      <nav className="mb-4 text-sm text-[#4B5563]" aria-label="Breadcrumb">
        <Link href="/" className="underline">SOCHİ</Link>
        <span> / </span>
        <Link href="/kataloq" className="underline">{locale === 'en' ? 'Catalog' : locale === 'ru' ? 'Каталог' : 'Kataloq'}</Link>
        {category && (
          <>
            <span> / </span>
            <Link href={`/kataloq/${category.id}`} className="underline">{pick(category.name, locale)}</Link>
          </>
        )}
        <span> / </span>
        <span>{pick(product.name, locale)}</span>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'SOCHİ MMC', item: `${publicSiteUrl()}${localePath('/', locale)}` },
            { '@type': 'ListItem', position: 2, name: 'Kataloq', item: `${publicSiteUrl()}${localePath('/kataloq', locale)}` },
            ...(category
              ? [{ '@type': 'ListItem', position: 3, name: pick(category.name, locale), item: `${publicSiteUrl()}${localePath(`/kataloq/${category.id}`, locale)}` }]
              : []),
            { '@type': 'ListItem', position: category ? 4 : 3, name: pick(product.name, locale), item: url },
          ],
        }}
      />
      <JsonLd data={schema} />
      <Purchase product={product} origin={origin} whatsappE164={catalog.settings.whatsappE164} categoryName={category ? pick(category.name, locale) : ''} />
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">{t('related')}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                variants={item.variants.filter((entry) => entry.status === 'published')}
                origin={origin}
                whatsappE164={catalog.settings.whatsappE164}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
