'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ExternalLink, LogOut, Menu, X } from 'lucide-react';
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

export default function AdminShell({ children, email, role }: { children: React.ReactNode; email?: string; role?: string }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const Side = (
    <aside className="w-[256px] shrink-0 bg-[#141413] border-r border-white/10 p-4 h-screen overflow-y-auto sticky top-0 flex flex-col">
      <div className="font-display font-semibold text-lg mb-6 flex items-center gap-2 px-2 pt-1 tracking-tight">
        <span className="grid h-7 w-7 place-items-center rounded-[9px] bg-white"><span className="h-2.5 w-2.5 rounded-[3px] bg-brand" /></span>digiterial
        <span className="ml-auto font-mono text-[.6rem] text-mut-d border border-white/15 rounded px-1.5 py-0.5">OS</span>
      </div>
      {groups.map((g) => (
        <div key={g.title} className="mb-5">
          <div className="font-mono text-[.6rem] uppercase tracking-widest text-mut/60 px-3 mb-2">{g.title}</div>
          {g.items.map((n) => {
            const on = n.href === '/admin' ? path === n.href : path.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
                aria-current={on ? 'page' : undefined}
                className={`block px-3 py-2 rounded-[10px] text-[.86rem] mb-0.5 transition ${on ? 'bg-brand text-white font-medium' : 'text-[#B5B0A6] hover:bg-white/[.06] hover:text-white'}`}>
                {n.label}
              </Link>
            );
          })}
        </div>
      ))}
      <div className="mt-auto pt-4 border-t border-white/10">
        {email && <div className="px-3 mb-2"><div className="text-sm text-white truncate">{email}</div><div className="font-mono text-[.62rem] uppercase text-mut-d">{role}</div></div>}
        <a href="/" target="_blank" className="flex items-center gap-2 px-3 py-2 text-sm text-[#B5B0A6] hover:text-white rounded-[10px] hover:bg-white/[.06]"><ExternalLink size={15} />Saytı aç</a>
        <button onClick={() => signOut().then(() => { router.push('/admin/login'); router.refresh(); })} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#B5B0A6] hover:text-white rounded-[10px] hover:bg-white/[.06]"><LogOut size={15} />Çıxış</button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#0E0E0D] text-white font-body flex">
      <div className="hidden lg:block">{Side}</div>
      {open && <div className="lg:hidden fixed inset-0 z-40"><div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} /><div className="absolute left-0 top-0">{Side}</div><button aria-label="Bağla" onClick={() => setOpen(false)} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white"><X size={18} /></button></div>}
      <div className="flex-1 min-w-0">
        <div className="h-16 border-b border-white/10 flex items-center gap-3 px-4 md:px-6 font-mono text-sm text-mut sticky top-0 bg-[#0E0E0D]/90 backdrop-blur z-30">
          <button aria-label="Menyu" className="lg:hidden grid place-items-center w-9 h-9 border border-white/15 rounded-lg text-white" onClick={() => setOpen(true)}><Menu size={17} /></button>
          Digiterial / <b className="text-white font-medium">İdarəetmə</b>
        </div>
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
