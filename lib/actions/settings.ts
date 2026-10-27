'use server';
import { requireStaff } from '@/lib/auth-guard';
import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/service';

export async function saveSettings(data: any) {
  try {
    await requireStaff();
    const sb = createServiceClient();
    const { error } = await sb.from('site_settings').upsert({ id: 1, data });
    if (error) return { ok: false, error: error.message };
    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (ex: any) {
    return { ok: false, error: ex?.message };
  }
}
