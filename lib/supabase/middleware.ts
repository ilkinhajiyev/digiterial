import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase/config';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  try {
    const supabase = createServerClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(list) {
            list.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          },
        },
      },
    );
    // Network / paused project must not crash middleware (AuthRetryableFetchError → fetch failed).
    await supabase.auth.getUser();
  } catch {
    /* Supabase unreachable: pass through without session refresh */
  }
  return response;
}
