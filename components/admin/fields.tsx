import type { L10n } from '@/lib/catalog/types';

export function Trio({ name, value, label, area = false }: { name: string; value: L10n; label: string; area?: boolean }) {
  return (
    <fieldset className="grid gap-2">
      <legend className="text-sm font-medium">{label}</legend>
      {(['az', 'en', 'ru'] as const).map((locale) => (
        <label key={locale} className="block text-xs uppercase text-[#6B7280]">
          {locale}
          {area ? (
            <textarea name={`${name}_${locale}`} defaultValue={value[locale] || ''} rows={4} className="mt-1 w-full rounded-lg border border-[#D5DAE1] px-2 py-2 text-sm normal-case text-[#1C1F24]" />
          ) : (
            <input name={`${name}_${locale}`} defaultValue={value[locale] || ''} className="mt-1 h-11 w-full rounded-lg border border-[#D5DAE1] px-2 text-sm normal-case text-[#1C1F24]" />
          )}
        </label>
      ))}
    </fieldset>
  );
}
