import type { MetadataRoute } from 'next';
import { publicSiteUrl } from '@/lib/catalog/origin';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/sifaris', '/en/sifaris', '/ru/sifaris', '/uploads'] },
    sitemap: `${publicSiteUrl()}/sitemap.xml`,
  };
}
