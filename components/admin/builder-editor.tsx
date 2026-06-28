'use client';
import { useState, useTransition } from 'react';
import { savePage } from '@/lib/actions/pages';

export default function BuilderEditor({ initial }: { initial: { key: string; locale: string; seo_title: string; slug: string; meta_desc: string; blocks: any[] } }) {
  const [seo, setSeo] = useState({ seo_title: initial.seo_title, slug: initial.slug, meta_desc: initial.meta_desc });
  const [json, setJson] = useState(JSON.stringify(initial.blocks, null, 2));
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState('');
  function save() {
    let blocks: any[];
    try { blocks = JSON.parse(json); } catch { setMsg('⚠ JSON xətası'); return; }
    start(async () => {
      const r = await savePage(initial.key, initial.locale, blocks, seo);
      setMsg(r.ok ? '✓ Yadda saxlanıldı və sayt yeniləndi' : '⚠ ' + (r.error || 'Xəta'));
    });
  }
  const inp = 'w-full bg-[#161616] border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-brand';
  const lbl = 'font-mono text-[.62rem] uppercase text-mut block mb-1.5';
  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-5">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h1 className="font-display text-2xl">Vizual Builder — “{initial.key}”</h1>
          <div className="flex items-center gap-3">
            {msg && <span className="text-sm text-brand">{msg}</span>}
            <a href="/" target="_blank" className="text-sm text-mut hover:text-white border border-white/15 rounded-lg px-3 py-2">Saytda bax ↗</a>
            <button onClick={save} disabled={pending} className="bg-brand text-ink font-semibold text-sm rounded-lg px-4 py-2 disabled:opacity-60">💾 Yadda saxla</button>
          </div>
        </div>
        <label className={lbl}>Bloklar (JSON)</label>
        <textarea value={json} onChange={(e) => setJson(e.target.value)} spellCheck={false}
          className="w-full h-[60vh] bg-[#0e0e0e] border border-white/15 rounded-xl p-4 font-mono text-xs text-neutral-200 outline-none focus:border-brand leading-relaxed" />
        <p className="text-mut text-xs mt-2">Hər blok: <code>{`{ "type": "hero|band|services|stats|testimonials|cards|faq|cta|richtext", "props": { … } }`}</code></p>
      </div>
      <aside className="bg-[#121212] border border-white/10 rounded-2xl p-4 h-fit">
        <div className="font-mono text-[.66rem] uppercase text-mut mb-3">Səhifə SEO</div>
        <div className="mb-3"><label className={lbl}>SEO başlıq</label><input className={inp} value={seo.seo_title} onChange={(e) => setSeo({ ...seo, seo_title: e.target.value })} /></div>
        <div className="mb-3"><label className={lbl}>Slug</label><input className={inp} value={seo.slug} onChange={(e) => setSeo({ ...seo, slug: e.target.value })} /></div>
        <div className="mb-3"><label className={lbl}>Meta təsvir</label><textarea rows={3} className={inp} value={seo.meta_desc} onChange={(e) => setSeo({ ...seo, meta_desc: e.target.value })} /></div>
        <div className="bg-white rounded-lg p-3 mt-2">
          <div className="text-[#1a0dab] text-sm">{seo.seo_title || 'Başlıq'}</div>
          <div className="text-[#006621] text-xs">digiterial.com{seo.slug}</div>
          <div className="text-[#444] text-xs">{seo.meta_desc || 'Meta təsvir…'}</div>
        </div>
        <p className="text-mut text-xs mt-4">Tam vizual (klik-redaktə) builder HTML prototipdə hazırdır — bu React versiyaya köçürülür (TODO). Hazırda blok JSON + SEO birbaşa DB-yə yazılır.</p>
      </aside>
    </div>
  );
}
