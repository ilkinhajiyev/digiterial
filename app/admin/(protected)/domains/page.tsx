import { createClient } from '@/lib/supabase/server';
import GenericTable from '@/components/admin/generic-table';
export default async function Page() {
  const sb = await createClient();
  const { data } = await sb.from('domains').select('*').order('created_at', { ascending: false });
  return <GenericTable table="domains" title="Hostinq / Domenlər" rows={data || []} revalidate="/admin/domains"
    columns={[{ key: 'domain', label: 'Domen' }, { key: 'ssl_active', label: 'SSL', format: 'bool' }, { key: 'expires_at', label: 'Bitmə tarixi' }]}
    fields={[{ name: 'domain', label: 'Domen', required: true, full: true }, { name: 'ssl_active', label: 'SSL aktiv', type: 'checkbox' }, { name: 'expires_at', label: 'Bitmə tarixi', type: 'date' }]} />;
}
