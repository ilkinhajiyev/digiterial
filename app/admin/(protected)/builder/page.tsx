import { createServiceClient } from '@/lib/supabase/service';
import { getSettings, defaultSettings } from '@/lib/data/settings';
import FullBuilder from '@/components/admin/full-builder';
import { homeBlocks } from '@/lib/data/defaults';

const PAGE_KEYS = [
  { key: 'home',         label: 'Ana səhifə',   slug: '/' },
  { key: 'services',     label: 'Xidmətlər',    slug: '/xidmetler' },
  { key: 'work',         label: 'İşlər',         slug: '/isler' },
  { key: 'about',        label: 'Haqqımızda',   slug: '/haqqimizda' },
  { key: 'blog',         label: 'Bloq',          slug: '/bloq' },
  { key: 'contact',      label: 'Əlaqə',         slug: '/elaqe' },
  { key: 'case-studies', label: 'Case Studies',  slug: '/case-studies' },
];
const LOCALES = ['az', 'en', 'ru'];

export default async function BuilderPage() {
  const sb = createServiceClient();

  // Bütün səhifə + dil kombinasiyalarını yüklə
  const { data: allPages } = await sb.from('pages').select('*');
  const settings = await getSettings();

  // Səhifə məlumatlarını map et
  const pagesMap: Record<string, Record<string, any>> = {};
  for (const pk of PAGE_KEYS) {
    pagesMap[pk.key] = {};
    for (const loc of LOCALES) {
      const found = allPages?.find(p => p.key === pk.key && p.locale === loc);
      pagesMap[pk.key][loc] = {
        seo_title: found?.seo_title || '',
        slug: found?.slug || pk.slug,
        meta_desc: found?.meta_desc || '',
        blocks: found?.blocks?.length ? found.blocks : (pk.key === 'home' ? homeBlocks : []),
      };
    }
  }

  return (
    <FullBuilder
      pageKeys={PAGE_KEYS}
      pagesMap={pagesMap}
      settings={settings}
    />
  );
}
