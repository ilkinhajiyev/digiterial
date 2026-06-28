import { createClient } from '@/lib/supabase/server';
import CrudTable from '@/components/admin/crud-table';
import { upsertCampaign, destroyCampaign } from '@/lib/actions/admin';

export default async function Page() {
  const sb = await createClient();
  const { data } = await sb.from('campaigns').select('*').order('created_at', { ascending: false });
  return (
    <CrudTable
      title="Kampaniyalar" rows={data ?? []}
      upsert={upsertCampaign} destroy={destroyCampaign}
      cols={[
        { key: 'name', label: 'Kampaniya' },
        { key: 'channel', label: 'Kanal', fmt: 'badge' },
        { key: 'spend', label: 'Xərc', fmt: 'money' },
        { key: 'conversions', label: 'Konv.' },
        { key: 'roas', label: 'ROAS' },
        { key: 'status', label: 'Status', fmt: 'badge' },
      ]}
      fields={[
        { name: 'name', label: 'Ad', required: true, span2: true },
        { name: 'channel', label: 'Kanal', type: 'select', options: ['google', 'meta', 'tiktok', 'other'] },
        { name: 'status', label: 'Status', type: 'select', options: ['active', 'paused', 'completed'] },
        { name: 'spend', label: 'Xərc (₼)', type: 'number' },
        { name: 'conversions', label: 'Konversiya', type: 'number' },
        { name: 'roas', label: 'ROAS', type: 'number' },
      ]}
    />
  );
}
