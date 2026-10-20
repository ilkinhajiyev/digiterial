'use server';
import { createClient } from '@/lib/supabase/server';

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') || '').trim().slice(0, 200);
  const password = String(formData.get('password') || '').slice(0, 200);
  if (!email || !password) return { error: 'Email və şifrəni daxil edin.' };
  const sb = await createClient();
  const { error } = await sb.auth.signInWithPassword({ email, password });
  // Ümumi mesaj — hansı hissənin səhv olduğunu açıqlamırıq
  if (error) return { error: 'Email və ya şifrə yanlışdır.' };
  return { ok: true };
}
export async function signOut() {
  const sb = await createClient();
  await sb.auth.signOut();
  return { ok: true };
}
