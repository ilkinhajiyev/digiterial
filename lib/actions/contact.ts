'use server';
import { z } from 'zod';
import { headers } from 'next/headers';
import { createPublicClient } from '@/lib/supabase/service';
import { checkRateLimit, requestIp } from '@/lib/security/rate-limit';

const schema = z.object({
  name:    z.string().trim().min(2, 'Ad ən az 2 hərf olmalıdır').max(100),
  email:   z.string().trim().toLowerCase().email('Düzgün email daxil edin').max(254),
  company: z.string().trim().max(160).optional(),
  service: z.enum(['', 'Veb sayt', 'SEO', 'Google & Meta Ads', 'Brendinq & Dizayn', 'SMM', 'AI & Avtomatlaşdırma', 'Digər']).optional(),
  message: z.string().trim().max(3000).optional(),
  website: z.string().max(0),
});

export async function submitContact(formData: FormData) {
  const raw = {
    name:    String(formData.get('name')    || ''),
    email:   String(formData.get('email')   || ''),
    company: String(formData.get('company') || ''),
    service: String(formData.get('service') || ''),
    message: String(formData.get('message') || ''),
    website: String(formData.get('_website') || ''),
  };

  const ip = requestIp(await headers());
  if (!checkRateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)) {
    return { ok: false, code: 'RATE_LIMIT' as const };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, code: 'INVALID' as const };
  }

  const d = parsed.data;

  try {
    const sb = createPublicClient();
    const { error } = await sb.from('leads').insert({
      name:    d.name,
      email:   d.email,
      company: d.company  || null,
      service: d.service  || null,
      message: d.message  || null,
      stage:   'new',
      source:  'organic',
      value:   0,
    });

    if (error) {
      console.error('[contact]', error.code);
      return { ok: false, code: 'SUBMIT_FAILED' as const };
    }

    return { ok: true };
  } catch (ex: any) {
    console.error('[contact] exception:', ex?.message);
    return { ok: false, code: 'SUBMIT_FAILED' as const };
  }
}
