'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { savePage } from '@/lib/actions/pages';
import { saveSettings } from '@/lib/actions/settings';
import type { SiteSettings } from '@/lib/data/settings';

type PageKey = { key: string; label: string; slug: string };

const LOCALES = [
  { code: 'az', label: '🇦🇿 AZ' },
  { code: 'en', label: '🇬🇧 EN' },
  { code: 'ru', label: '🇷🇺 RU' },
];

const BLOCK_TYPES = [
  ['hero', 'Hero'],
  ['band', 'Editorial band'],
  ['services', 'Xidmət sıraları'],
  ['stats', 'Statistika'],
  ['cards', 'Kartlar'],
  ['testimonials', 'Rəylər'],
  ['faq', 'FAQ'],
  ['cta', 'CTA band'],
  ['marquee', 'Marquee'],
  ['clients', 'Müştərilər'],
  ['richtext', 'Mətn bloku'],
];

const DEF: Record<string, any> = {
  hero:         { eyebrow: 'Etiket', h1: 'Başlıq.', lead: 'Alt mətn.', b1: 'Düymə 1', b2: 'Düymə 2' },
  band:         { label: 'Etiket', big: 'Böyük ifadə.', h3: 'Alt başlıq.', p: 'Mətn.' },
  services:     { label: 'Xidmətlər', heading: 'Hər şey bir dam altında.' },
  stats:        { label: 'Statistika', statement: 'İfadə.', items: [{ v: '100+', l: 'Etiket' }], receipt: '' },
  cards:        { label: 'Etiket', heading: 'Başlıq.', items: [{ h: 'Kart', p: 'Mətn.' }] },
  testimonials: { label: 'Rəylər', items: [{ q: 'Rəy mətni.', by: 'Ad · Şirkət' }] },
  faq:          { label: 'FAQ', items: [{ q: 'Sual?', a: 'Cavab.' }] },
  cta:          { h2: 'Çağırış başlığı?', p: 'Alt mətn.', b1: 'Başla' },
  marquee:      { items: ['VEB', 'SEO', 'REKLAM'] },
  clients:      { label: 'Müştərilər', items: ['Müştəri A', 'Müştəri B'] },
  richtext:     { h: 'Başlıq', p: 'Mətn buraya...' },
};

interface Props {
  pageKeys: PageKey[];
  pagesMap: Record<string, Record<string, any>>;
  settings: SiteSettings;
}

export default function FullBuilder({ pageKeys, pagesMap: initMap, settings: initSettings }: Props) {
  const router = useRouter();
  const [curPage, setCurPage]     = useState(pageKeys[0].key);
  const [curLoc, setCurLoc]       = useState('az');
  const [tab, setTab]             = useState<'blocks' | 'seo' | 'header' | 'footer'>('blocks');
  const [pagesMap, setPagesMap]   = useState(initMap);
  const [settings, setSettings]   = useState(initSettings);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState('');
  const [palette, setPalette]     = useState(false);

  const pageData = pagesMap[curPage]?.[curLoc] || { seo_title: '', slug: '', meta_desc: '', blocks: [] };
  const blocks: any[] = pageData.blocks || [];

  // ---------- helpers ----------
  function setPageData(update: Partial<typeof pageData>) {
    setPagesMap(m => ({
      ...m,
      [curPage]: { ...m[curPage], [curLoc]: { ...m[curPage][curLoc], ...update } },
    }));
  }
  function setBlocks(newBlocks: any[]) { setPageData({ blocks: newBlocks }); }
  function setBlock(i: number, b: any) { const nb = [...blocks]; nb[i] = b; setBlocks(nb); }
  function setProp(i: number, k: string, v: any) { setBlock(i, { ...blocks[i], props: { ...blocks[i].props, [k]: v } }); }
  function setItem(i: number, ii: number, k: string, v: any) {
    const items = [...(blocks[i].props.items || [])];
    items[ii] = { ...items[ii], [k]: v };
    setProp(i, 'items', items);
  }
  function addItem(i: number, tpl: any) { setProp(i, 'items', [...(blocks[i].props.items || []), tpl]); }
  function delItem(i: number, ii: number) { setProp(i, 'items', blocks[i].props.items.filter((_: any, j: number) => j !== ii)); }
  function moveBlock(i: number, d: number) {
    const j = i + d; if (j < 0 || j >= blocks.length) return;
    const nb = [...blocks]; [nb[i], nb[j]] = [nb[j], nb[i]]; setBlocks(nb);
  }
  function dupBlock(i: number) { const nb = [...blocks]; nb.splice(i + 1, 0, JSON.parse(JSON.stringify(blocks[i]))); setBlocks(nb); }
  function delBlock(i: number) { if (confirm('Bloku sil?')) setBlocks(blocks.filter((_, j) => j !== i)); }
  function addBlock(type: string) { setBlocks([...blocks, { type, props: JSON.parse(JSON.stringify(DEF[type] || {})) }]); setPalette(false); }

  // ---------- save ----------
  async function handleSave() {
    setSaving(true); setMsg('');
    try {
      const r = await savePage(curPage, curLoc, blocks, {
        seo_title: pageData.seo_title,
        slug: pageData.slug,
        meta_desc: pageData.meta_desc,
      });
      if (r.ok) { setMsg('✓ Saxlanıldı'); router.refresh(); }
      else setMsg('⚠ ' + r.error);
    } catch (e: any) { setMsg('⚠ ' + e.message); }
    finally { setSaving(false); setTimeout(() => setMsg(''), 3000); }
  }

  async function handleSaveSettings() {
    setSaving(true); setMsg('');
    try {
      const r = await saveSettings(settings);
      if (r.ok) { setMsg('✓ Tənzimləmələr saxlanıldı'); router.refresh(); }
      else setMsg('⚠ ' + r.error);
    } catch (e: any) { setMsg('⚠ ' + e.message); }
    finally { setSaving(false); setTimeout(() => setMsg(''), 3000); }
  }

  // ---------- styles ----------
  const inp  = 'w-full bg-[#0c0c0c] border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-brand';
  const lbl  = 'font-mono text-[.6rem] uppercase text-white/40 block mb-1';
  const tabt = (active: boolean) => `px-3 py-1.5 text-sm rounded-lg cursor-pointer transition ${active ? 'bg-brand text-ink font-semibold' : 'text-white/50 hover:text-white'}`;
  const btn  = 'bg-brand text-ink font-semibold text-sm rounded-lg px-4 py-2 hover:opacity-90 active:scale-[.97] transition disabled:opacity-50';

  // ---------- block editor ----------
  function BlockEditor({ b, i }: { b: any; i: number }) {
    const p = b.props || {};
    const E = (key: string, label: string, multi = false) => (
      <div className="mb-2">
        <label className={lbl}>{label}</label>
        {multi
          ? <textarea rows={2} className={inp} value={p[key] || ''} onChange={e => setProp(i, key, e.target.value)} />
          : <input className={inp} value={p[key] || ''} onChange={e => setProp(i, key, e.target.value)} />}
      </div>
    );

    return (
      <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-4 mb-3 relative">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[.68rem] uppercase text-brand">{b.type}</span>
          <div className="flex gap-1">
            {[['↑', () => moveBlock(i, -1)], ['↓', () => moveBlock(i, 1)], ['⧉', () => dupBlock(i)], ['✕', () => delBlock(i)]].map(([t, fn]: any, k) => (
              <button key={k} onClick={fn}
                className="w-7 h-7 rounded-md bg-white/5 hover:bg-brand/20 hover:text-brand text-white/40 text-xs transition">
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Hero */}
        {b.type === 'hero' && <>{E('eyebrow','Etiket')}{E('h1','H1 başlıq',true)}{E('lead','Alt mətn',true)}{E('b1','Düymə 1')}{E('b2','Düymə 2')}</>}
        {/* Band */}
        {b.type === 'band' && <>{E('label','Etiket')}{E('big','Böyük mətn',true)}{E('h3','H3')}{E('p','Mətn',true)}</>}
        {/* Services */}
        {b.type === 'services' && <>{E('label','Etiket')}{E('heading','Başlıq')}</>}
        {/* Stats */}
        {b.type === 'stats' && <>
          {E('label','Etiket')}{E('statement','İfadə',true)}{E('receipt','Qeyd')}
          <label className={lbl}>Statistika</label>
          {(p.items||[]).map((it: any, ii: number) => (
            <div key={ii} className="flex gap-2 mb-2 items-center">
              <input className={inp} value={it.v||''} onChange={e=>setItem(i,ii,'v',e.target.value)} placeholder="100+" />
              <input className={inp} value={it.l||''} onChange={e=>setItem(i,ii,'l',e.target.value)} placeholder="Etiket" />
              <button onClick={()=>delItem(i,ii)} className="text-red-400 text-xs px-2">✕</button>
            </div>
          ))}
          <button onClick={()=>addItem(i,{v:'0',l:'Etiket'})} className="text-brand text-xs border border-brand/30 rounded-full px-3 py-1 mt-1">+ əlavə et</button>
        </>}
        {/* Cards */}
        {b.type === 'cards' && <>
          {E('label','Etiket')}{E('heading','Başlıq')}
          {(p.items||[]).map((it: any, ii: number) => (
            <div key={ii} className="bg-white/5 rounded-lg p-3 mb-2">
              <div className="flex justify-between mb-1"><span className="font-mono text-[.6rem] text-white/40">Kart {ii+1}</span><button onClick={()=>delItem(i,ii)} className="text-red-400 text-xs">✕</button></div>
              <input className={inp+' mb-1'} value={it.h||''} onChange={e=>setItem(i,ii,'h',e.target.value)} placeholder="Başlıq" />
              <input className={inp} value={it.p||''} onChange={e=>setItem(i,ii,'p',e.target.value)} placeholder="Mətn" />
            </div>
          ))}
          <button onClick={()=>addItem(i,{h:'Kart',p:'Mətn'})} className="text-brand text-xs border border-brand/30 rounded-full px-3 py-1">+ kart</button>
        </>}
        {/* Testimonials */}
        {b.type === 'testimonials' && <>
          {E('label','Etiket')}
          {(p.items||[]).map((it: any, ii: number) => (
            <div key={ii} className="bg-white/5 rounded-lg p-3 mb-2">
              <div className="flex justify-between mb-1"><span className="font-mono text-[.6rem] text-white/40">Rəy {ii+1}</span><button onClick={()=>delItem(i,ii)} className="text-red-400 text-xs">✕</button></div>
              <textarea className={inp+' mb-1'} rows={2} value={it.q||''} onChange={e=>setItem(i,ii,'q',e.target.value)} placeholder="Rəy mətni" />
              <input className={inp} value={it.by||''} onChange={e=>setItem(i,ii,'by',e.target.value)} placeholder="Ad · Şirkət" />
            </div>
          ))}
          <button onClick={()=>addItem(i,{q:'Rəy.',by:'Ad · Şirkət'})} className="text-brand text-xs border border-brand/30 rounded-full px-3 py-1">+ rəy</button>
        </>}
        {/* FAQ */}
        {b.type === 'faq' && <>
          {E('label','Etiket')}
          {(p.items||[]).map((it: any, ii: number) => (
            <div key={ii} className="bg-white/5 rounded-lg p-3 mb-2">
              <div className="flex justify-between mb-1"><span className="font-mono text-[.6rem] text-white/40">Sual {ii+1}</span><button onClick={()=>delItem(i,ii)} className="text-red-400 text-xs">✕</button></div>
              <input className={inp+' mb-1'} value={it.q||''} onChange={e=>setItem(i,ii,'q',e.target.value)} placeholder="Sual?" />
              <input className={inp} value={it.a||''} onChange={e=>setItem(i,ii,'a',e.target.value)} placeholder="Cavab" />
            </div>
          ))}
          <button onClick={()=>addItem(i,{q:'Sual?',a:'Cavab.'})} className="text-brand text-xs border border-brand/30 rounded-full px-3 py-1">+ sual</button>
        </>}
        {/* CTA */}
        {b.type === 'cta' && <>{E('h2','H2 başlıq',true)}{E('p','Mətn')}{E('b1','Düymə')}</>}
        {/* Marquee */}
        {b.type === 'marquee' && <>
          <label className={lbl}>Elementlər (vergüllə)</label>
          <input className={inp} value={(p.items||[]).join(', ')} onChange={e=>setProp(i,'items',e.target.value.split(',').map((x:string)=>x.trim()).filter(Boolean))} />
        </>}
        {/* Clients */}
        {b.type === 'clients' && <>
          {E('label','Etiket')}
          <label className={lbl}>Müştərilər (vergüllə)</label>
          <input className={inp} value={(p.items||[]).join(', ')} onChange={e=>setProp(i,'items',e.target.value.split(',').map((x:string)=>x.trim()).filter(Boolean))} />
        </>}
        {/* Richtext */}
        {b.type === 'richtext' && <>{E('h','Başlıq')}{E('p','Mətn',true)}</>}
      </div>
    );
  }

  // ---------- render ----------
  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <h1 className="font-display text-xl font-bold mr-2">Vizual Builder</h1>
        <div className="flex-1" />
        {msg && <span className={`text-sm ${msg.startsWith('⚠') ? 'text-red-400' : 'text-brand'}`}>{msg}</span>}
        <button onClick={tab === 'header' || tab === 'footer' ? handleSaveSettings : handleSave}
          disabled={saving} className={btn}>
          {saving ? '💾 Saxlanır…' : '💾 Yadda saxla'}
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4 flex-1">
        {/* LEFT */}
        <div className="space-y-3">
          {/* Səhifə seçimi */}
          <div className="bg-[#121212] border border-white/10 rounded-xl p-3">
            <div className="font-mono text-[.6rem] uppercase text-white/40 mb-2">Səhifə</div>
            <div className="flex flex-wrap gap-1.5">
              {pageKeys.map(pk => (
                <button key={pk.key} onClick={() => { setCurPage(pk.key); setTab('blocks'); }}
                  className={tabt(curPage === pk.key)}>{pk.label}</button>
              ))}
            </div>
          </div>

          {/* Dil + Tab seçimi */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-[#121212] border border-white/10 rounded-xl p-1 gap-1">
              {LOCALES.map(l => (
                <button key={l.code} onClick={() => setCurLoc(l.code)} className={tabt(curLoc === l.code)}>{l.label}</button>
              ))}
            </div>
            <div className="flex bg-[#121212] border border-white/10 rounded-xl p-1 gap-1">
              {[['blocks','Bloklar'],['seo','SEO'],['header','Header'],['footer','Footer']].map(([t,n]) => (
                <button key={t} onClick={() => setTab(t as any)} className={tabt(tab === t)}>{n}</button>
              ))}
            </div>
          </div>

          {/* BLOKLAR */}
          {tab === 'blocks' && (
            <div>
              {blocks.length === 0 && (
                <div className="text-center text-white/25 py-10 font-mono text-sm border border-dashed border-white/10 rounded-xl">
                  Blok yoxdur — aşağıdan əlavə edin
                </div>
              )}
              {blocks.map((b, i) => <BlockEditor key={i} b={b} i={i} />)}
              <div className="mt-3">
                <button onClick={() => setPalette(!palette)}
                  className="w-full border border-dashed border-brand/40 text-brand rounded-xl py-2.5 text-sm hover:bg-brand/5 transition">
                  + Blok əlavə et
                </button>
                {palette && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {BLOCK_TYPES.map(([t, n]) => (
                      <button key={t} onClick={() => addBlock(t)}
                        className="bg-[#0f0f0f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-left hover:border-brand transition">
                        {n}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SEO */}
          {tab === 'seo' && (
            <div className="bg-[#121212] border border-white/10 rounded-xl p-4 space-y-3">
              <h3 className="font-display font-bold text-base mb-2">SEO — {curPage} ({curLoc})</h3>
              <div><label className={lbl}>SEO başlıq (maks 60)</label><input className={inp} value={pageData.seo_title||''} onChange={e=>setPageData({seo_title:e.target.value})} /></div>
              <div><label className={lbl}>Slug (URL)</label><input className={inp} value={pageData.slug||''} onChange={e=>setPageData({slug:e.target.value})} /></div>
              <div><label className={lbl}>Meta təsvir (maks 160)</label><textarea rows={3} className={inp} value={pageData.meta_desc||''} onChange={e=>setPageData({meta_desc:e.target.value})} /></div>
              <div className="bg-white rounded-lg p-3 mt-2">
                <div className="text-[#1a0dab] text-sm truncate">{pageData.seo_title || 'Başlıq'}</div>
                <div className="text-[#006621] text-xs">digiterial.com{pageData.slug}</div>
                <div className="text-[#444] text-xs line-clamp-2">{pageData.meta_desc || 'Meta təsvir...'}</div>
              </div>
            </div>
          )}

          {/* HEADER */}
          {tab === 'header' && (
            <div className="bg-[#121212] border border-white/10 rounded-xl p-4 space-y-3">
              <h3 className="font-display font-bold text-base mb-2">Header tənzimləmələri</h3>
              <div><label className={lbl}>Brend adı</label><input className={inp} value={settings.brand||''} onChange={e=>setSettings({...settings,brand:e.target.value})} /></div>
              <div><label className={lbl}>CTA düymə mətni (AZ)</label><input className={inp} defaultValue="Layihə başlat" /></div>
              <div className="pt-2 border-t border-white/10">
                <div className="font-mono text-[.6rem] uppercase text-white/40 mb-2">WhatsApp</div>
                <input className={inp} value={settings.whatsapp||''} onChange={e=>setSettings({...settings,whatsapp:e.target.value})} placeholder="994601234567" />
              </div>
            </div>
          )}

          {/* FOOTER */}
          {tab === 'footer' && (
            <div className="bg-[#121212] border border-white/10 rounded-xl p-4 space-y-3">
              <h3 className="font-display font-bold text-base mb-2">Footer tənzimləmələri</h3>
              <div><label className={lbl}>Email</label><input className={inp} value={settings.email||''} onChange={e=>setSettings({...settings,email:e.target.value})} /></div>
              <div><label className={lbl}>Telefon</label><input className={inp} value={settings.phone||''} onChange={e=>setSettings({...settings,phone:e.target.value})} /></div>
              <div className="pt-2 border-t border-white/10 space-y-2">
                <div className="font-mono text-[.6rem] uppercase text-white/40">Sosial media</div>
                {(['instagram','linkedin','tiktok','facebook'] as const).map(k=>(
                  <div key={k}><label className={lbl}>{k}</label><input className={inp} value={settings.social[k]||''} onChange={e=>setSettings({...settings,social:{...settings.social,[k]:e.target.value}})} placeholder="https://" /></div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — inspektor */}
        <aside className="bg-[#121212] border border-white/10 rounded-2xl p-4 h-fit lg:sticky lg:top-20">
          <div className="font-mono text-[.6rem] uppercase text-white/40 mb-3">Cari kontekst</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-white/40">Səhifə</span><span className="text-brand">{pageKeys.find(p=>p.key===curPage)?.label}</span></div>
            <div className="flex justify-between"><span className="text-white/40">Dil</span><span className="text-brand">{curLoc.toUpperCase()}</span></div>
            <div className="flex justify-between"><span className="text-white/40">Blok sayı</span><span>{blocks.length}</span></div>
            <div className="flex justify-between"><span className="text-white/40">Slug</span><span className="font-mono text-xs text-white/50">{pageData.slug}</span></div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="font-mono text-[.6rem] uppercase text-white/40 mb-2">Bütün səhifələr</div>
            {pageKeys.map(pk => (
              <div key={pk.key} className="flex items-center justify-between py-1.5">
                <span className="text-sm text-white/60">{pk.label}</span>
                <div className="flex gap-1">
                  {LOCALES.map(l => (
                    <button key={l.code} onClick={() => { setCurPage(pk.key); setCurLoc(l.code); setTab('blocks'); }}
                      className={`font-mono text-[.6rem] px-1.5 py-0.5 rounded ${curPage===pk.key&&curLoc===l.code ? 'bg-brand text-ink' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
                      {l.code}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-white/30 text-xs leading-relaxed">
              Blokları redaktə edin → <b className="text-white/50">💾 Yadda saxla</b> → dəyişiklik canlı sayta çıxır. Header/Footer tabı settings-ə yazılır.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
