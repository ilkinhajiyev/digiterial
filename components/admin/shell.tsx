'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/actions/auth';

const groups = [
  { title: 'İcmal', items: [{ href: '/admin', label: 'İdarə paneli' }] },
  { title: 'Marketinq', items: [
    { href: '/admin/crm', label: 'CRM / Lead-lər' },
    { href: '/admin/campaigns', label: 'Kampaniyalar' },
    { href: '/admin/seo', label: 'SEO' },
    { href: '/admin/analytics', label: 'Statistika' },
    { href: '/admin/content', label: 'Kontent / Bloq' },
    { href: '/admin/social', label: 'Sosial media' },
    { href: '/admin/email', label: 'Email / Avtomatlaşdırma' },
  ] },
  { title: 'İcra', items: [
    { href: '/admin/clients', label: 'Müştərilər' },
    { href: '/admin/portfolio', label: 'Portfolio' },
    { href: '/admin/projects', label: 'Layihələr' },
    { href: '/admin/tasks', label: 'Tapşırıqlar' },
    { href: '/admin/pages', label: 'Sayt / Səhifələr' },
    { href: '/admin/builder', label: 'Vizual Builder' },
    { href: '/admin/domains', label: 'Hostinq / Domenlər' },
    { href: '/admin/tickets', label: 'Dəstək / Tiketlər' },
  ] },
  { title: 'Biznes', items: [
    { href: '/admin/invoices', label: 'Maliyyə / Fakturalar' },
    { href: '/admin/reports', label: 'Hesabatlar' },
    { href: '/admin/team', label: 'Komanda' },
    { href: '/admin/settings', label: 'Tənzimləmələr' },
  ] },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const Side = (
    <aside className="w-[248px] shrink-0 bg-[#121212] border-r border-white/10 p-4 h-screen overflow-y-auto sticky top-0">
      <div className="font-display font-bold text-xl mb-6 flex items-center px-2 pt-1">Digiterial<span className="w-2 h-2 rounded-full bg-brand ml-1" /><span className="ml-auto font-mono text-[.6rem] text-mut">OS</span></div>
      {groups.map((g) => (
        <div key={g.title} className="mb-5">
          <div className="font-mono text-[.6rem] uppercase tracking-widest text-mut/60 px-3 mb-2">{g.title}</div>
          {g.items.map((n) => {
            const on = path === n.href;
            return (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-[9px] text-[.86rem] mb-0.5 ${on ? 'bg-brand text-ink font-semibold' : 'text-mut hover:bg-[#161616] hover:text-white'}`}>
                {n.label}
              </Link>
            );
          })}
        </div>
      ))}
      <button onClick={() => signOut().then(() => router.push('/admin/login'))} className="text-sm text-mut hover:text-white px-3 mt-2">Çıxış</button>
    </aside>
  );

  return (
    <div className="min-h-screen bg-ink text-white font-body flex">
      <div className="hidden lg:block">{Side}</div>
      {open && <div className="lg:hidden fixed inset-0 z-40"><div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} /><div className="absolute left-0 top-0">{Side}</div></div>}
      <div className="flex-1 min-w-0">
        <div className="h-16 border-b border-white/10 flex items-center gap-3 px-4 md:px-6 font-mono text-sm text-mut sticky top-0 bg-ink/90 backdrop-blur z-30">
          <button className="lg:hidden w-9 h-9 border border-white/15 rounded-lg" onClick={() => setOpen(true)}>☰</button>
          Digiterial / <b className="text-white font-medium">İdarəetmə</b>
        </div>
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
