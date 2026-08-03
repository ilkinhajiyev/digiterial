import { createServiceClient } from '@/lib/supabase/service';

export async function getPage(key: string, locale: string) {
  try {
    const sk = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!sk || !url) return null;
    const sb = createServiceClient();
    const { data } = await sb
      .from('pages')
      .select('*')
      .eq('key', key)
      .eq('locale', locale)
      .single();
    return data;
  } catch {
    return null;
  }
}
