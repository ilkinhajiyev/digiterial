import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Admin — Digiterial', template: '%s | Admin' },
  robots: 'noindex,nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
