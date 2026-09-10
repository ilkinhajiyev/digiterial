export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
export const orgLd = {
  '@context': 'https://schema.org', '@type': 'Organization', name: 'Digiterial',
  url: 'https://digiterial.com', areaServed: 'AZ',
  sameAs: ['https://instagram.com', 'https://linkedin.com'],
};
