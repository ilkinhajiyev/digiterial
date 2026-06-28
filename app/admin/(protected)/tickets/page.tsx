import { createClient } from '@/lib/supabase/server';
import GenericTable from '@/components/admin/generic-table';
export default async function Page() {
  const sb = await createClient();
  const { data } = await sb.from('tickets').select('*').order('created_at', { ascending: false });
  return <GenericTable table="tickets" title="Dəstək / Tiketlər" rows={data || []} revalidate="/admin/tickets"
    columns={[{ key: 'subject', label: 'Mövzu' }, { key: 'priority', label: 'Prioritet', format: 'badge' }, { key: 'status', label: 'Status', format: 'badge' }]}
    fields={[{ name: 'subject', label: 'Mövzu', required: true, full: true }, { name: 'priority', label: 'Prioritet', type: 'select', options: ['low', 'medium', 'high', 'urgent'] }, { name: 'status', label: 'Status', type: 'select', options: ['open', 'in_progress', 'resolved', 'closed'] }]} />;
}
