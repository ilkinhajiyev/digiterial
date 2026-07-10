export const locales = ['az', 'en', 'ru', 'de'] as const;
export const defaultLocale = 'az';
export const localePrefix = 'as-needed' as const;
export type Locale = (typeof locales)[number];
