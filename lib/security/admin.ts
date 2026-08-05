import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

const ADMIN_ROLES = new Set(['admin', 'manager']);

export async function requireAdmin() {
  const sb = await createClient();
  const { data: { user }, error: userError } = await sb.auth.getUser();
  if (userError || !user) throw new Error('UNAUTHORIZED');

  const { data: profile, error: profileError } = await sb
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile || !ADMIN_ROLES.has(profile.role)) {
    throw new Error('FORBIDDEN');
  }

  return { user, role: profile.role as 'admin' | 'manager' };
}

export async function createAdminServiceClient() {
  await requireAdmin();
  return createServiceClient();
}
