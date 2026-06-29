import { createServiceClient } from '@/lib/supabase/service';
export type PItem = { id: string; title: string; category: 'web' | 'smm'; slug?: string; client?: string; description?: string; body?: string; url?: string; image_url?: string; gallery?: string[]; tags?: string; metric?: string; featured?: boolean; position?: number };

export const fallbackPortfolio: PItem[] = [
  { id: '1', slug: 'restobaku', title: 'RestoBaku', category: 'web', client: 'Restoran şəbəkəsi', description: 'Onlayn sifariş sistemi ilə korporativ sayt.', body: 'RestoBaku üçün sıfırdan korporativ sayt və onlayn sifariş sistemi qurduq. Məqsəd masaüstü və mobil istifadəçilər üçün sürətli, intuitiv sifariş təcrübəsi idi.\nNəticədə onlayn sifarişlər üç ay ərzində üç dəfə artdı, səhifə yüklənmə sürəti 1.6s-ə düşdü.', url: '#', metric: '+214% sifariş', tags: 'WordPress, WooCommerce, UI/UX', image_url: 'https://picsum.photos/seed/resto1/1200/800', gallery: ['https://picsum.photos/seed/resto1/1200/800', 'https://picsum.photos/seed/resto2/1200/800', 'https://picsum.photos/seed/resto3/1200/800', 'https://picsum.photos/seed/resto4/1200/800'] },
  { id: '2', slug: 'novafinance', title: 'NovaFinance', category: 'web', client: 'Maliyyə şirkəti', description: 'Korporativ sayt + texniki SEO.', body: 'NovaFinance üçün etibar hissi yaradan korporativ sayt dizayn etdik və texniki SEO təməlini qurduq.\nÜzvi trafik altı ayda iki dəfədən çox artdı.', url: '#', metric: '98 PageSpeed', tags: 'Next.js, SEO', image_url: 'https://picsum.photos/seed/nova1/1200/800', gallery: ['https://picsum.photos/seed/nova1/1200/800', 'https://picsum.photos/seed/nova2/1200/800', 'https://picsum.photos/seed/nova3/1200/800'] },
  { id: '3', slug: 'aztravel-smm', title: 'Aztravel SMM', category: 'smm', client: 'Səyahət agentliyi', description: 'Instagram & Meta Ads idarəetməsi.', body: 'Aztravel üçün sosial media strategiyası, kontent prodakşnı və Meta Ads kampaniyalarını idarə etdik.\nReklam xərclərinin gəlirə nisbəti (ROAS) 3.2x-ə çatdı.', url: '#', metric: '3.2x ROAS', tags: 'Meta Ads, Reels, Content', image_url: 'https://picsum.photos/seed/travel1/1200/800', gallery: ['https://picsum.photos/seed/travel1/1200/800', 'https://picsum.photos/seed/travel2/1200/800', 'https://picsum.photos/seed/travel3/1200/800', 'https://picsum.photos/seed/travel4/1200/800'] },
  { id: '4', slug: 'mediclinic-smm', title: 'MediClinic SMM', category: 'smm', client: 'Tibb klinikası', description: 'Kontent plan + icma idarəçiliyi.', body: 'MediClinic üçün aylıq kontent təqvimi, dizayn və icma idarəçiliyi həyata keçirdik.\nİzləyici sayı kampaniya boyunca 58 mindən çox artdı.', url: '#', metric: '+58k izləyici', tags: 'Content, TikTok, Community', image_url: 'https://picsum.photos/seed/medic1/1200/800', gallery: ['https://picsum.photos/seed/medic1/1200/800', 'https://picsum.photos/seed/medic2/1200/800', 'https://picsum.photos/seed/medic3/1200/800'] },
];

export async function getPortfolio(): Promise<PItem[]> {
  try {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!key || !url) return [];
    const sb = createServiceClient();
    const { data, error } = await sb
      .from('portfolio_items')
      .select('*')
      .order('position', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data as any) || [];
  } catch { return []; }
}

export async function getPortfolioItem(key: string): Promise<PItem | null> {
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const sb = createServiceClient();
      const bySlug = await sb.from('portfolio_items').select('*').eq('slug', key).maybeSingle();
      if (bySlug.data) return bySlug.data as any;
      const byId = await sb.from('portfolio_items').select('*').eq('id', key).maybeSingle();
      if (byId.data) return byId.data as any;
    }
  } catch { /* DB yoxdursa fallback */ }
  return fallbackPortfolio.find((p) => p.slug === key || p.id === key) || null;
}
