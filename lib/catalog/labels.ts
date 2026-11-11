import type { Locale, Price, Stock } from './types';

const UNITS: Record<string, Record<Locale, string>> = {
  rulon: { az: 'rulon', en: 'roll', ru: 'рулон' },
  litr: { az: 'litr', en: 'L', ru: 'л' },
  kq: { az: 'kq', en: 'kg', ru: 'кг' },
  m2: { az: 'm²', en: 'm²', ru: 'м²' },
};

export function unitLabel(unit: string | null, locale: Locale): string | null {
  if (!unit) return null;
  return UNITS[unit]?.[locale] || unit;
}

export function priceLabel(price: Price, unit: string | null, locale: Locale): string {
  if (!price) {
    return locale === 'en' ? 'Ask the price on WhatsApp' : locale === 'ru' ? 'Цену уточняйте в WhatsApp' : 'Qiyməti WhatsApp-da soruşun';
  }
  const amount = new Intl.NumberFormat('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price.amount);
  const u = unitLabel(unit, locale);
  return u ? `${amount} ${price.currency} / ${u}` : `${amount} ${price.currency}`;
}

export function stockLabel(stock: Stock, locale: Locale): string {
  if (!stock) {
    return locale === 'en' ? 'Ask about availability' : locale === 'ru' ? 'Наличие уточняйте' : 'Mövcudluğu soruşun';
  }
  if (stock.status === 'out') {
    return locale === 'en' ? 'Out of stock' : locale === 'ru' ? 'Нет в наличии' : 'Stokda yoxdur';
  }
  if (stock.qty != null) {
    return locale === 'en' ? `In stock: ${stock.qty}` : locale === 'ru' ? `В наличии: ${stock.qty}` : `Stokda: ${stock.qty}`;
  }
  return locale === 'en' ? 'In stock' : locale === 'ru' ? 'В наличии' : 'Stokda var';
}

export function skuLabel(sku: string | null, locale: Locale): string {
  if (sku) return sku;
  return locale === 'en' ? 'SKU not confirmed' : locale === 'ru' ? 'Артикул не подтверждён' : 'Artikul təsdiqlənməyib';
}

export function unitUnknown(locale: Locale): string {
  return locale === 'en' ? 'Sales unit not confirmed' : locale === 'ru' ? 'Единица продажи не подтверждена' : 'Satış vahidi təsdiqlənməyib';
}

export function imageUnknown(locale: Locale): string {
  return locale === 'en' ? 'Image not confirmed' : locale === 'ru' ? 'Изображение не подтверждено' : 'Şəkil təsdiqlənməyib';
}

export function pdfUnknown(locale: Locale): string {
  return locale === 'en' ? 'Technical PDF not confirmed' : locale === 'ru' ? 'Технический PDF не подтверждён' : 'Texniki PDF təsdiqlənməyib';
}

export const SPEC_LABELS: Record<string, Record<Locale, string>> = {
  size: { az: 'Ölçü', en: 'Size', ru: 'Размер' },
  thickness: { az: 'Qalınlıq', en: 'Thickness', ru: 'Толщина' },
  length: { az: 'Uzunluq', en: 'Length', ru: 'Длина' },
  area: { az: 'Sahə', en: 'Area', ru: 'Площадь' },
  edge: { az: 'Kənar profili', en: 'Edge', ru: 'Кромка' },
  publishedCode: { az: 'Dərc olunan kod', en: 'Published code', ru: 'Опубликованный код' },
  basis: { az: 'Əsas', en: 'Base', ru: 'Основа' },
  package: { az: 'Qablaşdırma', en: 'Package', ru: 'Фасовка' },
};

export function specValue(value: string | Record<Locale, string>, locale: Locale): string {
  if (typeof value === 'string') return value;
  return value[locale] || value.az;
}
