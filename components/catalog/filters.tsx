'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { localePath } from '@/lib/seo';
import type { Facets, Filters } from '@/lib/catalog/query';
import type { Locale } from '@/lib/catalog/types';

const AREAS = ['dam', 'fasad', 'temel', 'doseme', 'daxili'] as const;

export function Filters({
  categoryId,
  filters,
  facets,
  subs,
  total,
}: {
  categoryId?: string;
  filters: Filters;
  facets: Facets;
  subs: { id: string; name: string }[];
  total: number;
}) {
  const t = useTranslations('filters');
  const areas = useTranslations('areas');
  const units = useTranslations('units');
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);
  const action = localePath(categoryId ? `/kataloq/${categoryId}` : '/kataloq', locale);
  const clear = action;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const form = (
    <form action={action} className="grid gap-3">
      {filters.q && <input type="hidden" name="q" value={filters.q} />}
      <Field label={t('brand')} name="marka" value={filters.brand} options={facets.brands.map((brand) => ({ value: brand, label: brand }))} anyLabel={t('any')} />
      <Field
        label={t('thickness')}
        name="qalinliq"
        value={filters.thickness}
        options={facets.thicknesses.map((value) => ({ value, label: `${value} mm` }))}
        anyLabel={t('any')}
      />
      <Field
        label={t('area')}
        name="sahe"
        value={filters.area}
        options={AREAS.filter((area) => facets.areas.includes(area)).map((area) => ({ value: area, label: areas(area) }))}
        anyLabel={t('any')}
      />
      <Field
        label={t('unit')}
        name="vahid"
        value={filters.unit}
        options={facets.units.map((unit) => ({ value: unit, label: units(unit as 'rulon') }))}
        anyLabel={t('any')}
      />
      <Field
        label={t('stock')}
        name="stok"
        value={filters.stock}
        anyLabel={t('any')}
        options={[
          { value: 'tesdiq', label: t('stockConfirmed') },
          { value: 'var', label: t('inStock') },
          { value: 'yox', label: t('outStock') },
          { value: 'sorus', label: t('askStock') },
        ]}
      />
      {subs.length > 0 && (
        <Field label={t('sub')} name="alt" value={filters.sub} anyLabel={t('any')} options={subs.map((sub) => ({ value: sub.id, label: sub.name }))} />
      )}
      <button type="submit" className="h-10 rounded-lg bg-[#0A286E] text-sm font-semibold text-white">
        {t('apply')}
      </button>
      <a href={clear} className="text-center text-sm font-medium text-[#0A286E] underline">
        {t('clear')}
      </a>
    </form>
  );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm text-[#374151]">{t('count', { count: total })}</p>
        <button type="button" className="h-10 rounded-lg border border-[#E6E8EC] bg-white px-4 text-sm font-medium lg:hidden" onClick={() => setOpen(true)}>
          {t('open')}
        </button>
      </div>
      <div className="hidden rounded-xl border border-[#ECEEF2] bg-white p-4 lg:block">{form}</div>
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden" role="dialog" aria-modal="true" aria-label={t('open')}>
          <div className="flex items-center justify-between border-b border-[#E4E7EB] px-4 py-3">
            <p className="font-semibold">{t('open')}</p>
            <button type="button" className="h-11 px-3" onClick={() => setOpen(false)}>
              {t('close')}
            </button>
          </div>
          <div className="overflow-auto px-4 py-4">{form}</div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  value,
  options,
  anyLabel,
}: {
  label: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
  anyLabel: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-[#1C1F24]">{label}</span>
      <select name={name} defaultValue={value} className="h-10 w-full rounded-lg border border-[#E6E8EC] bg-[#F7F8FA] px-2">
        <option value="">{anyLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
