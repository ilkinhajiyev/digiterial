'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
export async function saveSettings(data: any) {
  const sb = await createClient();
  const { error } = await sb.from('site_settings').upsert({ id: 1, data });
  revalidatePath('/', 'layout');
  return { ok: !error, error: error?.message };
}
