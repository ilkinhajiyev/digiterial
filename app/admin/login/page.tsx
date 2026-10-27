'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/actions/auth';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [show, setShow] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true); setErr('');
    try {
      const r = await signIn(new FormData(e.currentTarget));
      if (r?.error) { setErr(r.error === 'Invalid login credentials' ? 'Email və ya şifrə yanlışdır.' : r.error); return; }
      router.push('/admin'); router.refresh();
    } catch { setErr('Giriş alınmadı. Yenidən cəhd edin.'); }
    finally { setLoading(false); }
  }

  const inp = 'w-full bg-panel2 border border-line rounded-xl px-4 py-3 text-[15px] text-paper placeholder:text-white/25 outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/15 disabled:opacity-50';

  return (
    <div className="min-h-screen bg-ink text-paper font-body grid lg:grid-cols-[1.1fr_1fr]">
      <aside className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-line">
        <div className="absolute inset-0 opacity-[.35]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse at 30% 40%,#000 20%,transparent 70%)' }} />
        <div className="absolute -right-40 -top-40 w-[560px] h-[560px] rounded-full" style={{ background: 'radial-gradient(closest-side,rgba(162,255,203,.16),transparent)' }} />
        <div className="absolute -left-20 bottom-[-180px] w-[520px] h-[520px] rounded-full" style={{ background: 'radial-gradient(closest-side,rgba(241,180,58,.14),transparent)' }} />
        <div className="relative flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-brand text-ink grid place-items-center font-display font-black text-lg">d</span>
          <div className="leading-tight"><div className="font-display font-bold text-lg">digiterial</div><div className="font-mono text-[11px] text-mut uppercase tracking-wider">Agency OS</div></div>
        </div>
        <div className="relative max-w-[30ch]">
          <h1 className="font-display font-bold text-[44px] leading-[1.02] tracking-[-0.03em]">Müştərilər, layihələr və satış — <span className="text-mint">bir yerdə.</span></h1>
          <p className="text-mut-d mt-5 text-[15px] leading-relaxed">Pipeline, tapşırıqlar, fakturalar və sayt məzmunu komandanın ortaq iş məkanında.</p>
        </div>
        <div className="relative flex gap-6 text-[12.5px] text-mut">
          <span>Pipeline</span><span>Layihələr</span><span>Fakturalar</span><span>Statistika</span>
        </div>
      </aside>
      <main className="flex items-center justify-center p-6">
        <form onSubmit={onSubmit} className="w-full max-w-[380px]" noValidate>
          <div className="lg:hidden flex items-center gap-2.5 mb-10"><span className="w-8 h-8 rounded-lg bg-brand text-ink grid place-items-center font-display font-black">d</span><span className="font-display font-bold">digiterial</span></div>
          <h2 className="font-display font-bold text-[28px] tracking-[-0.02em]">Daxil olun</h2>
          <p className="text-mut text-sm mt-1.5 mb-8">Komanda hesabınızla idarəetmə panelinə giriş.</p>
          {err && <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-5" role="alert">{err}</div>}
          <label htmlFor="em" className="block text-[13px] font-medium text-mut-d mb-1.5">Email</label>
          <input id="em" name="email" type="email" autoComplete="username" required disabled={loading} placeholder="ad@digiterial.com" className={`${inp} mb-4`} />
          <div className="flex items-center justify-between mb-1.5"><label htmlFor="pw" className="text-[13px] font-medium text-mut-d">Şifrə</label><button type="button" onClick={() => setShow((s) => !s)} className="text-[12.5px] text-mut hover:text-paper">{show ? 'Gizlət' : 'Göstər'}</button></div>
          <input id="pw" name="password" type={show ? 'text' : 'password'} autoComplete="current-password" required disabled={loading} className={`${inp} mb-6`} />
          <button disabled={loading} className="w-full h-12 rounded-xl bg-brand text-ink font-semibold text-[15px] hover:brightness-105 active:scale-[.99] transition disabled:opacity-60">{loading ? 'Yoxlanılır…' : 'Daxil ol'}</button>
          <p className="text-[12.5px] text-mut mt-6 text-center">Hesab yalnız admin tərəfindən yaradılır.</p>
        </form>
      </main>
    </div>
  );
}
