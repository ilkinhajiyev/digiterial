'use server';
import { createServiceClient } from '@/lib/supabase/service';

const BUCKET = 'portfolio';

// Şəkli Supabase Storage-a yüklə, public URL qaytar
export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file || file.size === 0) {
      return { ok: false, error: 'Fayl seçilməyib' };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { ok: false, error: 'Fayl 5MB-dan böyükdür' };
    }
    if (!file.type.startsWith('image/')) {
      return { ok: false, error: 'Yalnız şəkil faylı yükləyin' };
    }

    const sb = createServiceClient();

    // Unikal ad
    const ext = file.name.split('.').pop() || 'jpg';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await sb.storage
      .from(BUCKET)
      .upload(name, buffer, { contentType: file.type, upsert: false });

    if (error) {
      return { ok: false, error: error.message };
    }

    const { data } = sb.storage.from(BUCKET).getPublicUrl(name);
    return { ok: true, url: data.publicUrl };
  } catch (ex: any) {
    return { ok: false, error: ex?.message || 'Yükləmə xətası' };
  }
}
