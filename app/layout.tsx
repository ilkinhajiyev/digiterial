import './globals.css';
import '@/lib/fonts';

// <html> və <body> hər bölmənin öz layout-unda qurulur:
//   app/[locale]/layout.tsx — sayt (lang={locale})
//   app/admin/layout.tsx    — idarəetmə paneli
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
