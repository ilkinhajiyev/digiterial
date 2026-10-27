import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

// Admin server action-larının qoruyucusu. Server action-lar açıq HTTP endpoint-dir:
// layout-dakı yönləndirmə onları qorumur, ona görə hər əməliyyat əvvəl bunu çağırır.
// Yalnız giriş etmiş işçi (admin / manager / specialist) keçir; "client" rolu və qonaq rədd edilir.
export async function requireStaff() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Giriş tələb olunur.');
  const { data } = await createServiceClient().from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (!data || !['admin', 'manager', 'specialist'].includes(data.role)) throw new Error('Bu əməliyyat üçün icazəniz yoxdur.');
  return user;
}
