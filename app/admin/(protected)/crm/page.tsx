import { createClient } from '@/lib/supabase/server';
import LeadsTable from '@/components/admin/leads-table';
export default async function CrmPage() {
  const sb = await createClient();
  const { data } = await sb.from('leads').select('*').order('created_at', { ascending: false });
  return <LeadsTable rows={(data as any) || []} />;
}
