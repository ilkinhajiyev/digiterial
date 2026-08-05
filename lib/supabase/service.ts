import 'server-only';
import { createClient as createSb } from '@supabase/supabase-js';

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase env vars missing');
  }

  return createSb(url, key, {
    auth: { persistSession: false },
  });
}

export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase public env vars missing');
  return createSb(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
