import { createClient } from '@/lib/supabase/server';
import GenericTable from '@/components/admin/generic-table';
export default async function Page() {
  const sb = await createClient();
  const { data } = await sb.from('profiles').select('*').order('created_at', { ascending: false });
  return (<>
    <GenericTable table="profiles" title="Komanda" subtitle="İstifadəçilər Supabase Authentication-dan yaradılır" rows={data || []} revalidate="/admin/team" readOnly
      columns={[{ key: 'full_name', label: 'Ad' }, { key: 'role', label: 'Rol', format: 'badge' }, { key: 'created_at', label: 'Qoşulma' }]}
      fields={[]} />
  </>);
}
