import { createClient as createSb } from '@supabase/supabase-js';
import { createClient as createSessionClient } from './server';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase/config';

const URL = () => SUPABASE_URL;
const SERVICE = () => process.env.SUPABASE_SERVICE_ROLE_KEY;

// Saytın açıq məlumatları (ayarlar, portfolio, müraciət formu).
// Service key varsa onunla, yoxdursa anon açarla işləyir: RLS ictimai oxumağa və müraciət yazmağa icazə verir.
export function createServiceClient() {
  const url = URL();
  const key = SERVICE() || SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing');
  return createSb(url, key, { auth: { persistSession: false } });
}

// Admin panel: service key varsa onunla, yoxdursa daxil olmuş işçinin sessiyası ilə.
// Sessiya rejimində icazələri RLS yoxlayır (staff_all_* qaydaları).
export async function createStaffClient() {
  const url = URL();
  const key = SERVICE();
  if (url && key) return createSb(url, key, { auth: { persistSession: false } });
  return createSessionClient();
}
