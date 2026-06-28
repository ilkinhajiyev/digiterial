'use server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/service';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  message: z.string().optional(),
});

export async function submitContact(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: 'Məlumatları yoxlayın.' };
  const d = parsed.data;
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const sb = createServiceClient();
      await sb.from('leads').insert({
        name: d.name, email: d.email, company: d.company, message: d.message,
        stage: 'new', source: 'organic',
      });
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'Xəta baş verdi.' };
  }
}
