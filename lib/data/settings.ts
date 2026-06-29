import { createServiceClient } from '@/lib/supabase/service';

export type SiteSettings = {
  brand: string;
  email: string;
  phone: string;
  whatsapp?: string;
  social: {
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
    facebook?: string;
  };
};

export const defaultSettings: SiteSettings = {
  brand: 'Digiterial',
  email: 'salam@digiterial.com',
  phone: '+994 60 499 63 40',
  whatsapp: '994604996340',
  social: {
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    tiktok: 'https://tiktok.com',
    facebook: 'https://facebook.com',
  },
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!key || !url) return defaultSettings;

    const sb = createServiceClient();
    const { data, error } = await sb
      .from('site_settings')
      .select('data')
      .eq('id', 1)
      .maybeSingle();

    if (error || !data) return defaultSettings;

    const d = data.data as any;
    return {
      brand:    d.brand    || defaultSettings.brand,
      email:    d.email    || defaultSettings.email,
      phone:    d.phone    || defaultSettings.phone,
      whatsapp: d.whatsapp || defaultSettings.whatsapp,
      social: { ...defaultSettings.social, ...(d.social || {}) },
    };
  } catch {
    return defaultSettings;
  }
}
