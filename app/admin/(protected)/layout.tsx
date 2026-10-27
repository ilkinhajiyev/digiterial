import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { NextIntlClientProvider } from 'next-intl';
import AdminShell, { type ShellCounts, type ShellUser } from '@/components/admin/shell';

async function headCount(q: PromiseLike<{ count: number | null }>) {
  try { return (await q).count ?? 0; } catch { return 0; }
}

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  let user: ShellUser | null = null;
  try {
    const sb = await createClient();
    const { data: { user: u } } = await sb.auth.getUser();
    if (u) {
      const { data: p } = await createServiceClient().from('profiles').select('full_name,role').eq('id', u.id).maybeSingle();
      user = { name: p?.full_name || u.email?.split('@')[0] || 'İstifadəçi', email: u.email || '', role: p?.role || 'specialist' };
    }
  } catch { /* aşağıda yönləndirilir */ }
  if (!user) redirect('/admin/login');

  const svc = createServiceClient();
  const counts: ShellCounts = {
    leads: await headCount(svc.from('leads').select('id', { count: 'exact', head: true }).eq('stage', 'new')),
    tickets: await headCount(svc.from('tickets').select('id', { count: 'exact', head: true }).in('status', ['open', 'in_progress'])),
    tasks: await headCount(svc.from('tasks').select('id', { count: 'exact', head: true }).eq('status', 'review')),
  };

  return (
    <NextIntlClientProvider messages={{}}>
      <AdminShell user={user} counts={counts}>{children}</AdminShell>
    </NextIntlClientProvider>
  );
}
