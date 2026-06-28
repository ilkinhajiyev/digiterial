import { createClient } from '@/lib/supabase/server';
import CrudTable from '@/components/admin/crud-table';
import { upsertLead, destroyLead } from '@/lib/actions/admin';

export default async function Page() {
  const sb = await createClient();
  const { data } = await sb.from('leads').select('*').order('created_at', { ascending: false });
  return (
    <CrudTable
      title="CRM / Lead-lər" rows={data ?? []}
      upsert={upsertLead} destroy={destroyLead}
      cols={[
        { key: 'name', label: 'Ad' },
        { key: 'company', label: 'Şirkət' },
        { key: 'service', label: 'Xidmət' },
        { key: 'value', label: 'Dəyər', fmt: 'money' },
        { key: 'stage', label: 'Mərhələ', fmt: 'badge' },
        { key: 'source', label: 'Mənbə', fmt: 'badge' },
      ]}
      fields={[
        { name: 'name', label: 'Ad Soyad', required: true, span2: true },
        { name: 'company', label: 'Şirkət' },
        { name: 'service', label: 'Xidmət' },
        { name: 'value', label: 'Dəyər (₼)', type: 'number' },
        { name: 'stage', label: 'Mərhələ', type: 'select', options: ['new', 'contacted', 'proposal', 'negotiation', 'won', 'lost'] },
        { name: 'source', label: 'Mənbə', type: 'select', options: ['organic', 'paid', 'social', 'referral', 'direct'] },
      ]}
    />
  );
}
