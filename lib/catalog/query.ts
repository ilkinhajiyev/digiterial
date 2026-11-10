import { fold, includesFold } from './text';
import { pick, type Catalog, type Product, type Variant } from './types';

export type Filters = {
  q: string;
  brand: string;
  thickness: string;
  area: string;
  unit: string;
  stock: string;
  sub: string;
};

export function publishedVariants(product: Product): Variant[] {
  return product.variants.filter((v) => v.status === 'published');
}

export function isPublic(product: Product): boolean {
  return product.status === 'published' && publishedVariants(product).length > 0;
}

export function publicProducts(catalog: Catalog): Product[] {
  return catalog.products.filter(isPublic);
}

function stockOk(variant: Variant, stock: string): boolean {
  if (!stock) return true;
  if (stock === 'sorus') return variant.stock == null;
  if (stock === 'tesdiq') return variant.stock != null;
  if (stock === 'var') return variant.stock?.status === 'in';
  if (stock === 'yox') return variant.stock?.status === 'out';
  return true;
}

export function variantMatches(product: Product, variant: Variant, filters: Filters): boolean {
  if (variant.status !== 'published') return false;
  if (filters.sub && product.subcategoryId !== filters.sub) return false;
  if (filters.brand && (product.brand || '') !== filters.brand) return false;
  if (filters.thickness && String(variant.thicknessMm ?? '') !== filters.thickness) return false;
  if (filters.area && !variant.applicationAreas.includes(filters.area)) return false;
  if (filters.unit && (variant.unit || '') !== filters.unit) return false;
  if (!stockOk(variant, filters.stock)) return false;
  if (filters.q.trim()) {
    const blob = [
      pick(product.name, 'az'),
      pick(product.name, 'en'),
      pick(product.name, 'ru'),
      product.family,
      product.brand || '',
      variant.sku || '',
      pick(variant.name, 'az'),
      pick(variant.name, 'en'),
      pick(variant.name, 'ru'),
    ].join(' ');
    if (!includesFold(blob, filters.q)) return false;
  }
  return true;
}

export function matchingVariants(product: Product, filters: Filters): Variant[] {
  return publishedVariants(product).filter((v) => variantMatches(product, v, filters));
}

export function filterProducts(products: Product[], filters: Filters, categoryId?: string): Product[] {
  return products.filter((product) => {
    if (categoryId && product.categoryId !== categoryId) return false;
    return matchingVariants(product, filters).length > 0;
  });
}

export type Facets = {
  brands: string[];
  thicknesses: string[];
  units: string[];
  areas: string[];
  subs: string[];
};

export function facetsFor(products: Product[], categoryId?: string): Facets {
  const list = products.filter((p) => !categoryId || p.categoryId === categoryId);
  const brands = new Set<string>();
  const thicknesses = new Set<string>();
  const units = new Set<string>();
  const areas = new Set<string>();
  const subs = new Set<string>();
  for (const product of list) {
    if (product.brand) brands.add(product.brand);
    subs.add(product.subcategoryId);
    for (const variant of publishedVariants(product)) {
      if (variant.thicknessMm != null) thicknesses.add(String(variant.thicknessMm));
      if (variant.unit) units.add(variant.unit);
      variant.applicationAreas.forEach((a) => areas.add(a));
    }
  }
  const thicknessSort = [...thicknesses].sort((a, b) => Number(a) - Number(b));
  return {
    brands: [...brands].sort((a, b) => a.localeCompare(b)),
    thicknesses: thicknessSort,
    units: [...units].sort(),
    areas: ['dam', 'fasad', 'temel', 'doseme', 'daxili'].filter((a) => areas.has(a)),
    subs: [...subs],
  };
}

export function searchBlob(product: Product): string {
  return fold(
    [product.family, product.brand || '', ...product.variants.flatMap((v) => [v.sku || '', v.name.az, v.name.en, v.name.ru])].join(' '),
  );
}
