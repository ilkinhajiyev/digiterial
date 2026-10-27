'use server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/service';

const schema = z.object({
  name:     z.string().trim().min(2, 'Adınızı yazın (ən azı 2 hərf).').max(120),
  email:    z.string().trim().email('Düzgün email ünvanı yazın, məsələn ad@sirket.az.').max(200),
  phone:    z.string().trim().max(40).optional(),
  company:  z.string().trim().max(200).optional(),
  services: z.array(z.string().max(60)).max(10).optional(),
  budget:   z.string().trim().max(60).optional(),
  message:  z.string().trim().max(5000).optional(),
});

export type ContactResult = { ok: true } | { ok: false; error: string; field?: string };

export async function submitContact(formData: FormData): Promise<ContactResult> {
  // Spam tələsi: botlar gizli "website" sahəsini doldurur
  if (String(formData.get('website') || '').trim()) return { ok: true };

  const parsed = schema.safeParse({
    name:     String(formData.get('name') || ''),
    email:    String(formData.get('email') || ''),
    phone:    String(formData.get('phone') || ''),
    company:  String(formData.get('company') || ''),
    services: formData.getAll('services').map(String).filter(Boolean),
    budget:   String(formData.get('budget') || ''),
    message:  String(formData.get('message') || ''),
  });
  if (!parsed.success) {
    const e = parsed.error.errors[0];
    return { ok: false, error: e?.message || 'Məlumatları yoxlayın.', field: String(e?.path?.[0] || '') };
  }
  const d = parsed.data;

  // Telefon və büdcə leads cədvəlində ayrıca sütun olmadığı üçün mesaja əlavə olunur
  const extra = [d.phone && `Telefon: ${d.phone}`, d.budget && `Büdcə: ${d.budget}`].filter(Boolean).join('\n');
  const message = [extra, d.message].filter(Boolean).join('\n\n') || null;

  try {
    const sb = createServiceClient(); // RLS bypass — service key
    const { error } = await sb.from('leads').insert({
      name: d.name,
      email: d.email,
      company: d.company || null,
      service: d.services?.length ? d.services.join(', ') : null,
      message,
      stage: 'new',
      source: 'organic',
      value: 0,
    });
    if (error) {
      console.error('[contact]', error.code, error.message);
      return { ok: false, error: 'Müraciət göndərilmədi. Bir az sonra yenidən cəhd edin və ya info@digiterial.com ünvanına yazın.' };
    }
    return { ok: true };
  } catch (ex) {
    console.error('[contact] exception:', (ex as Error)?.message);
    return { ok: false, error: 'Müraciət göndərilmədi. Birbaşa info@digiterial.com ünvanına yazın.' };
  }
}
