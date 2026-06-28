'use server';
import { revalidatePath } from 'next/cache';
import { createClient as sbServer } from '@/lib/supabase/server';

function slugify(s: string) {
  const map: Record<string, string> = { 'ə': 'e', 'ö': 'o', 'ü': 'u', 'ğ': 'g', 'ı': 'i', 'ş': 's', 'ç': 'c', 'İ': 'i' };
  return s.toLowerCase().replace(/[əöüğışçİ]/g, (m) => map[m] || m).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function payload(fd: FormData) {
  const title = String(fd.get('title'));
  const slugRaw = String(fd.get('slug') || '').trim();
  const gallery = String(fd.get('gallery') || '').split('\n').map((x) => x.trim()).filter(Boolean);
  return {
    title,
    slug: slugRaw ? slugify(slugRaw) : slugify(title),
    category: String(fd.get('category') || 'web') as any,
    client: String(fd.get('client') || ''),
    description: String(fd.get('description') || ''),
    body: String(fd.get('body') || ''),
    url: String(fd.get('url') || ''),
    image_url: String(fd.get('image_url') || ''),
    gallery,
    tags: String(fd.get('tags') || ''),
    metric: String(fd.get('metric') || ''),
    featured: fd.get('featured') === 'on',
    position: Number(fd.get('position') || 0),
  };
}
export async function addPortfolio(fd: FormData) {
  const sb = await sbServer();
  const { error } = await sb.from('portfolio_items').insert(payload(fd));
  revalidatePath('/admin/portfolio'); revalidatePath('/isler');
  return { ok: !error, error: error?.message };
}
export async function editPortfolio(id: string, fd: FormData) {
  const sb = await sbServer();
  const { error } = await sb.from('portfolio_items').update(payload(fd)).eq('id', id);
  revalidatePath('/admin/portfolio'); revalidatePath('/isler');
  return { ok: !error, error: error?.message };
}
export async function removePortfolio(id: string) {
  const sb = await sbServer();
  await sb.from('portfolio_items').delete().eq('id', id);
  revalidatePath('/admin/portfolio'); revalidatePath('/isler');
  return { ok: true };
}
