import { cache } from 'react';
import { createServiceClient } from '@/lib/supabase/service';

export type Post = { id: string; title: string; slug: string; locale: string; excerpt?: string; body?: string; cover_url?: string; keyword?: string; published_at?: string; created_at: string };

const hasDb = () => !!(process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL);

export const getPosts = cache(async (locale: string, limit = 50): Promise<Post[]> => {
  if (!hasDb()) return [];
  try {
    const { data, error } = await createServiceClient().from('content_posts')
      .select('id,title,slug,locale,excerpt,cover_url,keyword,published_at,created_at')
      .eq('status', 'published').eq('locale', locale)
      .order('published_at', { ascending: false, nullsFirst: false }).limit(limit);
    if (error) { console.error('[posts]', error.message); return []; }
    return (data as Post[]) || [];
  } catch { return []; }
});

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  if (!hasDb()) return null;
  try {
    const { data } = await createServiceClient().from('content_posts').select('*')
      .eq('slug', slug).eq('status', 'published').maybeSingle();
    return (data as Post) || null;
  } catch { return null; }
});

export const readingMinutes = (text = '') => Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200));
