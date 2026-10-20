'use server';
import { z } from 'zod';
import { headers } from 'next/headers';
import { createServiceClient } from '@/lib/supabase/service';

const schema = z.object({
  name:    z.string().trim().min(2, 'name').max(120),
  email:   z.string().trim().email('email').max(200),
  phone:   z.string().trim().max(40).optional(),
  company: z.string().trim().max(200).optional(),
  service: z.string().trim().max(120).optional(),
  budget:  z.string().trim().max(60).optional(),
  message: z.string().trim().max(4000).optional(),
});

export type ContactResult = { ok: true } | { ok: false; code: 'name' | 'email' | 'rate' | 'server' };

// Sadə yaddaş daxili rate-limit (bir server prosesi üçün kifayətdir)
const hits = new Map<string, number[]>();
function limited(key: string, max = 5, windowMs = 10 * 60_000) {
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return list.length > max;
}

async function notify(d: z.infer<typeof schema>) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_EMAIL;
  if (!key || !to) return;
  const esc = (s = '') => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const rows = Object.entries(d).filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td>${esc(String(v)).replace(/\n/g, '<br>')}</td></tr>`).join('');
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || 'Digiterial <onboarding@resend.dev>',
        to: [to], reply_to: d.email,
        subject: `Yeni müraciət: ${d.name}${d.company ? ' · ' + d.company : ''}`,
        html: `<h2>Saytdan yeni müraciət</h2><table>${rows}</table>`,
      }),
      signal: AbortSignal.timeout(6000),
    });
  } catch (e: any) { console.error('[contact] email', e?.message); }
}

export async function submitContact(formData: FormData): Promise<ContactResult> {
  // Honeypot: botlar gizli sahəni doldurur — sakitcə "uğurlu" qaytarırıq
  if (String(formData.get('website') || '').length > 0) return { ok: true };
  // Form 2 saniyədən tez göndərilibsə, çox güman ki botdur
  const started = Number(formData.get('_t') || 0);
  if (started && Date.now() - started < 2000) return { ok: true };

  const h = await headers();
  const ip = (h.get('x-forwarded-for') || '').split(',')[0].trim() || h.get('x-real-ip') || 'unknown';
  if (limited(ip)) return { ok: false, code: 'rate' };

  const g = (k: string) => String(formData.get(k) || '');
  const parsed = schema.safeParse({ name: g('name'), email: g('email'), phone: g('phone'), company: g('company'), service: g('service'), budget: g('budget'), message: g('message') });
  if (!parsed.success) {
    const field = parsed.error.errors[0]?.message;
    return { ok: false, code: field === 'name' ? 'name' : 'email' };
  }
  const d = parsed.data;

  try {
    const { error } = await createServiceClient().from('leads').insert({
      name: d.name, email: d.email, phone: d.phone || null, company: d.company || null,
      service: d.service || null, budget: d.budget || null, message: d.message || null,
      stage: 'new', source: 'organic', value: 0,
    });
    if (error) { console.error('[contact]', error.code, error.message); return { ok: false, code: 'server' }; }
    await notify(d);
    return { ok: true };
  } catch (ex: any) {
    console.error('[contact] exception:', ex?.message);
    return { ok: false, code: 'server' };
  }
}
