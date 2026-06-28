import { createClient } from '@/lib/supabase/server';
import CrudTable from '@/components/admin/crud-table';
import { upsertContent, destroyContent } from '@/lib/actions/admin';

export default async function Page() {
  const sb = await createClient();
  const { data } = await sb.from('content_posts').select('*').order('created_at', { ascending: false });
  return (
    <CrudTable
      title="Kontent / Bloq" rows={data ?? []}
      upsert={upsertContent} destroy={destroyContent}
      cols={[
        { key: 'title', label: 'Başlıq' },
        { key: 'slug', label: 'Slug' },
        { key: 'keyword', label: 'Açar söz' },
        { key: 'seo_score', label: 'SEO' },
        { key: 'status', label: 'Status', fmt: 'badge' },
      ]}
      fields={[
        { name: 'title', label: 'Başlıq', required: true, span2: true },
        { name: 'slug', label: 'Slug', placeholder: 'seo-meqale-2026' },
        { name: 'keyword', label: 'Hədəf açar söz' },
        { name: 'seo_score', label: 'SEO bal', type: 'number' },
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'scheduled', 'published'] },
        { name: 'excerpt', label: 'Qısa təsvir', type: 'textarea', span2: true },
      ]}
    />
  );
}
