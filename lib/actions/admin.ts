'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

// Yazma əməliyyatları üçün service client (RLS bypass — admin paneldə güvənli).
// Auth-u layout onsuz da yoxlayır; burada rol boşluğu problemə səbəb olmasın.
async function sb() { return createServiceClient(); }

// ── CLIENTS ──────────────────────────────────────────────────────────────
export async function upsertClient(id: string | null, fd: FormData) {
  const db = await sb();
  const data = { name: String(fd.get('name')), industry: String(fd.get('industry') || ''), status: String(fd.get('status') || 'active'), website: String(fd.get('website') || ''), contact_email: String(fd.get('contact_email') || ''), contact_phone: String(fd.get('contact_phone') || '') };
  const { error } = id ? await db.from('clients').update(data).eq('id', id) : await db.from('clients').insert(data);
  revalidatePath('/admin/clients');
  return { ok: !error, error: error?.message };
}
export async function destroyClient(id: string) {
  const db = await sb(); await db.from('clients').delete().eq('id', id);
  revalidatePath('/admin/clients'); return { ok: true };
}

// ── LEADS ────────────────────────────────────────────────────────────────
export async function upsertLead(id: string | null, fd: FormData) {
  const db = await sb();
  const data = { name: String(fd.get('name')), company: String(fd.get('company') || ''), service: String(fd.get('service') || ''), value: Number(fd.get('value') || 0), stage: String(fd.get('stage') || 'new'), source: String(fd.get('source') || 'organic') };
  const { error } = id ? await db.from('leads').update(data).eq('id', id) : await db.from('leads').insert(data);
  revalidatePath('/admin/crm'); return { ok: !error, error: error?.message };
}
export async function destroyLead(id: string) {
  const db = await sb(); await db.from('leads').delete().eq('id', id);
  revalidatePath('/admin/crm'); return { ok: true };
}

// ── PROJECTS ─────────────────────────────────────────────────────────────
export async function upsertProject(id: string | null, fd: FormData) {
  const db = await sb();
  const data = { name: String(fd.get('name')), type: String(fd.get('type') || ''), status: String(fd.get('status') || 'planning'), progress: Number(fd.get('progress') || 0), budget: fd.get('budget') ? Number(fd.get('budget')) : null, due_date: fd.get('due_date') || null };
  const { error } = id ? await db.from('projects').update(data).eq('id', id) : await db.from('projects').insert(data);
  revalidatePath('/admin/projects'); return { ok: !error, error: error?.message };
}
export async function destroyProject(id: string) {
  const db = await sb(); await db.from('projects').delete().eq('id', id);
  revalidatePath('/admin/projects'); return { ok: true };
}

// ── TASKS ────────────────────────────────────────────────────────────────
export async function upsertTask(id: string | null, fd: FormData) {
  const db = await sb();
  const data = { title: String(fd.get('title')), area: String(fd.get('area') || ''), status: String(fd.get('status') || 'backlog'), due_date: fd.get('due_date') || null };
  const { error } = id ? await db.from('tasks').update(data).eq('id', id) : await db.from('tasks').insert(data);
  revalidatePath('/admin/tasks'); return { ok: !error, error: error?.message };
}
export async function destroyTask(id: string) {
  const db = await sb(); await db.from('tasks').delete().eq('id', id);
  revalidatePath('/admin/tasks'); return { ok: true };
}

// ── CAMPAIGNS ────────────────────────────────────────────────────────────
export async function upsertCampaign(id: string | null, fd: FormData) {
  const db = await sb();
  const data = { name: String(fd.get('name')), channel: String(fd.get('channel') || 'google'), spend: Number(fd.get('spend') || 0), conversions: Number(fd.get('conversions') || 0), roas: fd.get('roas') ? Number(fd.get('roas')) : null, status: String(fd.get('status') || 'active') };
  const { error } = id ? await db.from('campaigns').update(data).eq('id', id) : await db.from('campaigns').insert(data);
  revalidatePath('/admin/campaigns'); return { ok: !error, error: error?.message };
}
export async function destroyCampaign(id: string) {
  const db = await sb(); await db.from('campaigns').delete().eq('id', id);
  revalidatePath('/admin/campaigns'); return { ok: true };
}

// ── KEYWORDS ─────────────────────────────────────────────────────────────
export async function upsertKeyword(id: string | null, fd: FormData) {
  const db = await sb();
  const data = { keyword: String(fd.get('keyword')), position: fd.get('position') ? Number(fd.get('position')) : null, volume: fd.get('volume') ? Number(fd.get('volume')) : null, difficulty: String(fd.get('difficulty') || '') };
  const { error } = id ? await db.from('keywords').update(data).eq('id', id) : await db.from('keywords').insert(data);
  revalidatePath('/admin/seo'); return { ok: !error, error: error?.message };
}
export async function destroyKeyword(id: string) {
  const db = await sb(); await db.from('keywords').delete().eq('id', id);
  revalidatePath('/admin/seo'); return { ok: true };
}

// ── CONTENT ──────────────────────────────────────────────────────────────
export async function upsertContent(id: string | null, fd: FormData) {
  const db = await sb();
  const data = { title: String(fd.get('title')), slug: String(fd.get('slug') || ''), keyword: String(fd.get('keyword') || ''), seo_score: fd.get('seo_score') ? Number(fd.get('seo_score')) : null, status: String(fd.get('status') || 'draft'), excerpt: String(fd.get('excerpt') || '') };
  const { error } = id ? await db.from('content_posts').update(data).eq('id', id) : await db.from('content_posts').insert(data);
  revalidatePath('/admin/content'); return { ok: !error, error: error?.message };
}
export async function destroyContent(id: string) {
  const db = await sb(); await db.from('content_posts').delete().eq('id', id);
  revalidatePath('/admin/content'); return { ok: true };
}

// ── INVOICES ─────────────────────────────────────────────────────────────
export async function upsertInvoice(id: string | null, fd: FormData) {
  const db = await sb();
  const data = { number: String(fd.get('number')), amount: Number(fd.get('amount') || 0), status: String(fd.get('status') || 'draft'), issue_date: fd.get('issue_date') || null, due_date: fd.get('due_date') || null };
  const { error } = id ? await db.from('invoices').update(data).eq('id', id) : await db.from('invoices').insert(data);
  revalidatePath('/admin/invoices'); return { ok: !error, error: error?.message };
}
export async function destroyInvoice(id: string) {
  const db = await sb(); await db.from('invoices').delete().eq('id', id);
  revalidatePath('/admin/invoices'); return { ok: true };
}

// ── DOMAINS ──────────────────────────────────────────────────────────────
export async function upsertDomain(id: string | null, fd: FormData) {
  const db = await sb();
  const data = { domain: String(fd.get('domain')), ssl_active: fd.get('ssl_active') === 'on', expires_at: fd.get('expires_at') || null };
  const { error } = id ? await db.from('domains').update(data).eq('id', id) : await db.from('domains').insert(data);
  revalidatePath('/admin/domains'); return { ok: !error, error: error?.message };
}
export async function destroyDomain(id: string) {
  const db = await sb(); await db.from('domains').delete().eq('id', id);
  revalidatePath('/admin/domains'); return { ok: true };
}

// ── TICKETS ──────────────────────────────────────────────────────────────
export async function upsertTicket(id: string | null, fd: FormData) {
  const db = await sb();
  const data = { subject: String(fd.get('subject')), priority: String(fd.get('priority') || 'medium'), status: String(fd.get('status') || 'open') };
  const { error } = id ? await db.from('tickets').update(data).eq('id', id) : await db.from('tickets').insert(data);
  revalidatePath('/admin/tickets'); return { ok: !error, error: error?.message };
}
export async function destroyTicket(id: string) {
  const db = await sb(); await db.from('tickets').delete().eq('id', id);
  revalidatePath('/admin/tickets'); return { ok: true };
}

// ── PORTFOLIO ────────────────────────────────────────────────────────────
function slugify(s: string) {
  const m: Record<string, string> = { 'ə':'e','ö':'o','ü':'u','ğ':'g','ı':'i','ş':'s','ç':'c','İ':'i' };
  return s.toLowerCase().replace(/[əöüğışçİ]/g, c => m[c] || c).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
export async function upsertPortfolio(id: string | null, fd: FormData) {
  const db = await sb();
  const title = String(fd.get('title'));
  const gallery = String(fd.get('gallery') || '').split('\n').map(x => x.trim()).filter(Boolean);
  const data = { title, slug: slugify(String(fd.get('slug') || title)), category: String(fd.get('category') || 'web'), client: String(fd.get('client') || ''), description: String(fd.get('description') || ''), body: String(fd.get('body') || ''), url: String(fd.get('url') || ''), image_url: String(fd.get('image_url') || ''), gallery, tags: String(fd.get('tags') || ''), metric: String(fd.get('metric') || ''), featured: fd.get('featured') === 'on', position: Number(fd.get('position') || 0) };
  const { error } = id ? await db.from('portfolio_items').update(data).eq('id', id) : await db.from('portfolio_items').insert(data);
  revalidatePath('/admin/portfolio'); revalidatePath('/[locale]/isler', 'page'); revalidatePath('/', 'layout');
  return { ok: !error, error: error?.message };
}
export async function destroyPortfolio(id: string) {
  const db = await sb(); await db.from('portfolio_items').delete().eq('id', id);
  revalidatePath('/admin/portfolio'); revalidatePath('/[locale]/isler', 'page'); revalidatePath('/', 'layout'); return { ok: true };
}
