'use server';
import { createServiceClient } from '@/lib/supabase/service';
import { requireAdmin } from '@/lib/security/admin';

const BUCKET = 'portfolio';
const ALLOWED_IMAGES: Record<string, { ext: string; matches: (bytes: Uint8Array) => boolean }> = {
  'image/jpeg': { ext: 'jpg', matches: b => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  'image/png': { ext: 'png', matches: b => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  'image/webp': { ext: 'webp', matches: b => String.fromCharCode(...b.slice(0, 4)) === 'RIFF' && String.fromCharCode(...b.slice(8, 12)) === 'WEBP' },
};

// Şəkli Supabase Storage-a yüklə, public URL qaytar
export async function uploadImage(formData: FormData) {
  try {
    await requireAdmin();
    const file = formData.get('file') as File;
    if (!file || file.size === 0) {
      return { ok: false, error: 'Fayl seçilməyib' };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { ok: false, error: 'Fayl 5MB-dan böyükdür' };
    }
    const allowed = ALLOWED_IMAGES[file.type];
    if (!allowed) return { ok: false, error: 'Yalnız JPG, PNG və ya WEBP şəkli yükləyin' };

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!allowed.matches(buffer.subarray(0, 16))) return { ok: false, error: 'Faylın məzmunu şəkil formatına uyğun deyil' };

    const sb = createServiceClient();

    const name = `${crypto.randomUUID()}.${allowed.ext}`;

    const { error } = await sb.storage
      .from(BUCKET)
      .upload(name, buffer, { contentType: file.type, upsert: false });

    if (error) {
      return { ok: false, error: 'Şəkil yüklənmədi' };
    }

    const { data } = sb.storage.from(BUCKET).getPublicUrl(name);
    return { ok: true, url: data.publicUrl };
  } catch (ex: any) {
    return { ok: false, error: ex?.message === 'UNAUTHORIZED' || ex?.message === 'FORBIDDEN' ? 'Bu əməliyyat üçün icazəniz yoxdur.' : 'Yükləmə xətası' };
  }
}
