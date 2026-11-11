'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Picture } from './picture';
import { priceLabel, skuLabel, specValue, SPEC_LABELS, stockLabel, unitLabel, unitUnknown } from '@/lib/catalog/labels';
import { inquiryMessage, lineUnit, whatsappLink } from '@/lib/catalog/whatsapp';
import { localePath } from '@/lib/seo';
import { pick, type Locale, type Product, type Variant } from '@/lib/catalog/types';

export function ProductCard({
  product,
  variants,
  origin,
  whatsappE164,
}: {
  product: Product;
  variants: Variant[];
  origin: string;
  whatsappE164: string;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations('card');
  const [id, setId] = useState(variants[0]?.id || '');
  const variant = variants.find((item) => item.id === id) || variants[0];
  const name = pick(product.name, locale);
  const url = `${origin}${localePath(`/mehsul/${product.slug}`, locale)}`;
  const message = useMemo(() => {
    if (!variant) return '';
    return inquiryMessage(locale, [
      {
        name,
        sku: skuLabel(variant.sku, locale),
        variant: pick(variant.name, locale),
        quantity: 1,
        unit: lineUnit(variant.unit, locale),
        url,
      },
    ]);
  }, [locale, name, url, variant]);
  const href = variant ? whatsappLink(whatsappE164, message) : null;
  const specs = (variant?.specs || []).slice(0, 2);
  const image = variant?.image || product.images[0]?.src || null;

  if (!variant) return null;

  return (
    <article className="flex h-full flex-col rounded-xl border border-[#ECEEF2] bg-white p-2.5 transition-shadow hover:shadow-[0_8px_24px_rgba(16,24,40,0.08)] sm:p-3">
      <Link href={`/mehsul/${product.slug}`} className="relative block aspect-square overflow-hidden bg-white">
        <Picture src={image} alt={name} locale={locale} />
      </Link>
      <div className="mt-2 flex flex-1 flex-col">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[#8A9099]">{product.family}</p>
        <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-medium leading-5 text-[#1A1A1A]">
          <Link href={`/mehsul/${product.slug}`}>{name}</Link>
        </h3>
        {variants.length > 1 ? (
          <label className="mt-2 text-sm text-[#3A3F47]">
            <span className="sr-only">{t('variant')}</span>
            <select
              value={variant.id}
              onChange={(event) => setId(event.target.value)}
              className="h-11 w-full rounded-lg border border-[#E6E8EC] bg-white px-2 text-sm"
            >
              {variants.map((item) => (
                <option key={item.id} value={item.id}>
                  {pick(item.name, locale)}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p className="mt-2 line-clamp-1 text-xs text-[#5C6570]">{pick(variant.name, locale)}</p>
        )}
        <p className="mt-2 hidden text-xs text-[#5C6570] sm:block">
          {t('sku')}: {skuLabel(variant.sku, locale)}
        </p>
        <ul className="mt-1 hidden text-xs text-[#5C6570] sm:block">
          {specs.map((spec) => (
            <li key={spec.key} className="line-clamp-1">
              {SPEC_LABELS[spec.key]?.[locale] || spec.key}: {specValue(spec.value, locale)}
            </li>
          ))}
        </ul>
        <p className="mt-1 text-xs text-[#5C6570]">{unitLabel(variant.unit, locale) || unitUnknown(locale)}</p>
        <p className="mt-2 text-sm font-bold leading-5 text-[#0A286E]">{priceLabel(variant.price, variant.unit, locale)}</p>
        <p className="mt-0.5 text-xs text-[#5C6570]">{stockLabel(variant.stock, locale)}</p>
        {href ? (
          <a href={href} className="relative z-0 mt-3 inline-flex h-12 items-center justify-center rounded-lg bg-[#1FA855] px-2 text-center text-sm font-semibold text-white">
            <span className="sm:hidden">{t('whatsappShort')}</span>
            <span className="hidden sm:inline">{t('whatsapp')}</span>
          </a>
        ) : (
          <p className="mt-3 text-xs text-[#6B7280]">{t('waUnavailable')}</p>
        )}
      </div>
    </article>
  );
}
