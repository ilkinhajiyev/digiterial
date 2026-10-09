import { cache } from 'react';
import { createServiceClient } from '@/lib/supabase/service';

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
  email: 'salam@digiterial.com',
  phone: '+994 60 499 63 40',
  whatsapp: '994604996340',
  address: 'Bakı & Gəncə, Azərbaycan',
  social: {
    instagram: '',
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

export const getSettings = cache(async function getSettings(): Promise<SiteSettings> {
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
  } catch {
    return defaultSettings;
  }
});

/** Ünvan yalnız Azərbaycan dilində yazılıbsa, digər dillərdə tərcümə faylındakı ünvan göstərilir. */
export const addressFor = (st: SiteSettings, locale: string, fallback: string) =>
  st.address && st.address !== defaultSettings.address && (locale === 'az' || !/[əƏ]/.test(st.address)) ? st.address : fallback;
