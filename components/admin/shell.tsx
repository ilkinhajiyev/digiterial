'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/actions/auth';
import { NAV, ALL, CREATE, findNav } from './nav';
import { I, Avatar, label } from './ui';

export type ShellUser = { name: string; email: string; role: string };
export type ShellCounts = { leads: number; tickets: number; tasks: number };

function Palette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const items = useMemo(() => {
    const all = [
      ...CREATE.map((c) => ({ href: c.href, label: `Yeni ${c.label.toLowerCase()}`, icon: 'plus', group: 'Yarat' })),
      ...ALL.map((n) => ({ href: n.href, label: n.label, icon: n.icon, group: 'Keçid' })),
      { href: '/', label: 'Saytı aç', icon: 'external', group: 'Keçid' },
    ];
    const s = q.trim().toLowerCase();
    return s ? all.filter((x) => x.label.toLowerCase().includes(s)) : all;
  }, [q]);
  useEffect(() => { if (open) { setQ(''); setI(0); setTimeout(() => inputRef.current?.focus(), 10); } }, [open]);
  useEffect(() => { setI(0); }, [q]);
  if (!open) return null;
  const go = (href: string) => { onClose(); if (href === '/') window.open('/', '_blank'); else router.push(href); };
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[12vh] px-4 bg-black/60 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-[560px] bg-panel2 rounded-2xl shadow-pop overflow-hidden animate-fade-up" role="dialog" aria-label="Əmr paneli">
        <div className="flex items-center gap-3 px-4 border-b border-line">
          <I n="search" className="w-4 h-4 text-mut" />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Səhifə və ya əmr axtarın…"
            className="flex-1 bg-transparent py-4 text-[15px] outline-none placeholder:text-mut"
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setI((x) => Math.min(x + 1, items.length - 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setI((x) => Math.max(x - 1, 0)); }
              if (e.key === 'Enter' && items[i]) go(items[i].href);
              if (e.key === 'Escape') onClose();
            }} />
          <kbd className="font-mono text-[11px] text-mut border border-line rounded px-1.5 py-0.5">Esc</kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto adm-scroll p-2">
          {items.length === 0 && <p className="text-mut text-sm px-3 py-6 text-center">Nəticə yoxdur</p>}
          {items.map((it, k) => (
            <button key={it.href + it.label} onMouseEnter={() => setI(k)} onClick={() => go(it.href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-[14px] ${k === i ? 'bg-white/[.07] text-paper' : 'text-mut-d'}`}>
              <I n={it.icon} className="w-4 h-4" /><span className="flex-1">{it.label}</span>
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-mut">{it.group}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminShell({ children, user, counts }: { children: React.ReactNode; user: ShellUser; counts: ShellCounts }) {
  const path = usePathname();
  const router = useRouter();
  const [mobile, setMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [palette, setPalette] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  useEffect(() => { try { setCollapsed(localStorage.getItem('adm-collapsed') === '1'); } catch {} }, []);
  const toggleCollapse = () => setCollapsed((c) => { try { localStorage.setItem('adm-collapsed', c ? '0' : '1'); } catch {} return !c; });
  useEffect(() => { setMobile(false); setCreateOpen(false); setUserOpen(false); }, [path]);
  const onKey = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((p) => !p); }
    if (e.key === 'Escape') { setCreateOpen(false); setUserOpen(false); }
  }, []);
  useEffect(() => { window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [onKey]);

  const current = findNav(path);
  const group = NAV.find((g) => g.items.some((x) => x === current))?.title;
  const mini = collapsed && !mobile;

  const side = (
    <aside className={`${mini ? 'w-[68px]' : 'w-[252px]'} h-full bg-panel border-r border-line flex flex-col transition-[width] duration-300`}>
      <div className={`h-14 flex items-center gap-2.5 ${mini ? 'justify-center' : 'px-4'} border-b border-line shrink-0`}>
        <span className="w-7 h-7 rounded-lg bg-brand text-ink grid place-items-center font-display font-black text-[15px]">d</span>
        {!mini && <div className="leading-tight"><div className="font-display font-bold text-[15px] tracking-tight">digiterial</div><div className="font-mono text-[10px] text-mut uppercase tracking-wider">Agency OS</div></div>}
        {!mini && <button onClick={toggleCollapse} className={`${'ml-auto hidden lg:inline-grid'} place-items-center w-7 h-7 rounded-md text-mut hover:text-paper hover:bg-white/[.06]`} aria-label="Menyunu yığ"><I n="collapse" className="w-4 h-4" /></button>}
      </div>
      <div className={`${mini ? 'px-2' : 'px-3'} pt-3`}>
        <button onClick={() => setPalette(true)} className={`w-full flex items-center gap-2.5 rounded-lg border border-line bg-ink/60 text-mut text-[13px] ${mini ? 'justify-center h-9' : 'px-3 h-9'} hover:text-paper hover:border-white/15 transition`} aria-label="Axtarış">
          <I n="search" className="w-4 h-4" />{!mini && <><span className="flex-1 text-left">Axtar…</span><kbd className="font-mono text-[10.5px] border border-line rounded px-1">⌘K</kbd></>}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto adm-scroll px-2 py-3" aria-label="Admin menyusu">
        {NAV.map((g, gi) => (
          <div key={gi} className="mb-3">
            {g.title && !mini && <div className="px-3 pb-1.5 pt-2 font-mono text-[10.5px] uppercase tracking-[.12em] text-mut/70">{g.title}</div>}
            {g.title && mini && <div className="mx-3 my-2 h-px bg-line" />}
            {g.items.map((n) => {
              const on = current?.href === n.href;
              const c = n.badge ? counts[n.badge] : 0;
              return (
                <Link key={n.href} href={n.href} title={mini ? n.label : undefined} aria-current={on ? 'page' : undefined}
                  className={`relative flex items-center gap-3 rounded-lg ${mini ? 'justify-center h-10' : 'px-3 h-9'} text-[13.5px] mb-0.5 transition ${on ? 'bg-white/[.07] text-paper font-medium' : 'text-mut-d hover:text-paper hover:bg-white/[.04]'}`}>
                  {on && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-brand" />}
                  <I n={n.icon} className={`w-[17px] h-[17px] ${on ? 'text-brand' : ''}`} />
                  {!mini && <span className="flex-1 truncate">{n.label}</span>}
                  {c > 0 && (mini
                    ? <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-brand" />
                    : <span className="adm-num text-[11px] font-semibold rounded-full px-1.5 min-w-[20px] text-center bg-brand/15 text-brand">{c}</span>)}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className={`border-t border-line p-2 relative`}>
        {mini && <button onClick={toggleCollapse} className="w-full h-9 grid place-items-center rounded-lg text-mut hover:text-paper hover:bg-white/[.06] mb-1" aria-label="Menyunu aç"><I n="collapse" className="w-4 h-4 rotate-180" /></button>}
        <button onClick={() => setUserOpen((v) => !v)} className={`w-full flex items-center gap-2.5 rounded-lg p-2 hover:bg-white/[.04] ${mini ? 'justify-center' : ''}`} aria-expanded={userOpen}>
          <Avatar name={user.name} size={30} />
          {!mini && <span className="min-w-0 flex-1 text-left leading-tight"><span className="block text-[13px] font-medium truncate">{user.name}</span><span className="block text-[11.5px] text-mut truncate">{label(user.role)}</span></span>}
        </button>
        {userOpen && (
          <div className={`absolute bottom-[calc(100%+6px)] ${mini ? 'left-2' : 'left-2 right-2'} min-w-[220px] bg-panel2 rounded-xl shadow-pop p-1.5 z-50 animate-fade-up`}>
            <div className="px-3 py-2 border-b border-line mb-1"><div className="text-[13px] font-medium truncate">{user.name}</div><div className="text-[12px] text-mut truncate">{user.email}</div></div>
            <a href="/" target="_blank" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-mut-d hover:bg-white/[.06] hover:text-paper"><I n="external" className="w-4 h-4" />Saytı aç</a>
            <Link href="/admin/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-mut-d hover:bg-white/[.06] hover:text-paper"><I n="settings" className="w-4 h-4" />Parametrlər</Link>
            <button onClick={() => signOut().then(() => { router.push('/admin/login'); router.refresh(); })} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-danger hover:bg-danger/10"><I n="logout" className="w-4 h-4" />Çıxış</button>
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-ink text-paper font-body flex">
      <div className="hidden lg:block sticky top-0 h-screen shrink-0">{side}</div>
      {mobile && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobile(false)} />
          <div className="absolute inset-y-0 left-0 animate-slide-in">{side}</div>
        </div>
      )}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 sticky top-0 z-40 bg-ink/85 backdrop-blur-md border-b border-line flex items-center gap-3 px-4 md:px-6">
          <button className="lg:hidden w-9 h-9 grid place-items-center rounded-lg border border-line text-mut-d" onClick={() => setMobile(true)} aria-label="Menyunu aç"><I n="menu" /></button>
          <nav className="flex items-center gap-2 text-[13.5px] min-w-0" aria-label="Səhifə yolu">
            <Link href="/admin" className="text-mut hover:text-paper hidden sm:inline">Digiterial</Link>
            {group && <><span className="text-white/20 hidden sm:inline">/</span><span className="text-mut hidden sm:inline">{group}</span></>}
            {current && current.href !== '/admin' && <><span className="text-white/20">/</span><span className="font-medium truncate">{current.label}</span></>}
            {current?.href === '/admin' && <><span className="text-white/20 hidden sm:inline">/</span><span className="font-medium">İcmal</span></>}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setPalette(true)} className="hidden md:flex items-center gap-2 h-9 px-3 rounded-lg border border-line bg-panel text-mut text-[13px] hover:text-paper w-[220px]"><I n="search" className="w-4 h-4" /><span className="flex-1 text-left">Axtar…</span><kbd className="font-mono text-[10.5px] border border-line rounded px-1">⌘K</kbd></button>
            <div className="relative">
              <button onClick={() => setCreateOpen((v) => !v)} aria-expanded={createOpen} className="inline-flex items-center gap-1.5 h-9 rounded-lg bg-brand text-ink font-semibold text-[13.5px] px-3 hover:brightness-105"><I n="plus" className="w-4 h-4" sw={2.4} /><span className="hidden sm:inline">Yeni</span></button>
              {createOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] w-56 bg-panel2 rounded-xl shadow-pop p-1.5 z-50 animate-fade-up">
                  {CREATE.map((c) => (
                    <Link key={c.href} href={c.href} onClick={() => setCreateOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] text-mut-d hover:bg-white/[.06] hover:text-paper"><I n={c.icon} className="w-4 h-4" />{c.label}</Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-7 max-w-[1440px] w-full mx-auto animate-fade-up" key={path}>{children}</main>
      </div>
      <Palette open={palette} onClose={() => setPalette(false)} />
    </div>
  );
}
