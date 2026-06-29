'use server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/service';

const schema = z.object({
  name:    z.string().min(2, 'Ad ən az 2 hərf olmalıdır'),
  email:   z.string().email('Düzgün email daxil edin'),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().optional(),
});

export async function submitContact(formData: FormData) {
  const raw = {
    name:    String(formData.get('name')    || ''),
    email:   String(formData.get('email')   || ''),
    company: String(formData.get('company') || ''),
    service: String(formData.get('service') || ''),
    message: String(formData.get('message') || ''),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message || 'Məlumatları yoxlayın.' };
  }

  const d = parsed.data;

  try {
    const sb = createServiceClient(); // RLS bypass — service key
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
      console.error('[contact]', error.code, error.message);
      return { ok: false, error: `Xəta: ${error.message}` };
    }

    return { ok: true };
  } catch (ex: any) {
    console.error('[contact] exception:', ex?.message);
    return { ok: false, error: 'Göndərilmədi. Bilavasitə salam@digiterial.com-a yazın.' };
  }
}
