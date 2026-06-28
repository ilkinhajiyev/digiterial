import { createClient } from '@/lib/supabase/server';
import { homeBlocks } from '@/lib/data/defaults';
import VisualBuilder from '@/components/admin/visual-builder';

export default async function BuilderPage() {
  const sb = await createClient();
  const { data } = await sb.from('pages').select('*').eq('key', 'home').eq('locale', 'az').single();
  const dbBlocks = (data?.blocks as any[]) || [];
  const initial = {
    seo_title: data?.seo_title || 'Digiterial — Rəqəmsal Marketinq Agentliyi',
    slug: data?.slug || '/',
    meta_desc: data?.meta_desc || '360° rəqəmsal agentlik.',
    blocks: dbBlocks.length ? dbBlocks : homeBlocks,
  };
  return <VisualBuilder initial={initial} />;
}
