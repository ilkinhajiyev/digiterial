'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/actions/auth';

const nav = [
  { href: '/admin', label: 'İdarə paneli' },
  { href: '/admin/crm', label: 'CRM / Lead-lər' },
  { href: '/admin/clients', label: 'Müştərilər' },
  { href: '/admin/portfolio', label: 'Portfolio' },
  { href: '/admin/projects', label: 'Layihələr' },
  { href: '/admin/invoices', label: 'Fakturalar' },
  { href: '/admin/builder', label: 'Vizual Builder' },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  return (
    <div className="min-h-screen bg-ink text-white font-body grid grid-cols-[248px_1fr]">
      <aside className="bg-[#121212] border-r border-white/10 p-4 sticky top-0 h-screen">
        <div className="font-display font-bold text-xl mb-6 flex items-center px-2 pt-1">Digiterial<span className="w-2 h-2 rounded-full bg-brand ml-1" /><span className="ml-auto font-mono text-[.6rem] text-mut">OS</span></div>
        {nav.map((n) => {
          const on = path === n.href;
          return (
            <Link key={n.href} href={n.href}
              className={`block px-3 py-2.5 rounded-[10px] text-sm mb-1 ${on ? 'bg-brand text-ink font-semibold' : 'text-mut hover:bg-[#161616] hover:text-white'}`}>
              {n.label}
            </Link>
          );
        })}
        <button onClick={() => { signOut().then(() => router.push('/admin/login')); }}
          className="mt-6 text-sm text-mut hover:text-white px-3">Çıxış</button>
      </aside>
      <div>
        <div className="h-16 border-b border-white/10 flex items-center px-6 font-mono text-sm text-mut sticky top-0 bg-ink/90 backdrop-blur z-10">Digiterial / <b className="text-white font-medium ml-1">İdarəetmə</b></div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
