import type { Metadata } from 'next';
import { fontVars } from '@/components/root';
import '@fontsource-variable/geist/wght.css';
import '../globals.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { default: 'Admin — SOCHİ', template: '%s | SOCHİ admin' },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" className={fontVars}>
      <body className="bg-[#F6F7F9] text-[#1C1F24]">{children}</body>
    </html>
  );
}
