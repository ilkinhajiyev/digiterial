import type { Metadata } from 'next';
import { fontVars, baseMetadata } from '@/components/root';
import '../globals.css';
import '../admin.css';

export { viewport } from '@/components/root';

// Admin Supabase tələb edir: build zamanı prerender etmə (env yalnız serverdə olur)
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return { ...(await baseMetadata()), title: { default: 'Admin — Digiterial', template: '%s | Admin' }, robots: 'noindex,nofollow' };
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" className={fontVars} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
