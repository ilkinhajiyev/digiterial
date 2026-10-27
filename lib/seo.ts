import { locales, defaultLocale } from '@/i18n/routing';

// canonical + hreflang (localePrefix: 'as-needed' → az prefikssizdir)
export function localePath(path: string, locale: string) {
  const p = path === '/' ? '' : path;
  return locale === defaultLocale ? p || '/' : `/${locale}${p}`;
}

export function alternates(path: string, locale: string) {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = localePath(path, l);
  languages['x-default'] = localePath(path, defaultLocale);
  return { canonical: localePath(path, locale), languages };
}
