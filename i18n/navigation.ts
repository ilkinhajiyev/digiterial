import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales, localePrefix } from './routing';
export { default as Link } from './link';
export const { redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix });
