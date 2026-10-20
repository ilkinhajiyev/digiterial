import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Admin — Digiterial', template: '%s | Admin' },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <body className="bg-ink text-white">{children}</body>
    </html>
  );
}
