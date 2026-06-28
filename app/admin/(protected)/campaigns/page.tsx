import { createClient } from '@/lib/supabase/server';
import GenericTable from '@/components/admin/generic-table';
export default async function Page() {
  const sb = await createClient();
  const { data } = await sb.from('campaigns').select('*').order('created_at', { ascending: false });
  return <GenericTable table="campaigns" title="Kampaniyalar" rows={data || []} revalidate="/admin/campaigns"
    columns={[{ key: 'name', label: 'Kampaniya' }, { key: 'channel', label: 'Kanal', format: 'badge' }, { key: 'spend', label: 'Xərc', format: 'money' }, { key: 'conversions', label: 'Konversiya' }, { key: 'roas', label: 'ROAS' }, { key: 'status', label: 'Status', format: 'badge' }]}
    fields={[{ name: 'name', label: 'Ad', required: true, full: true }, { name: 'channel', label: 'Kanal', type: 'select', options: ['google', 'meta', 'tiktok', 'other'] }, { name: 'spend', label: 'Xərc (₼)', type: 'number' }, { name: 'conversions', label: 'Konversiya', type: 'number' }, { name: 'roas', label: 'ROAS', type: 'number' }, { name: 'status', label: 'Status' }]} />;
}
