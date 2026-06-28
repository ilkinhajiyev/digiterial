'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveSettings } from '@/lib/actions/settings';
import type { SiteSettings } from '@/lib/data/settings';

interface Props { current: SiteSettings }

export default function SettingsForm({ current }: Props) {
  const router = useRouter();
  const [data, setData] = useState<SiteSettings>(current);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function set(key: keyof SiteSettings, val: string) {
    setData(d => ({ ...d, [key]: val }));
  }
  function setSoc(key: keyof SiteSettings['social'], val: string) {
    setData(d => ({ ...d, social: { ...d.social, [key]: val } }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setMsg(null);
    try {
      const r = await saveSettings(data);
      setMsg(r.ok
        ? { ok: true, text: '✓ Yadda saxlanıldı — sayt yenilənir…' }
        : { ok: false, text: r.error || 'Xəta baş verdi.' }
      );
      if (r.ok) router.refresh();
    } catch (ex: any) {
      setMsg({ ok: false, text: ex?.message || 'Gözlənilməz xəta.' });
    } finally {
      setLoading(false);
    }
  }

  const inp = [
    'w-full bg-[#0c0c0c] border border-white/15 rounded-lg px-3 py-2.5',
    'text-white text-sm outline-none transition',
    'focus:border-brand focus:ring-1 focus:ring-brand/20',
    'disabled:opacity-40',
  ].join(' ');
  const lbl = 'font-mono text-[.62rem] uppercase text-white/45 block mb-1.5';
  const card = 'bg-[#121212] border border-white/10 rounded-2xl p-5 mb-4';

  return (
    <form onSubmit={save} className="max-w-xl">
      {/* Əsas məlumatlar */}
      <div className={card}>
        <h3 className="font-display font-bold text-base mb-4">Əsas məlumatlar</h3>
        <div className="grid gap-3">
          <div>
            <label className={lbl}>Brend adı</label>
            <input className={inp} value={data.brand} disabled={loading}
              onChange={e => set('brand', e.target.value)} placeholder="Digiterial" />
          </div>
          <div>
            <label className={lbl}>Email</label>
            <input className={inp} type="email" value={data.email} disabled={loading}
              onChange={e => set('email', e.target.value)} placeholder="salam@digiterial.com" />
          </div>
          <div>
            <label className={lbl}>Telefon</label>
            <input className={inp} value={data.phone} disabled={loading}
              onChange={e => set('phone', e.target.value)} placeholder="+994 60 499 63 40" />
          </div>
          <div>
            <label className={lbl}>WhatsApp nömrəsi (yalnız rəqəm, ölkə kodu ilə)</label>
            <input className={inp} value={data.whatsapp ?? ''} disabled={loading}
              onChange={e => set('whatsapp', e.target.value)} placeholder="994604996340" />
            <p className="font-mono text-[.6rem] text-white/30 mt-1">Nümunə: 994604996340 — saytdakı WhatsApp düyməsi bu nömrəyə yönlənir</p>
          </div>
        </div>
      </div>

      {/* Sosial media */}
      <div className={card}>
        <h3 className="font-display font-bold text-base mb-4">Sosial media linkləri</h3>
        <div className="grid gap-3">
          {([
            ['instagram', 'Instagram URL'],
            ['linkedin',  'LinkedIn URL'],
            ['tiktok',    'TikTok URL'],
            ['facebook',  'Facebook URL'],
          ] as const).map(([key, ltext]) => (
            <div key={key}>
              <label className={lbl}>{ltext}</label>
              <input className={inp} value={data.social[key] ?? ''} disabled={loading}
                onChange={e => setSoc(key, e.target.value)} placeholder="https://" />
            </div>
          ))}
        </div>
      </div>

      {/* Xəta / uğur mesajı */}
      {msg && (
        <div className={`rounded-lg px-4 py-3 text-sm mb-4 ${msg.ok
          ? 'bg-brand/10 border border-brand/30 text-brand'
          : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
          {msg.text}
        </div>
      )}

      {/* Submit */}
      <button type="submit" disabled={loading}
        className="flex items-center gap-2 bg-brand text-ink font-semibold text-sm rounded-lg px-5 py-2.5 hover:opacity-90 active:scale-[.97] transition disabled:opacity-60">
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity=".3" strokeWidth="2" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Saxlanır…
          </>
        ) : '💾 Yadda saxla'}
      </button>
    </form>
  );
}
