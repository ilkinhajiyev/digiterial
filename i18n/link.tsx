import NextLink from 'next/link';
import { useLocale } from 'next-intl';
import { localePath } from '@/lib/seo';

// next-intl 3.x Link "as-needed" rejimində serverdə default dil üçün də /az prefiksi yazır
// (/az/isler → 307 → /isler). Daxili linklər birbaşa son ünvana getsin deyə yolu özümüz qururuq.
type Props = Omit<React.ComponentProps<typeof NextLink>, 'href' | 'locale'> & { href: string; locale?: string };

export default function Link({ href, locale, ...rest }: Props) {
  const current = useLocale();
  const target = locale || current;
  const external = /^(https?:|mailto:|tel:|#)/.test(href);
  const [path, hash = ''] = href.split('#');
  const to = external ? href : localePath(path || '/', target) + (hash ? `#${hash}` : '');
  // Dil dəyişəndə tam yükləmə: <html lang> və client lüğəti yenilənsin
  return <NextLink href={to} prefetch={locale && locale !== current ? false : undefined} hrefLang={locale} {...rest} />;
}
