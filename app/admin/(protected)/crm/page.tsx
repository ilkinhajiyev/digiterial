import { createServiceClient } from '@/lib/supabase/service';
import { LeadsBoard } from '@/components/admin/crm-board';

export default async function Page() {
  let rows: any[] = [];
  try {
    const { data } = await createServiceClient().from('leads').select('*').order('created_at', { ascending: false });
    rows = data ?? [];
  } catch { rows = []; }
  return <LeadsBoard rows={rows} />;
}
