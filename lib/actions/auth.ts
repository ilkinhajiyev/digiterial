'use server';
import { createClient } from '@/lib/supabase/server';

export async function signIn(formData: FormData) {
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { error: 'Supabase qoşulmayıb: .env.local faylına NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY və SUPABASE_SERVICE_ROLE_KEY yazın.' };
  }
  const sb = await createClient();
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { ok: true };
}
export async function signOut() {
  const sb = await createClient();
  await sb.auth.signOut();
  return { ok: true };
}
