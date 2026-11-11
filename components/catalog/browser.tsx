import { getTranslations } from 'next-intl/server';
import { ProductCard } from './product-card';
import { Filters } from './filters';
import { facetsFor, filterProducts, matchingVariants, publicProducts, type Filters as FilterState } from '@/lib/catalog/query';
import { pick, type Catalog, type Category, type Locale } from '@/lib/catalog/types';

export async function Browser({
  catalog,
  locale,
  origin,
  category,
  filters,
}: {
  catalog: Catalog;
  locale: Locale;
  origin: string;
  category?: Category;
  filters: FilterState;
}) {
  const t = await getTranslations('catalog');
  const f = await getTranslations('filters');
  const products = publicProducts(catalog);
  const scoped = products.filter((product) => !category || product.categoryId === category.id);
  const facets = facetsFor(scoped);
  const result = filterProducts(products, filters, category?.id);
  const subs = (category?.subs || []).map((sub) => ({ id: sub.id, name: pick(sub.name, locale) }));
  return (
    <div className="grid gap-4 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <Filters categoryId={category?.id} filters={filters} facets={facets} subs={subs} total={result.length} />
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">{category ? pick(category.name, locale) : t('title')}</h1>
        {filters.q && <p className="mt-1 text-sm text-[#5C6570]">{t('search', { query: filters.q })}</p>}
        {category && <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5C6570]">{pick(category.summary, locale)}</p>}
        {result.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-[#E6E8EC] bg-white p-6 text-sm">{f('empty')}</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-3">
            {result.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variants={matchingVariants(product, filters)}
                origin={origin}
                whatsappE164={catalog.settings.whatsappE164}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
