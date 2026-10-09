import { SITE_URL } from '@/lib/seo';

// "<" simvolu escape olunur — JSON içində </script> ilə injection-un qarşısı alınır
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export function orgLd(s: { brand: string; email: string; phone: string; address?: string; social: Record<string, string | undefined>; logoUrl?: string }) {
  return {
    '@context': 'https://schema.org', '@type': 'ProfessionalService', name: s.brand, url: SITE_URL, priceRange: '₼₼',
    description: 'Digital marketing agency in Baku: website development, SEO, Google & Meta Ads, social media and branding.',
    knowsAbout: ['Website development', 'SEO', 'Google Ads', 'Meta Ads', 'Social media marketing', 'Branding', 'UI/UX design'],
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '10:00', closes: '18:00' }],
    email: s.email, telephone: s.phone.replace(/\s/g, ''), image: `${SITE_URL}/og-kinetic.png`,
    logo: s.logoUrl || undefined,
    address: { '@type': 'PostalAddress', addressLocality: 'Baku', addressCountry: 'AZ', streetAddress: s.address || undefined },
    areaServed: ['AZ'], sameAs: Object.values(s.social).filter(Boolean),
  };
}
