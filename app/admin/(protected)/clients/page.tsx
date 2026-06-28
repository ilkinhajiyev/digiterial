import { createClient } from '@/lib/supabase/server';
import ClientsTable from '@/components/admin/clients-table';
export default async function ClientsPage() {
  const sb = await createClient();
  const { data } = await sb.from('clients').select('*').order('created_at', { ascending: false });
  return <ClientsTable rows={(data as any) || []} />;
}
