import { createClient } from '@/lib/supabase/server';
import CrudTable from '@/components/admin/crud-table';
import { upsertClient, destroyClient } from '@/lib/actions/admin';

export default async function Page() {
  const sb = await createClient();
  const { data } = await sb.from('clients').select('*').order('created_at', { ascending: false });
  return (
    <CrudTable
      title="Müştərilər" rows={data ?? []}
      upsert={upsertClient} destroy={destroyClient}
      cols={[
        { key: 'name', label: 'Ad' },
        { key: 'industry', label: 'Sahə' },
        { key: 'status', label: 'Status', fmt: 'badge' },
        { key: 'contact_email', label: 'Email' },
        { key: 'contact_phone', label: 'Telefon' },
      ]}
      fields={[
        { name: 'name', label: 'Ad', required: true, span2: true },
        { name: 'industry', label: 'Sahə', placeholder: 'Restoran, IT...' },
        { name: 'status', label: 'Status', type: 'select', options: ['active', 'negotiation', 'paused', 'archived'] },
        { name: 'website', label: 'Website', placeholder: 'https://' },
        { name: 'contact_email', label: 'Email', placeholder: 'info@...' },
        { name: 'contact_phone', label: 'Telefon', placeholder: '+994...' },
      ]}
    />
  );
}
