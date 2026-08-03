import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import CrudTable from '@/components/admin/crud-table';
import { upsertProject, destroyProject } from '@/lib/actions/admin';

export default async function Page() {
  await (await createClient()).auth.getUser(); // auth yoxla
  const svc = createServiceClient();
  const { data } = await svc.from('projects').select('*').order('created_at', { ascending: false });
  return (
    <CrudTable
      title="Layihələr" rows={data ?? []}
      upsert={upsertProject} destroy={destroyProject}
      cols={[
        { key: 'name', label: 'Layihə' },
        { key: 'type', label: 'Növ' },
        { key: 'progress', label: '%' },
        { key: 'status', label: 'Status', fmt: 'badge' },
        { key: 'due_date', label: 'Son tarix' },
        { key: 'budget', label: 'Büdcə', fmt: 'money' },
      ]}
      fields={[
        { name: 'name', label: 'Layihə adı', required: true, span2: true },
        { name: 'type', label: 'Növ', placeholder: 'Veb, SEO, SMM...' },
        { name: 'status', label: 'Status', type: 'select', options: ['planning', 'in_progress', 'review', 'on_hold', 'completed', 'cancelled'] },
        { name: 'progress', label: 'İrəliləyiş (%)', type: 'number' },
        { name: 'budget', label: 'Büdcə (₼)', type: 'number' },
        { name: 'due_date', label: 'Son tarix', type: 'date' },
      ]}
    />
  );
}
