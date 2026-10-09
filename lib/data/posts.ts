import { cache } from 'react';
import { createServiceClient } from '@/lib/supabase/service';
import { articlesFor, articleBySlug } from '@/lib/data/articles';

export type Post = {
  id: string; title: string; slug: string; locale: string; excerpt?: string; body?: string; cover_url?: string;
  keyword?: string; published_at?: string; created_at: string;
  category?: string; group?: string; metaTitle?: string; faq?: { q: string; a: string }[]; static?: boolean;
};

const hasDb = () => !!(process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL);

const fromArticle = (a: ReturnType<typeof articleBySlug> & {}): Post => ({
  id: `static-${a.slug}`, title: a.title, slug: a.slug, locale: a.locale, excerpt: a.excerpt, body: a.body,
  keyword: a.keyword, published_at: a.date, created_at: a.date, category: a.category, group: a.group,
  metaTitle: a.metaTitle, faq: a.faq, static: true,
});

async function dbPosts(locale: string, limit: number): Promise<Post[]> {
  if (!hasDb()) return [];
  try {
    const { data, error } = await createServiceClient().from('content_posts')
      .select('id,title,slug,locale,excerpt,cover_url,keyword,published_at,created_at')
      .eq('status', 'published').eq('locale', locale)
      .order('published_at', { ascending: false, nullsFirst: false }).limit(limit);
    if (error) { console.error('[posts]', error.message); return []; }
    return (data as Post[]) || [];
  } catch { return []; }
}

/** Admin paneldən əlavə edilən yazılar + saytla gələn hazır məqalələr. */
export const getPosts = cache(async (locale: string, limit = 60): Promise<Post[]> => {
  const db = await dbPosts(locale, limit);
  const seen = new Set(db.map((p) => p.slug));
  const st = articlesFor(locale).filter((a) => !seen.has(a.slug)).map(fromArticle);
  return [...db, ...st]
    .sort((a, b) => String(b.published_at || b.created_at).localeCompare(String(a.published_at || a.created_at)))
    .slice(0, limit);
});

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  if (hasDb()) {
    try {
      const { data } = await createServiceClient().from('content_posts').select('*')
        .eq('slug', slug).eq('status', 'published').maybeSingle();
      if (data) return data as Post;
    } catch { /* statik məqalələrə keç */ }
  }
  const a = articleBySlug(slug);
  return a ? fromArticle(a) : null;
});

export const readingMinutes = (text = '') => Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200));
