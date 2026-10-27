import { useLocale } from 'next-intl';
import en from './dict/en.json';
import ru from './dict/ru.json';
import de from './dict/de.json';
import clientKeys from './client-keys.json';
import { translate, localizeWith, type Dict, type T } from './core';

const DICTS: Record<string, Dict> = { en, ru, de };

export const getT = (locale: string): T => (s, vars) => translate(DICTS[locale], s, vars);
export const localize = <V,>(v: V, locale: string): V => localizeWith(DICTS[locale], v);

// Brauzerə yalnız client komponentlərin mətnləri göndərilir
export function clientDict(locale: string): Dict {
  const d = DICTS[locale];
  if (!d) return {};
  const out: Dict = {};
  for (const k of clientKeys as string[]) if (d[k]) out[k] = d[k];
  return out;
}

// SEO: Open Graph locale kodları
export const OG_LOCALE: Record<string, string> = { az: 'az_AZ', en: 'en_US', ru: 'ru_RU', de: 'de_DE' };

// Sinxron server komponentləri üçün (next-intl useLocale RSC-də işləyir)
export function useServerT(): T {
  return getT(useLocale());
}
export function useLocalize() {
  const locale = useLocale();
  return <V,>(v: V): V => localize(v, locale);
}
