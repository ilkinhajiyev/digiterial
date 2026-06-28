import { createClient } from '@/lib/supabase/server';
import GenericTable from '@/components/admin/generic-table';
export default async function Page() {
  const sb = await createClient();
  const { data } = await sb.from('content_posts').select('*').order('created_at', { ascending: false });
  return <GenericTable table="content_posts" title="Kontent / Bloq" rows={data || []} revalidate="/admin/content"
    columns={[{ key: 'title', label: 'Başlıq' }, { key: 'slug', label: 'Slug' }, { key: 'keyword', label: 'Açar söz' }, { key: 'seo_score', label: 'SEO bal' }, { key: 'status', label: 'Status', format: 'badge' }]}
    fields={[{ name: 'title', label: 'Başlıq', required: true, full: true }, { name: 'slug', label: 'Slug' }, { name: 'keyword', label: 'Açar söz' }, { name: 'seo_score', label: 'SEO bal', type: 'number' }, { name: 'status', label: 'Status', type: 'select', options: ['draft', 'scheduled', 'published'] }, { name: 'excerpt', label: 'Qısa təsvir', type: 'textarea' }]} />;
}
