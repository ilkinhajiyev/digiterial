import { SITE_URL } from '@/lib/seo';

// "<" simvolu escape olunur — JSON içində </script> ilə injection-un qarşısı alınır
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export function orgLd(s: { brand: string; email: string; phone: string; address?: string; social: Record<string, string | undefined>; logoUrl?: string }) {
  return {
    '@context': 'https://schema.org', '@type': 'ProfessionalService', name: s.brand, url: SITE_URL,
    email: s.email, telephone: s.phone.replace(/\s/g, ''), image: `${SITE_URL}/og-kinetic.png`,
    logo: s.logoUrl || undefined,
    address: { '@type': 'PostalAddress', addressLocality: 'Baku', addressCountry: 'AZ', streetAddress: s.address || undefined },
    areaServed: ['AZ'], sameAs: Object.values(s.social).filter(Boolean),
  };
}
