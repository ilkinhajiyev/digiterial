import { createServiceClient } from '@/lib/supabase/service';
import { markSupabaseUnavailable, supabaseLikelyDown, withSupabaseTimeout, isTransientSupabaseFailure } from '@/lib/supabase/soft';

export type SiteSettings = {
  brand: string;
  logoUrl?: string;          // Loqo şəkli (yüklənmiş)
  email: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  social: {
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
    facebook?: string;
    youtube?: string;
  };
  // ── Analitika / izləmə kodları ──
  analytics: {
    ga4?: string;            // G-XXXXXXXXXX (Google Analytics 4)
    gtm?: string;            // GTM-XXXXXXX (Google Tag Manager)
    metaPixel?: string;      // Meta (Facebook) Pixel ID
    yandexMetrica?: string;  // Yandex Metrica sayğac ID
    tiktokPixel?: string;    // TikTok Pixel ID
    googleVerification?: string; // Search Console təsdiq kodu
    yandexVerification?: string; // Yandex Webmaster təsdiq kodu
  };
};

export const defaultSettings: SiteSettings = {
  brand: 'Digiterial',
  logoUrl: '',
  email: 'info@digiterial.com',
  phone: '+994 51 930 59 95',
  whatsapp: '994519305995',
  address: 'Bakı, Azərbaycan',
  social: {
    instagram: 'https://www.instagram.com/digiterial_com/',
    linkedin: '',
    tiktok: '',
    facebook: '',
    youtube: '',
  },
  analytics: {
    ga4: '',
    gtm: '',
    metaPixel: '',
    yandexMetrica: '',
    tiktokPixel: '',
    googleVerification: '',
    yandexVerification: '',
  },
};

export async function getSettings(): Promise<SiteSettings> {
  if (supabaseLikelyDown()) return defaultSettings;
  try {
    const sb = createServiceClient();
    const { data, error } = await withSupabaseTimeout(
      sb.from('site_settings').select('data').eq('id', 1).maybeSingle(),
    );

    if (error || !data) {
      if (error && isTransientSupabaseFailure((error as { message?: string }).message)) markSupabaseUnavailable();
      return defaultSettings;
    }

    const d = (data.data || {}) as any;
    return {
      brand:    d.brand    || defaultSettings.brand,
      logoUrl:  d.logoUrl  || '',
      email:    d.email    || defaultSettings.email,
      phone:    d.phone    || defaultSettings.phone,
      whatsapp: d.whatsapp || defaultSettings.whatsapp,
      address:  d.address  || defaultSettings.address,
      social:   { ...defaultSettings.social,    ...(d.social || {}) },
      analytics:{ ...defaultSettings.analytics, ...(d.analytics || {}) },
    };
  } catch (e: any) {
    if (isTransientSupabaseFailure(e?.message)) markSupabaseUnavailable();
    return defaultSettings;
  }
}
