'use server';
import { createServiceClient } from '@/lib/supabase/service';
import { requireStaff } from '@/lib/auth/guard';

const BUCKET = 'portfolio';
// SVG qəsdən daxil deyil — içində skript ola bilər.
const ALLOWED: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif' };

export async function uploadImage(formData: FormData) {
  try {
    await requireStaff();
    const file = formData.get('file');
    if (!(file instanceof File) || file.size === 0) return { ok: false, error: 'Fayl seçilməyib' };
    if (file.size > 5 * 1024 * 1024) return { ok: false, error: 'Fayl 5MB-dan böyükdür' };
    const ext = ALLOWED[file.type];
    if (!ext) return { ok: false, error: 'Yalnız JPG, PNG, WEBP, GIF və ya AVIF' };

    const buffer = Buffer.from(await file.arrayBuffer());
    // Magic byte yoxlaması — uzantını saxtalaşdırmanın qarşısını alır
    const head = buffer.subarray(0, 12).toString('hex');
    const ok = head.startsWith('ffd8ff') || head.startsWith('89504e47') || head.startsWith('47494638') ||
      (head.startsWith('52494646') && head.slice(16, 24) === '57454250') || head.slice(8, 16) === '66747970';
    if (!ok) return { ok: false, error: 'Fayl şəkil deyil' };

    const name = `${new Date().toISOString().slice(0, 7)}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const sb = createServiceClient();
    const { error } = await sb.storage.from(BUCKET).upload(name, buffer, { contentType: file.type, upsert: false, cacheControl: '31536000' });
    if (error) return { ok: false, error: error.message };
    const { data } = sb.storage.from(BUCKET).getPublicUrl(name);
    return { ok: true, url: data.publicUrl };
  } catch (ex: any) {
    return { ok: false, error: ex?.message || 'Yükləmə xətası' };
  }
}
