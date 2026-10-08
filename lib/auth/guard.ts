import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

export const STAFF_ROLES = ['admin', 'manager', 'specialist'] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export class AuthError extends Error {
  constructor(message = 'İcazə yoxdur. Yenidən daxil olun.') { super(message); this.name = 'AuthError'; }
}

/**
 * Cari istifadəçini və rolunu qaytarır. Daxil olmayıbsa və ya
 * profil tapılmırsa null qaytarır.
 */
export async function getStaff(): Promise<{ id: string; email?: string; role: StaffRole } | null> {
  try {
    const sb = await createClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return null;
    const svc = createServiceClient();
    const { data } = await svc.from('profiles').select('role').eq('id', user.id).maybeSingle();
    const role = data?.role as StaffRole | undefined;
    if (!role || !STAFF_ROLES.includes(role)) return null;
    return { id: user.id, email: user.email, role };
  } catch {
    return null;
  }
}

/**
 * Server action-ların başında çağırılır. Server action-lar ictimai HTTP
 * endpoint-lərdir — layout yoxlaması onları qorumur.
 */
export async function requireStaff(roles: readonly StaffRole[] = STAFF_ROLES) {
  const staff = await getStaff();
  if (!staff || !roles.includes(staff.role)) throw new AuthError();
  return staff;
}
