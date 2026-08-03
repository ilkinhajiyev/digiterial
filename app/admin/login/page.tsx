'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/actions/auth';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErr('');
    try {
      const fd = new FormData(e.currentTarget);
      const r = await signIn(fd);
      if (r?.error) { setErr(r.error); return; }
      router.push('/admin');
      router.refresh();
    } catch {
      setErr('Giriş alınmadı. Yenidən cəhd edin.');
    } finally {
      setLoading(false);
    }
  }

  const inp = 'w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-white outline-none focus:border-brand';

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm">
        <div className="font-bold text-2xl mb-1 flex items-center" style={{fontFamily:"'Space Grotesk',sans-serif"}}>
          Digiterial<span className="w-2 h-2 rounded-full bg-[#F1E500] ml-1 inline-block" />
          <span className="ml-auto font-mono text-xs text-white/40">OS</span>
        </div>
        <p className="text-white/40 text-sm mb-6">İdarəetmə panelinə giriş</p>

        {err && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">{err}</div>
        )}

        <label className="font-mono text-[.62rem] uppercase text-white/40 block mb-1.5">Email</label>
        <input name="email" type="email" required disabled={loading} className={inp + ' mb-4'} />

        <label className="font-mono text-[.62rem] uppercase text-white/40 block mb-1.5">Şifrə</label>
        <input name="password" type="password" required disabled={loading} className={inp + ' mb-6'} />

        <button disabled={loading}
          className="w-full bg-[#F1E500] text-[#0B0B0B] font-semibold rounded-xl py-3 disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity=".3" strokeWidth="2"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Giriş…
            </>
          ) : 'Daxil ol'}
        </button>
      </form>
    </div>
  );
}
