import { createClient } from '@/lib/supabase/server';
import CrudTable from '@/components/admin/crud-table';
import { upsertKeyword, destroyKeyword } from '@/lib/actions/admin';

export default async function Page() {
  const sb = await createClient();
  const { data } = await sb.from('keywords').select('*').order('position', { ascending: true });
  return (
    <CrudTable
      title="SEO — Açar sözlər" rows={data ?? []}
      upsert={upsertKeyword} destroy={destroyKeyword}
      cols={[
        { key: 'keyword', label: 'Açar söz' },
        { key: 'position', label: 'Mövqe' },
        { key: 'volume', label: 'Həcm' },
        { key: 'difficulty', label: 'Çətinlik', fmt: 'badge' },
      ]}
      fields={[
        { name: 'keyword', label: 'Açar söz', required: true, span2: true },
        { name: 'position', label: 'Mövqe', type: 'number' },
        { name: 'volume', label: 'Aylıq həcm', type: 'number' },
        { name: 'difficulty', label: 'Çətinlik', type: 'select', options: ['low', 'medium', 'high'] },
      ]}
    />
  );
}
