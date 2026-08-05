'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/security/admin';

const ALLOWED_TABLES = new Set(['clients', 'leads', 'projects', 'tasks', 'campaigns', 'keywords', 'invoices', 'content_posts', 'tickets', 'domains', 'pages', 'portfolio_items']);
function assertTable(table: string) { if (!ALLOWED_TABLES.has(table)) throw new Error('FORBIDDEN'); }

export async function createRow(table: string, data: Record<string, any>, revalidate?: string) {
  await requireAdmin(); assertTable(table);
  const sb = await createClient();
  const { error } = await sb.from(table).insert(data);
  if (revalidate) revalidatePath(revalidate);
  return { ok: !error, error: error?.message };
}
export async function updateRow(table: string, id: string, data: Record<string, any>, revalidate?: string) {
  await requireAdmin(); assertTable(table);
  const sb = await createClient();
  const { error } = await sb.from(table).update(data).eq('id', id);
  if (revalidate) revalidatePath(revalidate);
  return { ok: !error, error: error?.message };
}
export async function deleteRow(table: string, id: string, revalidate?: string) {
  await requireAdmin(); assertTable(table);
  const sb = await createClient();
  const { error } = await sb.from(table).delete().eq('id', id);
  if (revalidate) revalidatePath(revalidate);
  return { ok: !error, error: error?.message };
}
