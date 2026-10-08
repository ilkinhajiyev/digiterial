import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isLogin = request.nextUrl.pathname.startsWith('/admin/login');
  if (!url || !anon) {
    return isLogin ? response : NextResponse.redirect(new URL('/admin/login', request.url));
  }
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(list) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  // Müdafiə qatı: daxil olmayan istifadəçi admin səhifələrinə ümumiyyətlə çatmır
  if (!user && !isLogin) {
    const to = new URL('/admin/login', request.url);
    return NextResponse.redirect(to);
  }
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}
