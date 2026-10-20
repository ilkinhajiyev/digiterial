// Builder və sayt arasında paylaşılan səhifə/blok reyestri (client-safe).
export const PAGE_KEYS = [
  { key: 'home',         label: 'Ana səhifə',   slug: '/' },
  { key: 'services',     label: 'Xidmətlər',    slug: '/xidmetler' },
  { key: 'work',         label: 'İşlər',        slug: '/isler' },
  { key: 'case-studies', label: 'Case Studies', slug: '/case-studies' },
  { key: 'about',        label: 'Haqqımızda',   slug: '/haqqimizda' },
  { key: 'blog',         label: 'Bloq',         slug: '/bloq' },
  { key: 'contact',      label: 'Əlaqə',        slug: '/elaqe' },
] as const;
export type PageKey = (typeof PAGE_KEYS)[number]['key'];

export const BLOCK_TYPES = [
  'hero', 'marquee', 'band', 'services', 'workbench', 'process', 'toolkit', 'principles',
  'work', 'stats', 'cards', 'testimonials', 'clients', 'faq', 'cta', 'richtext',
] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];
export type Block = { type: BlockType | string; props: Record<string, any> };
