'use server';
import { revalidatePath } from 'next/cache';
import { createClient as sbServer } from '@/lib/supabase/server';

function payload(fd: FormData) {
  return {
    name: String(fd.get('name')),
    industry: String(fd.get('industry') || ''),
    status: String(fd.get('status') || 'active') as any,
    website: String(fd.get('website') || ''),
    contact_email: String(fd.get('contact_email') || ''),
    contact_phone: String(fd.get('contact_phone') || ''),
  };
}
export async function addClient(fd: FormData) {
  const sb = await sbServer();
  const { error } = await sb.from('clients').insert(payload(fd));
  revalidatePath('/admin/clients');
  return { ok: !error, error: error?.message };
}
export async function editClient(id: string, fd: FormData) {
  const sb = await sbServer();
  const { error } = await sb.from('clients').update(payload(fd)).eq('id', id);
  revalidatePath('/admin/clients');
  return { ok: !error, error: error?.message };
}
export async function removeClient(id: string) {
  const sb = await sbServer();
  await sb.from('clients').delete().eq('id', id);
  revalidatePath('/admin/clients');
  return { ok: true };
}
