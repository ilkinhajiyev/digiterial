import { createServiceClient } from '@/lib/supabase/service';

export async function getPage(key: string, locale: string) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
    const sb = createServiceClient();
    const { data } = await sb.from('pages').select('*').eq('key', key).eq('locale', locale).single();
    return data;
  } catch { return null; }
}
