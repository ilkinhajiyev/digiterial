import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, localePrefix } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';

// localeDetection: false — kök ünvan həmişə azərbaycanca açılır (brauzer dilinə görə yönləndirmə yoxdur)
const intl = createMiddleware({ locales, defaultLocale, localePrefix, localeDetection: false });

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin: yalnız session yenilə, i18n-i keç
  if (pathname.startsWith('/admin')) {
    return await updateSession(request);
  }

  // Sayt: i18n middleware
  return intl(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
