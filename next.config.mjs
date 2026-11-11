import path from 'node:path';
import { fileURLToPath } from 'node:url';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
const root = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hostinger-də layihə qovluğu kök kimi qəbul edilsin (yuxarı qovluqlardakı lockfile-lara baxılmasın)
  outputFileTracingRoot: root,
  poweredByHeader: false,
  compress: true,
  async redirects() {
    const rules = [
      ['/istilikvesesizolyasiyasi', '/kataloq/istilik-ses'],
      ['/berkizolyasixps', '/kataloq/xps'],
      ['/berkizolyasiyaxps', '/kataloq/xps'],
      ['/suizolyasiyasi', '/kataloq/bitum-rulon'],
      ['/mayeizolyasiyaveaksesuarlar', '/kataloq/maye-aksesuar'],
      ['/services01', '/xidmetler'],
      ['/services02', '/xidmetler'],
      ['/sertifkat', '/sertifikatlar'],
      ['/appeal', '/contact'],
      ['/mehsullar', '/kataloq'],
    ];
    return rules.map(([source, destination]) => ({ source, destination, statusCode: 301 }));
  },
  experimental: {
    serverActions: { bodySizeLimit: '8mb' },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

export default withNextIntl(nextConfig);
