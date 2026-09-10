'use server';
import { createClient } from '@/lib/supabase/server';

export async function signIn(formData: FormData) {
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
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
