import { requireStaff } from '@/lib/auth/guard';
import { createServiceClient } from '@/lib/supabase/service';
import CrudTable from '@/components/admin/crud-table';
import { upsertContent, destroyContent } from '@/lib/actions/admin';

export const dynamic = 'force-dynamic';

export default async function Page() {
  await requireStaff();
  const { data } = await createServiceClient().from('content_posts').select('*').order('created_at', { ascending: false });
  return (
    <CrudTable
      title="Kontent / Bloq" subtitle="“published” statuslu yazılar saytda /bloq bölməsində görünür"
      rows={data ?? []}
      upsert={upsertContent} destroy={destroyContent}
      cols={[
        { key: 'title', label: 'Başlıq' },
        { key: 'locale', label: 'Dil', fmt: 'badge' },
        { key: 'slug', label: 'Slug' },
        { key: 'keyword', label: 'Açar söz' },
        { key: 'status', label: 'Status', fmt: 'badge' },
      ]}
      fields={[
        { name: 'title', label: 'Başlıq', required: true, span2: true },
        { name: 'locale', label: 'Dil', type: 'select', options: ['az', 'en', 'ru', 'de'] },
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'scheduled', 'published'] },
        { name: 'slug', label: 'Slug (boş = avtomatik)', placeholder: 'seo-meqale-2026' },
        { name: 'keyword', label: 'Hədəf açar söz' },
        { name: 'excerpt', label: 'Qısa təsvir (meta description)', type: 'textarea', span2: true, rows: 2 },
        { name: 'cover_url', label: 'Üz qabığı şəkli', type: 'image', span2: true },
        { name: 'body', label: 'Mətn', type: 'textarea', span2: true, rows: 14,
          hint: 'Boş sətir = yeni abzas · "## " ilə başlayan sətir = başlıq · "- " = siyahı · "> " = sitat' },
        { name: 'seo_score', label: 'SEO bal', type: 'number' },
      ]}
    />
  );
}
