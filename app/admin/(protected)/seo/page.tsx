import { createClient } from '@/lib/supabase/server';
import GenericTable from '@/components/admin/generic-table';
export default async function Page() {
  const sb = await createClient();
  const { data } = await sb.from('keywords').select('*').order('position', { ascending: true });
  return <GenericTable table="keywords" title="SEO — Açar sözlər" subtitle="İzlənən açar sözlər və mövqelər" rows={data || []} revalidate="/admin/seo"
    columns={[{ key: 'keyword', label: 'Açar söz' }, { key: 'position', label: 'Mövqe' }, { key: 'volume', label: 'Həcm' }, { key: 'difficulty', label: 'Çətinlik', format: 'badge' }]}
    fields={[{ name: 'keyword', label: 'Açar söz', required: true, full: true }, { name: 'position', label: 'Mövqe', type: 'number' }, { name: 'volume', label: 'Aylıq həcm', type: 'number' }, { name: 'difficulty', label: 'Çətinlik' }]} />;
}
