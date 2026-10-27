import { createServiceClient } from '@/lib/supabase/service';
import { TasksBoard } from '@/components/admin/crm-board';

export default async function Page() {
  let rows: any[] = [];
  try {
    const { data } = await createServiceClient().from('tasks').select('*').order('due_date', { ascending: true, nullsFirst: false });
    rows = data ?? [];
  } catch { rows = []; }
  return <TasksBoard rows={rows} />;
}
