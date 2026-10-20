// Xidmət mətnləri messages/*.json → "svc.<slug>" altındadır (4 dildə).
export const services = [
  { slug: 'veb-saytlar' }, { slug: 'seo' }, { slug: 'reklam' },
  { slug: 'brendinq' }, { slug: 'smm' }, { slug: 'ai-avtomatlasdirma' },
] as const;
export type ServiceSlug = (typeof services)[number]['slug'];
export const getService = (slug: string) => services.find((s) => s.slug === slug);
