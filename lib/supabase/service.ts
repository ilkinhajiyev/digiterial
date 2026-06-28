import { createClient as createSb } from '@supabase/supabase-js';
// Public sayt üçün RLS-i keçən server-only client (yalnız published kontent oxuyur)
export function createServiceClient() {
  return createSb(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
