import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import CrudTable from '@/components/admin/crud-table';
import { upsertTicket, destroyTicket } from '@/lib/actions/admin';

export default async function Page() {
  await (await createClient()).auth.getUser(); // auth yoxla
  const svc = createServiceClient();
  const { data } = await svc.from('tickets').select('*').order('created_at', { ascending: false });
  return (
    <CrudTable
      title="Dəstək / Tiketlər" rows={data ?? []}
      upsert={upsertTicket} destroy={destroyTicket}
      cols={[
        { key: 'subject', label: 'Mövzu' },
        { key: 'priority', label: 'Prioritet', fmt: 'badge' },
        { key: 'status', label: 'Status', fmt: 'badge' },
      ]}
      fields={[
        { name: 'subject', label: 'Mövzu', required: true, span2: true },
        { name: 'priority', label: 'Prioritet', type: 'select', options: ['low', 'medium', 'high', 'urgent'] },
        { name: 'status', label: 'Status', type: 'select', options: ['open', 'in_progress', 'resolved', 'closed'] },
      ]}
    />
  );
}
