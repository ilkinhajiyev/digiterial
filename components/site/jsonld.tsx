export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
export const orgLd = {
  '@context': 'https://schema.org', '@type': 'Organization', name: 'Digiterial',
  url: 'https://digiterial.com', areaServed: 'AZ',
  sameAs: ['https://instagram.com', 'https://linkedin.com'],
};
