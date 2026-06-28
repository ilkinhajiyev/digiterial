import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';
import { locales, defaultLocale, localePrefix } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';

const intl = createMiddleware({ locales, defaultLocale, localePrefix });

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return await updateSession(request); // auth guard admin/layout-da
  }
  return intl(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
