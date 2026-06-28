import { createClient } from '@/lib/supabase/server';
import CrudTable from '@/components/admin/crud-table';
import { upsertTask, destroyTask } from '@/lib/actions/admin';

export default async function Page() {
  const sb = await createClient();
  const { data } = await sb.from('tasks').select('*').order('created_at', { ascending: false });
  return (
    <CrudTable
      title="Tapşırıqlar" rows={data ?? []}
      upsert={upsertTask} destroy={destroyTask}
      cols={[
        { key: 'title', label: 'Tapşırıq' },
        { key: 'area', label: 'Sahə' },
        { key: 'status', label: 'Status', fmt: 'badge' },
        { key: 'due_date', label: 'Son tarix' },
      ]}
      fields={[
        { name: 'title', label: 'Başlıq', required: true, span2: true },
        { name: 'area', label: 'Sahə', placeholder: 'Dizayn, Dev, SEO...' },
        { name: 'status', label: 'Status', type: 'select', options: ['backlog', 'in_progress', 'review', 'done'] },
        { name: 'due_date', label: 'Son tarix', type: 'date' },
      ]}
    />
  );
}
