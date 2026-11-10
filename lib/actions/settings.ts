'use server';
import { requireStaff } from '@/lib/auth-guard';
import { revalidatePath } from 'next/cache';
import { createStaffClient } from '@/lib/supabase/service';

export async function saveSettings(data: any) {
  try {
    await requireStaff();
    const sb = (await createStaffClient());
    const { error } = await sb.from('site_settings').upsert({ id: 1, data });
    if (error) return { ok: false, error: error.message };
    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (ex: any) {
    return { ok: false, error: ex?.message };
  }
}
