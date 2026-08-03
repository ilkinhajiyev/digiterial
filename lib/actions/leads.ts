'use server';
import { revalidatePath } from 'next/cache';
import { createClient as sbServer } from '@/lib/supabase/server';
export async function addLead(fd: FormData) {
  const sb = await sbServer();
  const { error } = await sb.from('leads').insert({
    name: String(fd.get('name')), company: String(fd.get('company') || ''),
    service: String(fd.get('service') || ''), value: Number(fd.get('value') || 0),
    stage: String(fd.get('stage') || 'new') as any,
  });
  revalidatePath('/admin/crm');
  return { ok: !error, error: error?.message };
}
