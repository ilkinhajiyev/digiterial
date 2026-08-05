'use server';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { z } from 'zod';
import { checkRateLimit, requestIp } from '@/lib/security/rate-limit';

const credentialsSchema = z.object({ email: z.string().trim().toLowerCase().email().max(254), password: z.string().min(8).max(256) });

export async function signIn(formData: FormData) {
  const parsed = credentialsSchema.safeParse({ email: String(formData.get('email') || ''), password: String(formData.get('password') || '') });
  if (!parsed.success) return { error: 'Email və ya şifrə yanlışdır.' };
  const ip = requestIp(await headers());
  if (!checkRateLimit(`login:${ip}:${parsed.data.email}`, 5, 15 * 60 * 1000)) return { error: 'Çox sayda giriş cəhdi edilib. 15 dəqiqə sonra yenidən cəhd edin.' };
  const sb = await createClient();
  const { data, error } = await sb.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return { error: 'Email və ya şifrə yanlışdır.' };
  const { data: profile } = await sb.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
  if (!profile || !['admin', 'manager'].includes(profile.role)) {
    await sb.auth.signOut();
    return { error: 'Bu hesabın admin panelinə giriş icazəsi yoxdur.' };
  }
  return { ok: true };
}
export async function signOut() {
  const sb = await createClient();
  await sb.auth.signOut();
  return { ok: true };
}
