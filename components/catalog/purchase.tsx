'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Picture } from './picture';
import { priceLabel, skuLabel, specValue, SPEC_LABELS, stockLabel, unitLabel, unitUnknown, pdfUnknown } from '@/lib/catalog/labels';
import { inquiryMessage, lineUnit, whatsappLink } from '@/lib/catalog/whatsapp';
import { addToOrder, clampQty } from '@/lib/catalog/order';
import { localePath } from '@/lib/seo';
import { pick, type Locale, type Product } from '@/lib/catalog/types';

export function Purchase({
  product,
  origin,
  whatsappE164,
  categoryName,
}: {
  product: Product;
  origin: string;
  whatsappE164: string;
  categoryName: string;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations('product');
  const areas = useTranslations('areas');
  const variants = product.variants.filter((variant) => variant.status === 'published');
  const [variantId, setVariantId] = useState(variants[0]?.id || '');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const variant = variants.find((item) => item.id === variantId) || variants[0];
  const name = pick(product.name, locale);
  const url = `${origin}${localePath(`/mehsul/${product.slug}`, locale)}`;

  const message = useMemo(() => {
    if (!variant) return '';
    return inquiryMessage(locale, [
      {
        name,
        sku: skuLabel(variant.sku, locale),
        variant: pick(variant.name, locale),
        quantity: clampQty(qty),
        unit: lineUnit(variant.unit, locale),
        url,
      },
    ]);
  }, [locale, name, qty, url, variant]);

  if (!variant) return null;
  const href = whatsappLink(whatsappE164, message);
  const image = variant.image || product.images[0]?.src || null;
  const gallery = product.images.length > 1 ? product.images : [];

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <div className="rounded-xl border border-[#ECEEF2] bg-white p-3">
        <div className="relative aspect-square overflow-hidden bg-white">
          <Picture src={image} alt={name} locale={locale} priority />
        </div>
        {gallery.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-auto">
            {gallery.map((item) => (
              <button
                key={item.id}
                type="button"
                className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[#E6E8EC] bg-white"
                onClick={() => {
                  const match = variants.find((entry) => entry.image === item.src);
                  if (match) setVariantId(match.id);
                }}
              >
                <Picture src={item.src} alt={pick(item.alt, locale)} locale={locale} />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="rounded-xl border border-[#ECEEF2] bg-white p-4 sm:p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-[#8A9099]">{categoryName} · {product.family}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl">{name}</h1>
        {product.brand && <p className="mt-2 text-sm">{t('brand')}: {product.brand}</p>}
        <fieldset className="mt-5">
          <legend className="text-sm font-medium">{t('variant')}</legend>
          <div className="mt-2 grid gap-2">
            {variants.map((item) => (
              <label key={item.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 ${item.id === variant.id ? 'border-[#0A286E] bg-[#F4F7FC]' : 'border-[#E6E8EC]'}`}>
                <input
                  type="radio"
                  name="variant"
                  className="mt-1"
                  checked={item.id === variant.id}
                  onChange={() => {
                    setVariantId(item.id);
                    setAdded(false);
                  }}
                />
                <span className="text-sm">{pick(item.name, locale)}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <dl className="mt-4 grid gap-1 text-sm">
          <div className="flex justify-between gap-4"><dt>{t('sku')}</dt><dd>{skuLabel(variant.sku, locale)}</dd></div>
          <div className="flex justify-between gap-4"><dt>{t('unit')}</dt><dd>{unitLabel(variant.unit, locale) || unitUnknown(locale)}</dd></div>
          <div className="flex justify-between gap-4"><dt>{t('price')}</dt><dd className="text-right text-lg font-bold text-[#0A286E]">{priceLabel(variant.price, variant.unit, locale)}</dd></div>
          <div className="flex justify-between gap-4"><dt>{t('stock')}</dt><dd>{stockLabel(variant.stock, locale)}</dd></div>
        </dl>
        <label className="mt-4 block text-sm font-medium">
          {t('qty')}
          <input
            type="number"
            min={1}
            max={9999}
            value={qty}
            onChange={(event) => {
              setQty(clampQty(Number(event.target.value)));
              setAdded(false);
            }}
            className="mt-1 h-10 w-28 rounded-lg border border-[#E6E8EC] bg-[#F7F8FA] px-3"
          />
        </label>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          {href ? (
            <a href={href} className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-[#1FA855] px-5 text-sm font-semibold text-white">
              {t('whatsapp')}
            </a>
          ) : (
            <p className="text-sm text-[#6B7280]">{t('waUnavailable')}</p>
          )}
          <button
            type="button"
            className="inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-[#0A286E] px-5 text-sm font-semibold text-[#0A286E]"
            onClick={() => {
              addToOrder(product.id, variant.id, qty);
              setAdded(true);
            }}
          >
            {t('add')}
          </button>
        </div>
        {added && (
          <p className="mt-2 text-sm">
            {t('added')} <Link href="/sifaris" className="underline">{t('openList')}</Link>
          </p>
        )}
        <h2 className="mt-8 text-lg font-semibold">{t('specs')}</h2>
        {variant.specs.length === 0 ? (
          <p className="mt-2 text-sm text-[#6B7280]">{t('specsUnknown')}</p>
        ) : (
          <table className="mt-2 w-full text-left text-sm">
            <tbody>
              {variant.specs.map((spec) => (
                <tr key={spec.key} className="border-t border-[#F0F1F3]">
                  <th className="py-2 pr-3 font-medium">{SPEC_LABELS[spec.key]?.[locale] || spec.key}</th>
                  <td className="py-2">{specValue(spec.value, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="mt-2 text-xs text-[#6B7280]">{t('codeNote')}</p>
        <h2 className="mt-6 text-lg font-semibold">{t('areas')}</h2>
        {variant.applicationAreas.length === 0 ? (
          <p className="mt-2 text-sm text-[#6B7280]">{t('areasUnknown')}</p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-2">
            {variant.applicationAreas.map((area) => (
              <li key={area}>
                <Link href={`/kataloq?sahe=${area}`} className="inline-flex h-9 items-center rounded-lg bg-[#F4F7FC] px-3 text-sm font-medium text-[#0A286E]">
                  {areas(area as 'dam')}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <h2 className="mt-6 text-lg font-semibold">{t('pdf')}</h2>
        {product.pdfs.length === 0 ? (
          <p className="mt-2 text-sm text-[#6B7280]">{pdfUnknown(locale)}</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {product.pdfs.map((pdf) => (
              <li key={pdf.id}>
                <a className="underline" href={pdf.src}>{pick(pdf.title, locale)}</a>
              </li>
            ))}
          </ul>
        )}
        <h2 className="mt-6 text-lg font-semibold">{t('description')}</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#1C1F24]">{pick(variant.description, locale)}</p>
      </div>
    </div>
  );
}
