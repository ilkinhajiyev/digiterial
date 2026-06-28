import { createClient } from '@/lib/supabase/server';
import GenericTable from '@/components/admin/generic-table';
export default async function Page() {
  const sb = await createClient();
  const { data } = await sb.from('tasks').select('*').order('created_at', { ascending: false });
  return <GenericTable table="tasks" title="Tapşırıqlar" rows={data || []} revalidate="/admin/tasks"
    columns={[{ key: 'title', label: 'Tapşırıq' }, { key: 'area', label: 'Sahə' }, { key: 'status', label: 'Status', format: 'badge' }, { key: 'due_date', label: 'Son tarix' }]}
    fields={[{ name: 'title', label: 'Başlıq', required: true, full: true }, { name: 'area', label: 'Sahə' }, { name: 'status', label: 'Status', type: 'select', options: ['backlog', 'in_progress', 'review', 'done'] }, { name: 'due_date', label: 'Son tarix', type: 'date' }]} />;
}
