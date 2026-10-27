import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import Dashboard, { type DashData } from '@/components/admin/dashboard';

async function rows<T>(q: PromiseLike<{ data: T[] | null }>): Promise<T[]> {
  try { return (await q).data ?? []; } catch { return []; }
}

export default async function Page() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  const svc = createServiceClient();
  const [profile, leads, projects, tasks, invoices, tickets, clients] = await Promise.all([
    user ? svc.from('profiles').select('full_name').eq('id', user.id).maybeSingle().then((r) => r.data) : null,
    rows<DashData['leads'][number]>(svc.from('leads').select('id,name,company,service,value,stage,source,created_at').order('created_at', { ascending: false }).limit(500)),
    rows<DashData['projects'][number]>(svc.from('projects').select('id,name,status,progress,due_date,type').order('due_date', { ascending: true })),
    rows<DashData['tasks'][number]>(svc.from('tasks').select('id,title,status,due_date,area')),
    rows<DashData['invoices'][number]>(svc.from('invoices').select('id,number,amount,status,issue_date,due_date').order('due_date', { ascending: true })),
    svc.from('tickets').select('id', { count: 'exact', head: true }).in('status', ['open', 'in_progress']).then((r) => r.count ?? 0, () => 0),
    svc.from('clients').select('id', { count: 'exact', head: true }).eq('status', 'active').then((r) => r.count ?? 0, () => 0),
  ]);
  const d: DashData = {
    userName: profile?.full_name || user?.email?.split('@')[0] || 'komanda',
    leads, projects, tasks, invoices, openTickets: tickets, activeClients: clients,
  };
  return <Dashboard d={d} />;
}
