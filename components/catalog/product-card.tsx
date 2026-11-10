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
    <article className="flex h-full flex-col rounded-2xl border border-[#E4E7EB] bg-white p-3">
      <Link href={`/mehsul/${product.slug}`} className="relative block aspect-square overflow-hidden rounded-xl bg-[#F4F5F7]">
        <Picture src={image} alt={name} locale={locale} />
      </Link>
      <div className="mt-3 flex flex-1 flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-[#6B7280]">{product.family}</p>
        <h3 className="text-base font-semibold text-[#1C1F24]">
          <Link href={`/mehsul/${product.slug}`}>{name}</Link>
        </h3>
        {variants.length > 1 ? (
          <label className="text-sm text-[#374151]">
            <span className="sr-only">{t('variant')}</span>
            <select
              value={variant.id}
              onChange={(event) => setId(event.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-[#D5DAE1] bg-white px-2"
            >
              {variants.map((item) => (
                <option key={item.id} value={item.id}>
                  {pick(item.name, locale)}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p className="text-sm text-[#374151]">{pick(variant.name, locale)}</p>
        )}
        <p className="text-sm text-[#374151]">
          {t('sku')}: {skuLabel(variant.sku, locale)}
        </p>
        <ul className="text-sm text-[#374151]">
          {specs.map((spec) => (
            <li key={spec.key}>
              {SPEC_LABELS[spec.key]?.[locale] || spec.key}: {specValue(spec.value, locale)}
            </li>
          ))}
        </ul>
        <p className="text-sm">{unitLabel(variant.unit, locale) || unitUnknown(locale)}</p>
        <p className="text-sm font-medium text-[#0A286E]">{priceLabel(variant.price, variant.unit, locale)}</p>
        <p className="text-sm text-[#4B5563]">{stockLabel(variant.stock, locale)}</p>
        {href ? (
          <a href={href} className="mt-auto inline-flex h-11 items-center justify-center rounded-full bg-[#1FA855] px-4 text-sm font-semibold text-white">
            {t('whatsapp')}
          </a>
        ) : (
          <p className="mt-auto text-sm text-[#6B7280]">{t('waUnavailable')}</p>
        )}
      </div>
    </article>
  );
}
