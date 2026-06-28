'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/actions/auth';

export default function Login() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState('');
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(async () => { const r = await signIn(fd); if (r?.error) setErr(r.error); else router.push('/admin'); });
  }
  const inp = 'w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-white outline-none focus:border-brand';
  return (
    <div className="min-h-screen bg-ink text-white flex items-center justify-center p-6 font-body">
      <form onSubmit={onSubmit} className="w-full max-w-sm">
        <div className="font-display font-bold text-2xl mb-1 flex items-center">Digiterial<span className="w-2 h-2 rounded-full bg-brand ml-1" /><span className="ml-auto font-mono text-xs text-mut-d">OS</span></div>
        <p className="text-mut-d text-sm mb-6">İdarəetmə panelinə giriş</p>
        {err && <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">{err}</div>}
        <label className="font-mono text-xs uppercase text-mut-d block mb-2">Email</label>
        <input name="email" type="email" required className={inp + ' mb-4'} />
        <label className="font-mono text-xs uppercase text-mut-d block mb-2">Şifrə</label>
        <input name="password" type="password" required className={inp + ' mb-6'} />
        <button disabled={pending} className="w-full bg-brand text-ink font-semibold rounded-xl py-3 disabled:opacity-60">{pending ? 'Giriş…' : 'Daxil ol'}</button>
        <p className="text-mut-d text-xs mt-4">İstifadəçi Supabase Studio → Authentication-dan yaradılır.</p>
      </form>
    </div>
  );
}
