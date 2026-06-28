import { createServiceClient } from '@/lib/supabase/service';
export type SiteSettings = { brand: string; email: string; phone: string; social: { instagram?: string; linkedin?: string; tiktok?: string; facebook?: string } };
export const defaultSettings: SiteSettings = { brand: 'Digiterial', email: 'salam@digiterial.com', phone: '+994 60 499 63 40', social: { instagram: 'https://instagram.com', linkedin: 'https://linkedin.com', tiktok: 'https://tiktok.com', facebook: 'https://facebook.com' } };
export async function getSettings(): Promise<SiteSettings> {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return defaultSettings;
    const sb = createServiceClient();
    const { data } = await sb.from('site_settings').select('data').eq('id', 1).maybeSingle();
    const d: any = data?.data || {};
    return { ...defaultSettings, ...d, social: { ...defaultSettings.social, ...(d.social || {}) } };
  } catch { return defaultSettings; }
}
