'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { signIn } from '@/lib/actions/auth';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(params.get('e') === 'role' ? 'Bu hesabın admin panelə icazəsi yoxdur. Administratorla əlaqə saxlayın.' : '');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true); setErr('');
    try {
      const r = await signIn(new FormData(e.currentTarget));
      if (r?.error) { setErr(r.error); return; }
      router.push('/admin'); router.refresh();
    } catch {
      setErr('Giriş alınmadı. Yenidən cəhd edin.');
    } finally { setLoading(false); }
  }

  const inp = 'w-full bg-white/[.04] border border-white/15 rounded-xl px-4 py-3.5 text-white outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15';
  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm">
      <div className="mb-10 flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
        <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-white"><span className="h-3 w-3 rounded-[3px] bg-brand" /></span>digiterial
        <span className="ml-auto rounded border border-white/15 px-1.5 py-0.5 font-mono text-[.62rem] text-mut-d">OS</span>
      </div>
      <h1 className="font-display text-2xl font-medium tracking-tight">Xoş gəlmisiniz</h1>
      <p className="mb-8 mt-1 text-sm text-mut-d">İdarəetmə panelinə daxil olun</p>
      {err && <div role="alert" className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{err}</div>}
      <label htmlFor="email" className="mb-2 block text-sm text-[#D8D3C9]">Email</label>
      <input id="email" name="email" type="email" autoComplete="username" required disabled={loading} className={inp + ' mb-5'} />
      <label htmlFor="password" className="mb-2 block text-sm text-[#D8D3C9]">Şifrə</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required disabled={loading} className={inp + ' mb-8'} />
      <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 font-medium text-ink transition hover:bg-white disabled:opacity-60">
        {loading ? <><Loader2 size={17} className="animate-spin" />Giriş…</> : 'Daxil ol'}
      </button>
    </form>
  );
}

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0E0E0D] p-6 text-white">
      <Suspense><LoginForm /></Suspense>
    </div>
  );
}
