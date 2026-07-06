import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import CrudTable from '@/components/admin/crud-table';
import { upsertPortfolio, destroyPortfolio } from '@/lib/actions/admin';

export default async function Page() {
  await (await createClient()).auth.getUser(); // auth yoxla
  const svc = createServiceClient();
  const { data } = await svc.from('portfolio_items').select('*').order('position', { ascending: true });
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
        { name: 'image_url', label: 'Əsas şəkil', type: 'image', span2: true },
        { name: 'url', label: 'Sayt linki', placeholder: 'https://' },
        { name: 'gallery', label: 'Qalereya şəkilləri', type: 'gallery', span2: true },
        { name: 'position', label: 'Sıra', type: 'number' },
        { name: 'featured', label: 'Seçilmiş (★)', type: 'checkbox' },
      ]}
    />
  );
}
