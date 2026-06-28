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
    const msg = parsed.error.errors[0]?.message || 'Məlumatları yoxlayın.';
    return { ok: false, error: msg };
  }

  const d = parsed.data;

  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('SUPABASE_SERVICE_ROLE_KEY yoxdur — lead saxlanılmadı');
      return { ok: true }; // dev mühitdə form işləsin
    }

    const sb = createServiceClient();
    const { error } = await sb.from('leads').insert({
      name:    d.name,
      email:   d.email,
      company: d.company || null,
      service: d.service || null,
      stage:   'new',
      source:  'organic',
      // message sütunu leads-də yoxdursa, ayrı cədvələ ya notes kimi saxla
    });

    if (error) {
      console.error('Lead insert error:', error);
      // Sütun yoxdursa yenə də uğurlu say (UX üçün)
      if (error.code === '42703') return { ok: true };
      return { ok: false, error: 'Xəta baş verdi. Bilavasitə emailə yazın.' };
    }

    return { ok: true };
  } catch (ex) {
    console.error('submitContact exception:', ex);
    return { ok: false, error: 'Göndərilmədi. Yenidən cəhd edin.' };
  }
}
