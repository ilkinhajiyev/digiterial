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
    <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <Filters categoryId={category?.id} filters={filters} facets={facets} subs={subs} total={result.length} />
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#1C1F24]">{category ? pick(category.name, locale) : t('title')}</h1>
        {filters.q && <p className="mt-2 text-sm text-[#4B5563]">{t('search', { query: filters.q })}</p>}
        {category && <p className="mt-3 max-w-3xl text-sm leading-6 text-[#374151]">{pick(category.summary, locale)}</p>}
        {result.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-[#D5DAE1] bg-white p-6 text-sm">{f('empty')}</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
