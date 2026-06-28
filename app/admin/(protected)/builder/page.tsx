import { createClient } from '@/lib/supabase/server';
import { homeBlocks } from '@/lib/data/defaults';
import BuilderEditor from '@/components/admin/builder-editor';

export default async function BuilderPage() {
  const sb = await createClient();
  const { data } = await sb.from('pages').select('*').eq('key', 'home').eq('locale', 'az').single();
  const initial = {
    key: 'home', locale: 'az',
    seo_title: data?.seo_title || 'Digiterial — Rəqəmsal Marketinq Agentliyi',
    slug: data?.slug || '/',
    meta_desc: data?.meta_desc || '360° rəqəmsal agentlik.',
    blocks: (data?.blocks as any[]) || homeBlocks,
  };
  return <BuilderEditor initial={initial} />;
}
