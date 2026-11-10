'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { clampQty, readOrder, writeOrder, type OrderLine } from '@/lib/catalog/order';
import { skuLabel, unitLabel } from '@/lib/catalog/labels';
import { inquiryMessage, lineUnit, whatsappLink } from '@/lib/catalog/whatsapp';
import { localePath } from '@/lib/seo';
import { pick, type Locale, type Product } from '@/lib/catalog/types';

export function OrderList({ products, origin, whatsappE164 }: { products: Product[]; origin: string; whatsappE164: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations('order');
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLines(readOrder());
  }, []);

  function commit(next: OrderLine[]) {
    setLines(next);
    writeOrder(next);
    setCopied(false);
  }

  const resolved = lines.map((line) => {
    const product = products.find((item) => item.id === line.productId);
    const variant = product?.variants.find((item) => item.id === line.variantId && item.status === 'published');
    return { line, product, variant };
  });

  const message = useMemo(() => {
    const items = resolved.flatMap(({ line, product, variant }) => {
      if (!product || !variant) return [];
      return [
        {
          name: pick(product.name, locale),
          sku: skuLabel(variant.sku, locale),
          variant: pick(variant.name, locale),
          quantity: line.qty,
          unit: lineUnit(variant.unit, locale),
          url: `${origin}${localePath(`/mehsul/${product.slug}`, locale)}`,
        },
      ];
    });
    return inquiryMessage(locale, items);
  }, [locale, origin, resolved]);

  const href = resolved.some((item) => item.product && item.variant) ? whatsappLink(whatsappE164, message) : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-3">
        {resolved.length === 0 && <p className="rounded-2xl border border-dashed border-[#D5DAE1] bg-white p-6 text-sm">{t('empty')}</p>}
        {resolved.map(({ line, product, variant }) => (
          <article key={`${line.productId}-${line.variantId}`} className="rounded-2xl border border-[#E4E7EB] bg-white p-4">
            {!product || !variant ? (
              <p className="text-sm">{t('missing')}</p>
            ) : (
              <>
                <h2 className="font-semibold">
                  <Link href={`/mehsul/${product.slug}`} className="underline">{pick(product.name, locale)}</Link>
                </h2>
                <p className="mt-1 text-sm text-[#374151]">{pick(variant.name, locale)}</p>
                <p className="text-sm">{t('sku')}: {skuLabel(variant.sku, locale)}</p>
                <p className="text-sm">{t('unit')}: {unitLabel(variant.unit, locale) || t('unitUnknown')}</p>
              </>
            )}
            <div className="mt-3 flex items-center gap-3">
              <label className="text-sm">
                {t('qty')}
                <input
                  type="number"
                  min={1}
                  max={9999}
                  value={line.qty}
                  onChange={(event) => {
                    commit(lines.map((item) => (item === line ? { ...item, qty: clampQty(Number(event.target.value)) } : item)));
                  }}
                  className="ml-2 h-11 w-24 rounded-lg border border-[#D5DAE1] px-2"
                />
              </label>
              <button
                type="button"
                className="h-11 rounded-full border border-[#D5DAE1] px-4 text-sm"
                onClick={() => commit(lines.filter((item) => item !== line))}
              >
                {t('remove')}
              </button>
            </div>
          </article>
        ))}
      </div>
      <aside className="h-fit rounded-2xl border border-[#E4E7EB] bg-white p-4">
        <h2 className="font-semibold">{t('preview')}</h2>
        <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-[#F7F8FA] p-3 text-sm leading-6">{message}</pre>
        <button
          type="button"
          className="mt-3 h-11 w-full rounded-full border border-[#0A286E] text-sm font-semibold text-[#0A286E]"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(message);
              setCopied(true);
            } catch {
              setCopied(false);
            }
          }}
        >
          {copied ? t('copied') : t('copy')}
        </button>
        {href ? (
          <a href={href} className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#1FA855] font-semibold text-white">
            {t('whatsapp')}
          </a>
        ) : (
          <p className="mt-2 text-sm text-[#6B7280]">{t('waUnavailable')}</p>
        )}
      </aside>
    </div>
  );
}
