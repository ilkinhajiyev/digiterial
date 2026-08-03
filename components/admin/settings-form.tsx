'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveSettings } from '@/lib/actions/settings';
import { ImageField } from '@/components/admin/image-upload';
import type { SiteSettings } from '@/lib/data/settings';

interface Props { current: SiteSettings }

export default function SettingsForm({ current }: Props) {
  const router = useRouter();
  const [data, setData] = useState<SiteSettings>(current);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [tab, setTab] = useState<'general' | 'social' | 'analytics'>('general');

  function set(key: keyof SiteSettings, val: any) {
    setData(d => ({ ...d, [key]: val }));
  }
  function setSoc(key: string, val: string) {
    setData(d => ({ ...d, social: { ...d.social, [key]: val } }));
  }
  function setAn(key: string, val: string) {
    setData(d => ({ ...d, analytics: { ...d.analytics, [key]: val.trim() } }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true); setMsg(null);
    try {
      const r = await saveSettings(data);
      setMsg(r.ok
        ? { ok: true, text: '✓ Yadda saxlanıldı — sayt yenilənir…' }
        : { ok: false, text: r.error || 'Xəta baş verdi.' });
      if (r.ok) router.refresh();
    } catch (ex: any) {
      setMsg({ ok: false, text: ex?.message || 'Gözlənilməz xəta.' });
    } finally { setLoading(false); }
  }

  const inp = 'w-full bg-[#0c0c0c] border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm outline-none transition focus:border-brand disabled:opacity-40';
  const lbl = 'font-mono text-[.62rem] uppercase text-white/45 block mb-1.5';
  const hint = 'text-white/30 text-[.68rem] mt-1';
  const card = 'bg-[#121212] border border-white/10 rounded-2xl p-5 mb-4';
  const tabBtn = (active: boolean) => `px-4 py-2 text-sm rounded-lg transition ${active ? 'bg-brand text-ink font-semibold' : 'text-white/50 hover:text-white bg-white/5'}`;

  return (
    <form onSubmit={save} className="max-w-2xl">
      {/* Tab bar */}
      <div className="flex gap-2 mb-5">
        <button type="button" onClick={() => setTab('general')} className={tabBtn(tab==='general')}>Ümumi</button>
        <button type="button" onClick={() => setTab('social')} className={tabBtn(tab==='social')}>Sosial media</button>
        <button type="button" onClick={() => setTab('analytics')} className={tabBtn(tab==='analytics')}>Analitika & Piksel</button>
      </div>

      {/* ── ÜMUMİ ── */}
      {tab === 'general' && (
        <>
          <div className={card}>
            <h3 className="font-display font-bold text-base mb-4">Loqo</h3>
            <ImageField name="logo" defaultValue={data.logoUrl} />
            {/* ImageField hidden input "logo" yazır — onu state-ə köçürək */}
            <input type="hidden" value={data.logoUrl || ''} readOnly />
            <div className="mt-3">
              <label className={lbl}>Loqo URL (və ya yuxarıdan yüklə)</label>
              <input className={inp} value={data.logoUrl || ''} disabled={loading}
                onChange={e => set('logoUrl', e.target.value)} placeholder="https://...png" />
              <p className={hint}>PNG şəffaf fon tövsiyə olunur. Boş buraxsanız mətn loqo göstərilir.</p>
            </div>
          </div>

          <div className={card}>
            <h3 className="font-display font-bold text-base mb-4">Əsas məlumatlar</h3>
            <div className="grid gap-3">
              <div><label className={lbl}>Brend adı</label>
                <input className={inp} value={data.brand} disabled={loading} onChange={e => set('brand', e.target.value)} /></div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><label className={lbl}>Email</label>
                  <input className={inp} value={data.email} disabled={loading} onChange={e => set('email', e.target.value)} /></div>
                <div><label className={lbl}>Telefon</label>
                  <input className={inp} value={data.phone} disabled={loading} onChange={e => set('phone', e.target.value)} /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><label className={lbl}>WhatsApp (kodla)</label>
                  <input className={inp} value={data.whatsapp || ''} disabled={loading} onChange={e => set('whatsapp', e.target.value)} placeholder="994604996340" /></div>
                <div><label className={lbl}>Ünvan</label>
                  <input className={inp} value={data.address || ''} disabled={loading} onChange={e => set('address', e.target.value)} /></div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── SOSİAL ── */}
      {tab === 'social' && (
        <div className={card}>
          <h3 className="font-display font-bold text-base mb-4">Sosial media linkləri</h3>
          <div className="grid gap-3">
            {([['instagram','Instagram'],['linkedin','LinkedIn'],['tiktok','TikTok'],['facebook','Facebook'],['youtube','YouTube']] as const).map(([k,label]) => (
              <div key={k}>
                <label className={lbl}>{label}</label>
                <input className={inp} value={(data.social as any)[k] || ''} disabled={loading}
                  onChange={e => setSoc(k, e.target.value)} placeholder="https://" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ANALİTİKA ── */}
      {tab === 'analytics' && (
        <>
          <div className={card}>
            <h3 className="font-display font-bold text-base mb-1">İzləmə kodları</h3>
            <p className={hint + ' mb-4'}>Yalnız ID/kod yazın — skriptlər avtomatik qurulur. Boş sahələr yüklənmir.</p>
            <div className="grid gap-3">
              <div>
                <label className={lbl}>Google Analytics 4 (Measurement ID)</label>
                <input className={inp} value={data.analytics.ga4 || ''} disabled={loading}
                  onChange={e => setAn('ga4', e.target.value)} placeholder="G-XXXXXXXXXX" />
                <p className={hint}>analytics.google.com → Admin → Data Streams</p>
              </div>
              <div>
                <label className={lbl}>Google Tag Manager (Container ID)</label>
                <input className={inp} value={data.analytics.gtm || ''} disabled={loading}
                  onChange={e => setAn('gtm', e.target.value)} placeholder="GTM-XXXXXXX" />
              </div>
              <div>
                <label className={lbl}>Meta (Facebook) Pixel ID</label>
                <input className={inp} value={data.analytics.metaPixel || ''} disabled={loading}
                  onChange={e => setAn('metaPixel', e.target.value)} placeholder="1234567890" />
                <p className={hint}>business.facebook.com → Events Manager</p>
              </div>
              <div>
                <label className={lbl}>Yandex Metrica (sayğac ID)</label>
                <input className={inp} value={data.analytics.yandexMetrica || ''} disabled={loading}
                  onChange={e => setAn('yandexMetrica', e.target.value)} placeholder="12345678" />
                <p className={hint}>metrica.yandex.com → sayğac nömrəsi</p>
              </div>
              <div>
                <label className={lbl}>TikTok Pixel ID</label>
                <input className={inp} value={data.analytics.tiktokPixel || ''} disabled={loading}
                  onChange={e => setAn('tiktokPixel', e.target.value)} placeholder="CXXXXXXXXXXXXX" />
              </div>
            </div>
          </div>

          <div className={card}>
            <h3 className="font-display font-bold text-base mb-1">Sayt təsdiqi (Verification)</h3>
            <p className={hint + ' mb-4'}>Axtarış sistemlərində saytı təsdiqləmək üçün.</p>
            <div className="grid gap-3">
              <div>
                <label className={lbl}>Google Search Console kodu</label>
                <input className={inp} value={data.analytics.googleVerification || ''} disabled={loading}
                  onChange={e => setAn('googleVerification', e.target.value)} placeholder="meta content dəyəri" />
              </div>
              <div>
                <label className={lbl}>Yandex Webmaster kodu</label>
                <input className={inp} value={data.analytics.yandexVerification || ''} disabled={loading}
                  onChange={e => setAn('yandexVerification', e.target.value)} placeholder="meta content dəyəri" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Save bar */}
      <div className="flex items-center gap-3 sticky bottom-4 bg-[#0b0b0b]/80 backdrop-blur p-3 rounded-xl border border-white/10">
        <button type="submit" disabled={loading}
          className="bg-brand text-ink font-semibold rounded-lg px-6 py-2.5 disabled:opacity-50 flex items-center gap-2">
          {loading ? 'Saxlanır…' : '💾 Yadda saxla'}
        </button>
        {msg && <span className={`text-sm ${msg.ok ? 'text-brand' : 'text-red-400'}`}>{msg.text}</span>}
      </div>
    </form>
  );
}
