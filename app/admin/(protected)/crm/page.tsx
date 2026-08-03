import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import CrudTable from '@/components/admin/crud-table';
import { upsertLead, destroyLead } from '@/lib/actions/admin';

export default async function Page() {
  // Auth yoxla
  const sb = await createClient();
  await sb.auth.getUser();

  // Leads-i service client ilə oxu (RLS bypass — admin paneldə güvənlidir)
  let rows: any[] = [];
  try {
    const svc = createServiceClient();
    const { data } = await svc
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    rows = data ?? [];
  } catch { rows = []; }

  return (
    <CrudTable
      title="CRM / Lead-lər" rows={rows}
      upsert={upsertLead} destroy={destroyLead}
      cols={[
        { key: 'name',    label: 'Ad' },
        { key: 'company', label: 'Şirkət' },
        { key: 'service', label: 'Xidmət' },
        { key: 'message', label: 'Mesaj' },
        { key: 'value',   label: 'Dəyər', fmt: 'money' },
        { key: 'stage',   label: 'Mərhələ', fmt: 'badge' },
        { key: 'source',  label: 'Mənbə', fmt: 'badge' },
      ]}
      fields={[
        { name: 'name',    label: 'Ad Soyad', required: true, span2: true },
        { name: 'company', label: 'Şirkət' },
        { name: 'service', label: 'Xidmət' },
        { name: 'value',   label: 'Dəyər (₼)', type: 'number' },
        { name: 'stage',   label: 'Mərhələ', type: 'select', options: ['new','contacted','proposal','negotiation','won','lost'] },
        { name: 'source',  label: 'Mənbə', type: 'select', options: ['organic','paid','social','referral','direct'] },
      ]}
    />
  );
}
