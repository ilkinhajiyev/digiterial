'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function createRow(table: string, data: Record<string, any>, revalidate?: string) {
  const sb = await createClient();
  const { error } = await sb.from(table).insert(data);
  if (revalidate) revalidatePath(revalidate);
  return { ok: !error, error: error?.message };
}
export async function updateRow(table: string, id: string, data: Record<string, any>, revalidate?: string) {
  const sb = await createClient();
  const { error } = await sb.from(table).update(data).eq('id', id);
  if (revalidate) revalidatePath(revalidate);
  return { ok: !error, error: error?.message };
}
export async function deleteRow(table: string, id: string, revalidate?: string) {
  const sb = await createClient();
  const { error } = await sb.from(table).delete().eq('id', id);
  if (revalidate) revalidatePath(revalidate);
  return { ok: !error, error: error?.message };
}
