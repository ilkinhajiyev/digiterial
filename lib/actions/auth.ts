'use server';
import { createClient } from '@/lib/supabase/server';

function humanAuthError(msg: string) {
  if (/fetch failed|Failed to fetch|AuthRetryableFetchError|network|ENOTFOUND|ECONN|ETIMEDOUT/i.test(msg)) {
    return 'Supabase-ə qoşulmaq olmadı (fetch failed). Layihə URL-i DNS-də tapılmır və ya serverdən əlçatan deyil. Hostinger env-də düzgün NEXT_PUBLIC_SUPABASE_URL + ANON_KEY (və admin üçün SERVICE_ROLE) qoyun.';
  }
  return msg;
}

export async function signIn(formData: FormData) {
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  try {
    const sb = await createClient();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return { error: humanAuthError(error.message) };
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'fetch failed';
    return { error: humanAuthError(msg) };
  }
}
export async function signOut() {
  const sb = await createClient();
  await sb.auth.signOut();
  return { ok: true };
}
