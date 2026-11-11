import { unitLabel } from './labels';
import type { Locale } from './types';

export type InquiryLine = {
  name: string;
  sku: string;
  variant: string;
  quantity: number;
  unit: string;
  url: string;
};

const COPY: Record<Locale, { singleIntro: string; multiIntro: string; product: string; sku: string; variant: string; qty: string; link: string }> = {
  az: {
    singleIntro: 'Salam. Aşağıdakı məhsulun qiymətini və mövcudluğunu öyrənmək istəyirəm.',
    multiIntro: 'Salam. Aşağıdakı məhsulların qiymətini və mövcudluğunu öyrənmək istəyirəm.',
    product: 'Məhsul',
    sku: 'Artikul',
    variant: 'Variant',
    qty: 'Miqdar',
    link: 'Link',
  },
  en: {
    singleIntro: 'Hello. I would like to know the price and availability of the product below.',
    multiIntro: 'Hello. I would like to know the price and availability of the products below.',
    product: 'Product',
    sku: 'SKU',
    variant: 'Variant',
    qty: 'Quantity',
    link: 'Link',
  },
  ru: {
    singleIntro: 'Здравствуйте. Хочу узнать цену и наличие товара ниже.',
    multiIntro: 'Здравствуйте. Хочу узнать цену и наличие товаров ниже.',
    product: 'Товар',
    sku: 'Артикул',
    variant: 'Вариант',
    qty: 'Количество',
    link: 'Ссылка',
  },
};

export function adviceMessage(locale: Locale): string {
  if (locale === 'en') return 'Hello. I would like advice on insulation materials.';
  if (locale === 'ru') return 'Здравствуйте. Хочу получить консультацию по изоляционным материалам.';
  return 'Salam. İzolyasiya materialları barədə məsləhət almaq istəyirəm.';
}

function block(locale: Locale, line: InquiryLine, index?: number): string {
  const c = COPY[locale];
  const head = index ? `${index}) ${c.product} — ${line.name}` : `${c.product} — ${line.name}`;
  return [head, `${c.sku} — ${line.sku}`, `${c.variant} — ${line.variant}`, `${c.qty} — ${line.quantity} ${line.unit}`, `${c.link} — ${line.url}`].join('\n');
}

export function inquiryMessage(locale: Locale, lines: InquiryLine[]): string {
  const c = COPY[locale];
  if (lines.length <= 1) {
    const line = lines[0];
    if (!line) return c.singleIntro;
    return `${c.singleIntro}\n\n${block(locale, line)}`;
  }
  return `${c.multiIntro}\n\n${lines.map((line, i) => block(locale, line, i + 1)).join('\n\n')}`;
}

/** Returns null when the number is empty or not a valid Azerbaijan mobile in international form. */
export function whatsappLink(e164: string, message: string): string | null {
  const digits = (e164 || '').replace(/\D/g, '');
  if (!/^994\d{9}$/.test(digits)) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function lineUnit(unit: string | null, locale: Locale): string {
  return unitLabel(unit, locale) || (locale === 'en' ? 'unit not confirmed' : locale === 'ru' ? 'единица не подтверждена' : 'vahid təsdiqlənməyib');
}
