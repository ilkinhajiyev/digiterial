import { createClient } from '@/lib/supabase/server';
import CrudTable from '@/components/admin/crud-table';

// Komanda üzvləri Supabase Auth-dan yaradılır — yalnız oxu
export default async function Page() {
  const sb = await createClient();
  const { data } = await sb.from('profiles').select('*').order('created_at', { ascending: false });
  return (
    <CrudTable
      title="Komanda"
      subtitle="İstifadəçilər Supabase Authentication-dan yaradılır"
      rows={data ?? []}
      cols={[
        { key: 'full_name', label: 'Ad' },
        { key: 'role', label: 'Rol', fmt: 'badge' },
        { key: 'created_at', label: 'Qoşulma tarixi' },
      ]}
      fields={[]}
      upsert={async () => ({ ok: false })}
      destroy={async () => ({ ok: false })}
      readOnly
    />
  );
}
