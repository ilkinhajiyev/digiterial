'use server';
import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/service';
import { requireStaff } from '@/lib/auth/guard';
import { safeId, safeUrl } from '@/lib/utils';
import type { SiteSettings } from '@/lib/data/settings';

const txt = (v: unknown, max = 200) => String(v ?? '').trim().slice(0, max);

export async function saveSettings(input: SiteSettings) {
  try {
    await requireStaff(['admin', 'manager']);
    const a = input?.analytics || {};
    const s = input?.social || {};
    const data: SiteSettings = {
      brand: txt(input?.brand, 60) || 'Digiterial',
      logoUrl: safeUrl(input?.logoUrl),
      email: txt(input?.email, 120),
      phone: txt(input?.phone, 40),
      whatsapp: String(input?.whatsapp ?? '').replace(/\D/g, '').slice(0, 20),
      address: txt(input?.address, 200),
      social: {
        instagram: safeUrl(s.instagram), linkedin: safeUrl(s.linkedin), tiktok: safeUrl(s.tiktok),
        facebook: safeUrl(s.facebook), youtube: safeUrl(s.youtube),
      },
      analytics: {
        ga4: safeId(a.ga4), gtm: safeId(a.gtm), metaPixel: safeId(a.metaPixel),
        yandexMetrica: safeId(a.yandexMetrica), tiktokPixel: safeId(a.tiktokPixel),
        googleVerification: safeId(a.googleVerification, 100), yandexVerification: safeId(a.yandexVerification, 100),
      },
    };
    const { error } = await createServiceClient().from('site_settings').upsert({ id: 1, data });
    if (error) return { ok: false, error: error.message };
    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (ex: any) {
    return { ok: false, error: ex?.message };
  }
}
