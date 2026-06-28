import { createClient } from '@/lib/supabase/server';
import CrudTable from '@/components/admin/crud-table';
import { upsertPortfolio, destroyPortfolio } from '@/lib/actions/admin';

export default async function Page() {
  const sb = await createClient();
  const { data } = await sb.from('portfolio_items').select('*').order('position', { ascending: true });
  return (
    <CrudTable
      title="Portfolio" rows={data ?? []}
      upsert={upsertPortfolio} destroy={destroyPortfolio}
      cols={[
        { key: 'title', label: 'Başlıq' },
        { key: 'category', label: 'Kateqoriya', fmt: 'badge' },
        { key: 'client', label: 'Müştəri' },
        { key: 'metric', label: 'Metrik' },
        { key: 'featured', label: '★', fmt: 'bool' },
      ]}
      fields={[
        { name: 'title', label: 'Başlıq', required: true, span2: true },
        { name: 'category', label: 'Kateqoriya', type: 'select', options: ['web', 'smm'] },
        { name: 'client', label: 'Müştəri' },
        { name: 'slug', label: 'Slug (boş = avtomatik)', placeholder: 'restobaku' },
        { name: 'description', label: 'Qısa təsvir', type: 'textarea', span2: true },
        { name: 'body', label: 'Ətraflı mətn (abzaslar yeni sətirdə)', type: 'textarea', span2: true },
        { name: 'metric', label: 'Metrik / nəticə', placeholder: '+214% sifariş' },
        { name: 'tags', label: 'Teqlər (vergüllə)', placeholder: 'WordPress, SEO' },
        { name: 'image_url', label: 'Əsas şəkil URL', placeholder: 'https://...jpg' },
        { name: 'url', label: 'Sayt linki', placeholder: 'https://' },
        { name: 'gallery', label: 'Qalereya (hər sətirdə bir URL)', type: 'textarea', span2: true, placeholder: 'https://...1.jpg\nhttps://...2.jpg' },
        { name: 'position', label: 'Sıra', type: 'number' },
        { name: 'featured', label: 'Seçilmiş (★)', type: 'checkbox' },
      ]}
    />
  );
}
