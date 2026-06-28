import { createClient } from '@/lib/supabase/server';
import CrudTable from '@/components/admin/crud-table';
import { upsertDomain, destroyDomain } from '@/lib/actions/admin';

export default async function Page() {
  const sb = await createClient();
  const { data } = await sb.from('domains').select('*').order('created_at', { ascending: false });
  return (
    <CrudTable
      title="Hostinq / Domenlər" rows={data ?? []}
      upsert={upsertDomain} destroy={destroyDomain}
      cols={[
        { key: 'domain', label: 'Domen' },
        { key: 'ssl_active', label: 'SSL', fmt: 'bool' },
        { key: 'expires_at', label: 'Bitmə tarixi' },
      ]}
      fields={[
        { name: 'domain', label: 'Domen', required: true, span2: true, placeholder: 'example.az' },
        { name: 'ssl_active', label: 'SSL aktiv', type: 'checkbox' },
        { name: 'expires_at', label: 'Bitmə tarixi', type: 'date' },
      ]}
    />
  );
}
