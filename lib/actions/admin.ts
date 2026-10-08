'use server';
import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/service';
import { requireStaff, type StaffRole } from '@/lib/auth/guard';
import { slugify } from '@/lib/utils';

type Result = { ok: boolean; error?: string };
type Builder = (fd: FormData) => Record<string, unknown>;

const str = (fd: FormData, k: string, max = 500) => String(fd.get(k) ?? '').trim().slice(0, max);
const num = (fd: FormData, k: string) => { const v = fd.get(k); if (v === null || v === '') return null; const n = Number(v); return Number.isFinite(n) ? n : null; };
const date = (fd: FormData, k: string) => { const v = str(fd, k, 10); return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null; };
const oneOf = <T extends string>(v: string, list: readonly T[], def: T): T => (list.includes(v as T) ? (v as T) : def);
const isUuid = (id: string) => /^[0-9a-f-]{36}$/i.test(id);

async function upsert(table: string, id: string | null, fd: FormData, build: Builder, paths: string[], roles?: readonly StaffRole[]): Promise<Result> {
  try {
    await requireStaff(roles);
    if (id && !isUuid(id)) return { ok: false, error: 'Yanlış ID' };
    const data = build(fd);
    const db = createServiceClient();
    const { error } = id ? await db.from(table).update(data).eq('id', id) : await db.from(table).insert(data);
    paths.forEach((p) => revalidatePath(p));
    return { ok: !error, error: error?.message };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Xəta' };
  }
}

async function destroy(table: string, id: string, paths: string[], roles?: readonly StaffRole[]): Promise<Result> {
  try {
    await requireStaff(roles);
    if (!isUuid(id)) return { ok: false, error: 'Yanlış ID' };
    const { error } = await createServiceClient().from(table).delete().eq('id', id);
    paths.forEach((p) => revalidatePath(p));
    return { ok: !error, error: error?.message };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Xəta' };
  }
}

// ── CLIENTS ──────────────────────────────────────────────────────────────
const clientB: Builder = (fd) => ({
  name: str(fd, 'name', 200), industry: str(fd, 'industry', 120),
  status: oneOf(str(fd, 'status'), ['active', 'negotiation', 'paused', 'archived'] as const, 'active'),
  website: str(fd, 'website', 300), contact_email: str(fd, 'contact_email', 200), contact_phone: str(fd, 'contact_phone', 60),
});
export async function upsertClient(id: string | null, fd: FormData) { return upsert('clients', id, fd, clientB, ['/admin/clients']); }
export async function destroyClient(id: string) { return destroy('clients', id, ['/admin/clients']); }

// ── LEADS ────────────────────────────────────────────────────────────────
const leadB: Builder = (fd) => ({
  name: str(fd, 'name', 200), company: str(fd, 'company', 200), email: str(fd, 'email', 200) || null, phone: str(fd, 'phone', 60) || null,
  service: str(fd, 'service', 120), value: num(fd, 'value') ?? 0,
  stage: oneOf(str(fd, 'stage'), ['new', 'contacted', 'proposal', 'negotiation', 'won', 'lost'] as const, 'new'),
  source: oneOf(str(fd, 'source'), ['organic', 'paid', 'social', 'referral', 'direct'] as const, 'organic'),
});
export async function upsertLead(id: string | null, fd: FormData) { return upsert('leads', id, fd, leadB, ['/admin/crm']); }
export async function destroyLead(id: string) { return destroy('leads', id, ['/admin/crm']); }

// ── PROJECTS ─────────────────────────────────────────────────────────────
const projectB: Builder = (fd) => ({
  name: str(fd, 'name', 200), type: str(fd, 'type', 120),
  status: oneOf(str(fd, 'status'), ['planning', 'in_progress', 'review', 'on_hold', 'completed', 'cancelled'] as const, 'planning'),
  progress: Math.max(0, Math.min(100, num(fd, 'progress') ?? 0)), budget: num(fd, 'budget'), due_date: date(fd, 'due_date'),
});
export async function upsertProject(id: string | null, fd: FormData) { return upsert('projects', id, fd, projectB, ['/admin/projects']); }
export async function destroyProject(id: string) { return destroy('projects', id, ['/admin/projects']); }

// ── TASKS ────────────────────────────────────────────────────────────────
const taskB: Builder = (fd) => ({
  title: str(fd, 'title', 300), area: str(fd, 'area', 120),
  status: oneOf(str(fd, 'status'), ['backlog', 'in_progress', 'review', 'done'] as const, 'backlog'), due_date: date(fd, 'due_date'),
});
export async function upsertTask(id: string | null, fd: FormData) { return upsert('tasks', id, fd, taskB, ['/admin/tasks']); }
export async function destroyTask(id: string) { return destroy('tasks', id, ['/admin/tasks']); }

// ── CAMPAIGNS ────────────────────────────────────────────────────────────
const campaignB: Builder = (fd) => ({
  name: str(fd, 'name', 200), channel: oneOf(str(fd, 'channel'), ['google', 'meta', 'tiktok', 'other'] as const, 'google'),
  spend: num(fd, 'spend') ?? 0, conversions: num(fd, 'conversions') ?? 0, roas: num(fd, 'roas'), status: str(fd, 'status', 40) || 'active',
});
export async function upsertCampaign(id: string | null, fd: FormData) { return upsert('campaigns', id, fd, campaignB, ['/admin/campaigns']); }
export async function destroyCampaign(id: string) { return destroy('campaigns', id, ['/admin/campaigns']); }

// ── KEYWORDS ─────────────────────────────────────────────────────────────
const keywordB: Builder = (fd) => ({ keyword: str(fd, 'keyword', 200), position: num(fd, 'position'), volume: num(fd, 'volume'), difficulty: str(fd, 'difficulty', 40) });
export async function upsertKeyword(id: string | null, fd: FormData) { return upsert('keywords', id, fd, keywordB, ['/admin/seo']); }
export async function destroyKeyword(id: string) { return destroy('keywords', id, ['/admin/seo']); }

// ── CONTENT / BLOQ ───────────────────────────────────────────────────────
const contentB: Builder = (fd) => {
  const title = str(fd, 'title', 300);
  const status = oneOf(str(fd, 'status'), ['draft', 'scheduled', 'published'] as const, 'draft');
  return {
    title, slug: slugify(str(fd, 'slug', 200) || title) || `post-${Date.now()}`,
    locale: oneOf(str(fd, 'locale'), ['az', 'en', 'ru', 'de'] as const, 'az'),
    keyword: str(fd, 'keyword', 200), seo_score: num(fd, 'seo_score'), status,
    excerpt: str(fd, 'excerpt', 600), body: str(fd, 'body', 50000),
    cover_url: str(fd, 'cover_url', 500) || null,
    ...(status === 'published' ? { published_at: new Date().toISOString() } : {}),
  };
};
export async function upsertContent(id: string | null, fd: FormData) {
  const r = await upsert('content_posts', id, fd, contentB, ['/admin/content']);
  if (r.ok) revalidatePath('/', 'layout');
  return r;
}
export async function destroyContent(id: string) {
  const r = await destroy('content_posts', id, ['/admin/content']);
  if (r.ok) revalidatePath('/', 'layout');
  return r;
}

// ── INVOICES (yalnız admin/manager) ──────────────────────────────────────
const FIN = ['admin', 'manager'] as const;
const invoiceB: Builder = (fd) => ({
  number: str(fd, 'number', 60), amount: num(fd, 'amount') ?? 0,
  status: oneOf(str(fd, 'status'), ['draft', 'sent', 'paid', 'overdue', 'void'] as const, 'draft'),
  issue_date: date(fd, 'issue_date'), due_date: date(fd, 'due_date'),
});
export async function upsertInvoice(id: string | null, fd: FormData) { return upsert('invoices', id, fd, invoiceB, ['/admin/invoices'], FIN); }
export async function destroyInvoice(id: string) { return destroy('invoices', id, ['/admin/invoices'], FIN); }

// ── DOMAINS ──────────────────────────────────────────────────────────────
const domainB: Builder = (fd) => ({ domain: str(fd, 'domain', 253), ssl_active: fd.get('ssl_active') === 'on', expires_at: date(fd, 'expires_at') });
export async function upsertDomain(id: string | null, fd: FormData) { return upsert('domains', id, fd, domainB, ['/admin/domains']); }
export async function destroyDomain(id: string) { return destroy('domains', id, ['/admin/domains']); }

// ── TICKETS ──────────────────────────────────────────────────────────────
const ticketB: Builder = (fd) => ({
  subject: str(fd, 'subject', 300),
  priority: oneOf(str(fd, 'priority'), ['low', 'medium', 'high', 'urgent'] as const, 'medium'),
  status: oneOf(str(fd, 'status'), ['open', 'in_progress', 'resolved', 'closed'] as const, 'open'),
});
export async function upsertTicket(id: string | null, fd: FormData) { return upsert('tickets', id, fd, ticketB, ['/admin/tickets']); }
export async function destroyTicket(id: string) { return destroy('tickets', id, ['/admin/tickets']); }

// ── PORTFOLIO ────────────────────────────────────────────────────────────
const portfolioB: Builder = (fd) => {
  const title = str(fd, 'title', 200);
  const gallery = String(fd.get('gallery') || '').split('\n').map((x) => x.trim()).filter((x) => /^https?:\/\//.test(x)).slice(0, 40);
  const url = str(fd, 'url', 500);
  const image = str(fd, 'image_url', 500);
  return {
    title, slug: slugify(str(fd, 'slug', 200) || title), category: oneOf(str(fd, 'category'), ['web', 'smm'] as const, 'web'),
    client: str(fd, 'client', 200), description: str(fd, 'description', 600), body: str(fd, 'body', 20000),
    url: /^https?:\/\//.test(url) ? url : '', image_url: /^https?:\/\//.test(image) ? image : '', gallery,
    tags: str(fd, 'tags', 300), metric: str(fd, 'metric', 80), featured: fd.get('featured') === 'on',
    position: num(fd, 'position') ?? 0, locale: oneOf(str(fd, 'locale'), ['az', 'en', 'ru', 'de'] as const, 'az'),
  };
};
export async function upsertPortfolio(id: string | null, fd: FormData) {
  const r = await upsert('portfolio_items', id, fd, portfolioB, ['/admin/portfolio']);
  if (r.ok) revalidatePath('/', 'layout');
  return r;
}
export async function destroyPortfolio(id: string) {
  const r = await destroy('portfolio_items', id, ['/admin/portfolio']);
  if (r.ok) revalidatePath('/', 'layout');
  return r;
}
