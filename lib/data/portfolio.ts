import { createServiceClient } from '@/lib/supabase/service';
export type PItem = { id: string; title: string; category: 'web' | 'smm'; client?: string; description?: string; url?: string; image_url?: string; tags?: string; metric?: string; featured?: boolean; position?: number };
export async function getPortfolio(): Promise<PItem[]> {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
    const sb = createServiceClient();
    const { data } = await sb.from('portfolio_items').select('*').order('position', { ascending: true }).order('created_at', { ascending: false });
    return (data as any) || [];
  } catch { return []; }
}
