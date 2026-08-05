'use server';
import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/service';
import { requireAdmin } from '@/lib/security/admin';
import { z } from 'zod';

const optionalUrl = z.string().trim().max(500).refine(v => !v || /^https:\/\//i.test(v), 'Link https:// ilə başlamalıdır');
const settingsSchema = z.object({
  brand: z.string().trim().min(1).max(80),
  logoUrl: optionalUrl.optional(),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(32).regex(/^\+?[0-9()\s-]+$/),
  whatsapp: z.string().trim().max(32).regex(/^\+?[0-9()\s-]*$/).optional(),
  address: z.string().trim().max(240).optional(),
  headerCta: z.record(z.string().trim().max(80)).optional(),
  footerTagline: z.record(z.string().trim().max(500)).optional(),
  social: z.object({ instagram: optionalUrl.optional(), linkedin: optionalUrl.optional(), tiktok: optionalUrl.optional(), facebook: optionalUrl.optional(), youtube: optionalUrl.optional() }),
  analytics: z.object({
    ga4: z.string().trim().regex(/^(G-[A-Z0-9]+)?$/i).optional(),
    gtm: z.string().trim().regex(/^(GTM-[A-Z0-9]+)?$/i).optional(),
    metaPixel: z.string().trim().regex(/^\d*$/).max(32).optional(),
    yandexMetrica: z.string().trim().regex(/^\d*$/).max(32).optional(),
    tiktokPixel: z.string().trim().regex(/^[A-Z0-9]*$/i).max(64).optional(),
    googleVerification: z.string().trim().max(256).optional(),
    yandexVerification: z.string().trim().max(256).optional(),
  }),
});

export async function saveSettings(data: any) {
  try {
    await requireAdmin();
    const parsed = settingsSchema.safeParse(data);
    if (!parsed.success) return { ok: false, error: 'Daxil edilən tənzimləmələr düzgün formatda deyil.' };
    const sb = createServiceClient();
    const { error } = await sb.from('site_settings').upsert({ id: 1, data: parsed.data });
    if (error) return { ok: false, error: 'Tənzimləmələr saxlanmadı.' };
    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (ex: any) {
    return { ok: false, error: ex?.message === 'UNAUTHORIZED' || ex?.message === 'FORBIDDEN' ? 'Bu əməliyyat üçün icazəniz yoxdur.' : 'Tənzimləmələr saxlanmadı.' };
  }
}
