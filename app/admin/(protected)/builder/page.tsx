import { createAdminServiceClient } from '@/lib/security/admin';
import { getSettings } from '@/lib/data/settings';
import FullBuilder from '@/components/admin/full-builder';
import { getDefaultPageBlocks, resolvePageBlocks } from '@/lib/data/page-content';
import { locales } from '@/i18n/routing';

const PAGE_KEYS = [
  { key: 'home',         label: 'Ana səhifə',   slug: '/' },
  { key: 'services',     label: 'Xidmətlər',    slug: '/xidmetler' },
  { key: 'work',         label: 'İşlər',         slug: '/isler' },
  { key: 'about',        label: 'Haqqımızda',   slug: '/haqqimizda' },
  { key: 'blog',         label: 'Bloq',          slug: '/bloq' },
  { key: 'contact',      label: 'Əlaqə',         slug: '/elaqe' },
  { key: 'case-studies', label: 'Case Studies',  slug: '/case-studies' },
];
export default async function BuilderPage() {
  const sb = await createAdminServiceClient();

  // Bütün səhifə + dil kombinasiyalarını yüklə
  const { data: allPages } = await sb.from('pages').select('*');
  const settings = await getSettings();

  // Səhifə məlumatlarını map et
  const pagesMap: Record<string, Record<string, any>> = {};
  for (const pk of PAGE_KEYS) {
    pagesMap[pk.key] = {};
    for (const loc of locales) {
      const found = allPages?.find(p => p.key === pk.key && p.locale === loc);
      const defaults = getDefaultPageBlocks(pk.key, loc);
      pagesMap[pk.key][loc] = {
        seo_title: found?.seo_title || '',
        slug: found?.slug || pk.slug,
        meta_desc: found?.meta_desc || '',
        blocks: resolvePageBlocks(defaults, found?.blocks),
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
