import { requireStaff } from '@/lib/auth/guard';
import { createServiceClient } from '@/lib/supabase/service';
import { getSettings } from '@/lib/data/settings';
import FullBuilder from '@/components/admin/full-builder';
import { defaultBlocks } from '@/lib/data/default-blocks';
import { PAGE_KEYS } from '@/lib/data/page-registry';
import { locales } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

// Blok redaktəsi olan səhifələr (qalanlarında yalnız SEO tabı işləyir)
const BLOCK_PAGES = ['home', 'services', 'about', 'case-studies'];

export default async function BuilderPage() {
  await requireStaff();
  const { data: allPages } = await createServiceClient().from('pages').select('*');
  const settings = await getSettings();

  const pagesMap: Record<string, Record<string, any>> = {};
  for (const pk of PAGE_KEYS) {
    pagesMap[pk.key] = {};
    for (const loc of locales) {
      const found = allPages?.find((p) => p.key === pk.key && p.locale === loc);
      const saved = Array.isArray(found?.blocks) && found.blocks.length > 0;
      pagesMap[pk.key][loc] = {
        seo_title: found?.seo_title || '',
        slug: found?.slug || pk.slug,
        meta_desc: found?.meta_desc || '',
        saved: !!found,
        blocks: saved ? found.blocks : BLOCK_PAGES.includes(pk.key) ? await defaultBlocks(pk.key, loc) : [],
      };
    }
  }

  return <FullBuilder pageKeys={PAGE_KEYS.map((p) => ({ ...p, blocks: BLOCK_PAGES.includes(p.key) }))} pagesMap={pagesMap} settings={settings} />;
}
