'use client';
import { useRef, useState, useTransition } from 'react';
import { savePage } from '@/lib/actions/pages';

/* ---- contentEditable (mount-only init → kursor tullanmır) ---- */
function Editable({ value, onChange, className, tag = 'div', edit }: { value: string; onChange: (v: string) => void; className?: string; tag?: any; edit: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const Tag: any = tag;
  return (
    <Tag ref={(el: HTMLElement) => { if (el && el.innerText !== value && document.activeElement !== el) el.innerText = value; }}
      className={`${className || ''} ${edit ? 'outline-none focus:bg-brand/5 focus:ring-1 focus:ring-brand/50 rounded px-0.5 hover:ring-1 hover:ring-brand/30' : ''}`}
      contentEditable={edit} suppressContentEditableWarning
      onInput={(e: any) => onChange(e.currentTarget.innerText)} />
  );
}

const DEFAULTS: Record<string, any> = {
  hero: { eyebrow: 'Etiket', h1: 'Yeni başlıq buraya.', lead: 'Alt mətn.', b1: 'Düymə 1', b2: 'Düymə 2' },
  band: { label: 'Etiket', big: 'Böyük ifadə.', h3: 'Alt başlıq.', p: 'Mətn.' },
  stats: { label: 'Statistika', statement: 'İfadə.', items: [{ v: '100', l: 'Etiket' }], receipt: '' },
  testimonials: { label: 'Rəylər', items: [{ q: 'Rəy mətni.', by: 'Ad · Şirkət' }] },
  cards: { label: 'Etiket', heading: 'Başlıq.', items: [{ h: 'Kart', p: 'Mətn.' }] },
  faq: { label: 'FAQ', items: [{ q: 'Sual?', a: 'Cavab.' }] },
  cta: { h2: 'Çağırış başlığı?', p: 'Alt mətn.', b1: 'Düymə' },
  marquee: { items: ['VEB', 'SEO', 'REKLAM'] },
  clients: { label: 'Müştərilər', items: ['Müştəri A', 'Müştəri B'] },
  richtext: { h: 'Başlıq', p: 'Mətn buraya...' },
  services: { label: 'Xidmətlər', heading: 'Hər şey bir dam altında.' },
};
const PALETTE: [string, string][] = [['hero', 'Hero'], ['band', 'Editorial band'], ['services', 'Xidmət sıraları'], ['stats', 'Statistika'], ['cards', 'Kartlar'], ['testimonials', 'Rəylər'], ['faq', 'FAQ'], ['cta', 'CTA band'], ['marquee', 'Marquee zolaq'], ['clients', 'Müştəri marquee'], ['richtext', 'Mətn bloku']];

export default function VisualBuilder({ initial }: { initial: { seo_title: string; slug: string; meta_desc: string; blocks: any[] } }) {
  const [blocks, setBlocks] = useState<any[]>(() => initial.blocks.map((b, i) => ({ _id: 'b' + i + Date.now(), ...b })));
  const [seo, setSeo] = useState({ seo_title: initial.seo_title, slug: initial.slug, meta_desc: initial.meta_desc });
  const [accent, setAccent] = useState('#F1E500');
  const [edit, setEdit] = useState(true);
  const [device, setDevice] = useState<'full' | 'tablet' | 'mobile'>('full');
  const [palette, setPalette] = useState(false);
  const [msg, setMsg] = useState('');
  const [pending, start] = useTransition();

  const setP = (i: number, k: string, v: any) => setBlocks((bs) => bs.map((b, idx) => idx === i ? { ...b, props: { ...b.props, [k]: v } } : b));
  const setItem = (i: number, ii: number, k: string, v: any) => setBlocks((bs) => bs.map((b, idx) => { if (idx !== i) return b; const items = b.props.items.map((it: any, j: number) => j === ii ? { ...it, [k]: v } : it); return { ...b, props: { ...b.props, items } }; }));
  const addItem = (i: number, tpl: any) => setBlocks((bs) => bs.map((b, idx) => idx === i ? { ...b, props: { ...b.props, items: [...(b.props.items || []), tpl] } } : b));
  const delItem = (i: number, ii: number) => setBlocks((bs) => bs.map((b, idx) => idx === i ? { ...b, props: { ...b.props, items: b.props.items.filter((_: any, j: number) => j !== ii) } } : b));
  const move = (i: number, d: number) => setBlocks((bs) => { const j = i + d; if (j < 0 || j >= bs.length) return bs; const c = [...bs]; [c[i], c[j]] = [c[j], c[i]]; return c; });
  const dup = (i: number) => setBlocks((bs) => { const c = [...bs]; c.splice(i + 1, 0, { ...JSON.parse(JSON.stringify(bs[i])), _id: 'b' + Date.now() }); return c; });
  const del = (i: number) => { if (confirm('Bloku sil?')) setBlocks((bs) => bs.filter((_, idx) => idx !== i)); };
  const add = (type: string) => { setBlocks((bs) => [...bs, { _id: 'b' + Date.now(), type, props: JSON.parse(JSON.stringify(DEFAULTS[type] || {})) }]); setPalette(false); };

  function save() { start(async () => { const clean = blocks.map(({ _id, ...b }) => b); const r = await savePage('home', 'az', clean, seo); setMsg(r.ok ? '✓ Saytda yeniləndi' : '⚠ ' + (r.error || 'Xəta')); setTimeout(() => setMsg(''), 2500); }); }
  function exportJson() { const clean = blocks.map(({ _id, ...b }) => b); const blob = new Blob([JSON.stringify({ key: 'home', seo, blocks: clean }, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'home-page.json'; a.click(); }

  const seg = 'text-sm px-3 py-1.5 rounded-lg';
  const dw = device === 'full' ? '100%' : device === 'tablet' ? '820px' : '390px';

  const Tools = (i: number) => edit && (
    <div className="absolute top-2 right-2 hidden group-hover:flex gap-1 z-20">
      {[['↑', () => move(i, -1)], ['↓', () => move(i, 1)], ['⧉', () => dup(i)], ['✕', () => del(i)]].map(([t, fn]: any, k) => (
        <button key={k} onClick={fn} className="w-7 h-7 rounded-md bg-ink/90 border border-white/20 text-white text-xs hover:bg-brand hover:text-ink">{t}</button>
      ))}
    </div>
  );
  const addBtn = (i: number, tpl: any, label: string) => edit && (
    <button onClick={() => addItem(i, tpl)} className="mt-3 text-xs font-mono border border-dashed border-brand/50 text-brand rounded-full px-3 py-1.5">+ {label}</button>
  );
  const delBtn = (fn: () => void) => edit && <button onClick={fn} className="absolute top-1 right-1 w-5 h-5 rounded bg-ink/80 border border-white/20 text-red-400 text-[.6rem] z-10">✕</button>;

  function renderBlock(b: any, i: number) {
    const p = b.props || {};
    const E = (k: string, tag: string, cls: string) => <Editable edit={edit} value={p[k] ?? ''} onChange={(v) => setP(i, k, v)} tag={tag} className={cls} />;
    let inner = null;
    if (b.type === 'hero') inner = (<div className="py-16 px-8"><div className="text-brand font-mono text-xs uppercase tracking-widest mb-4">{E('eyebrow', 'span', '')}</div>{E('h1', 'h1', 'font-display font-bold text-4xl md:text-5xl leading-tight max-w-[18ch]')}{E('lead', 'p', 'text-mut-d mt-4 max-w-[52ch]')}<div className="flex gap-3 mt-6">{E('b1', 'span', 'bg-brand text-ink rounded-full px-5 py-2.5 font-semibold')}{E('b2', 'span', 'border border-white/30 rounded-full px-5 py-2.5')}</div></div>);
    else if (b.type === 'band') inner = (<div className="py-14 px-8"><div className="elbl">{E('label', 'span', '')}</div>{E('big', 'div', 'font-display font-bold text-4xl mt-5 max-w-[15ch]')}<div className="grid md:grid-cols-2 gap-8 mt-8">{E('h3', 'h3', 'font-display font-bold text-2xl')}{E('p', 'p', 'text-mut-d')}</div></div>);
    else if (b.type === 'services') inner = (<div className="py-14 px-8 bg-paper text-ink"><div className="elbl text-ink/60">{E('label', 'span', '')}</div>{E('heading', 'h2', 'font-display font-bold text-3xl mt-3')}<p className="text-ink/50 text-sm mt-4 italic">(Xidmət sıraları kodda services.ts-dən gəlir — başlıqları burada redaktə edin)</p></div>);
    else if (b.type === 'stats') inner = (<div className="py-14 px-8"><div className="elbl">{E('label', 'span', '')}</div>{E('statement', 'div', 'font-display font-bold text-3xl my-4 max-w-[18ch]')}<div className="grid grid-cols-2 md:grid-cols-4 gap-4">{(p.items || []).map((it: any, ii: number) => (<div key={ii} className="relative border-t border-white/15 pt-3">{delBtn(() => delItem(i, ii))}<Editable edit={edit} value={it.v} onChange={(v) => setItem(i, ii, 'v', v)} tag="b" className="font-display font-bold text-3xl text-brand block" /><Editable edit={edit} value={it.l} onChange={(v) => setItem(i, ii, 'l', v)} tag="span" className="text-mut-d text-sm" /></div>))}</div>{addBtn(i, { v: '0', l: 'Etiket' }, 'statistika')}{E('receipt', 'div', 'font-display font-bold text-2xl mt-6 max-w-[22ch]')}</div>);
    else if (b.type === 'cards') inner = (<div className="py-14 px-8"><div className="elbl">{E('label', 'span', '')}</div>{E('heading', 'h2', 'font-display font-bold text-3xl mt-3 mb-6')}<div className="grid md:grid-cols-3 gap-3">{(p.items || []).map((it: any, ii: number) => (<div key={ii} className="relative border border-white/15 rounded-xl p-4">{delBtn(() => delItem(i, ii))}<Editable edit={edit} value={it.h} onChange={(v) => setItem(i, ii, 'h', v)} tag="h3" className="font-display font-bold text-lg" /><Editable edit={edit} value={it.p} onChange={(v) => setItem(i, ii, 'p', v)} tag="p" className="text-mut-d text-sm mt-2" /></div>))}</div>{addBtn(i, { h: 'Başlıq', p: 'Mətn' }, 'kart')}</div>);
    else if (b.type === 'testimonials') inner = (<div className="py-14 px-8"><div className="elbl">{E('label', 'span', '')}</div><div className="grid md:grid-cols-2 gap-6 mt-6">{(p.items || []).map((it: any, ii: number) => (<div key={ii} className="relative border-t border-white/15 pt-4">{delBtn(() => delItem(i, ii))}<Editable edit={edit} value={it.q} onChange={(v) => setItem(i, ii, 'q', v)} tag="p" className="font-display text-xl" /><Editable edit={edit} value={it.by} onChange={(v) => setItem(i, ii, 'by', v)} tag="div" className="font-mono text-sm text-mut-d mt-2" /></div>))}</div>{addBtn(i, { q: 'Yeni rəy.', by: 'Ad · Şirkət' }, 'rəy')}</div>);
    else if (b.type === 'faq') inner = (<div className="py-14 px-8"><div className="elbl">{E('label', 'span', '')}</div><div className="mt-6 border-t border-white/15">{(p.items || []).map((it: any, ii: number) => (<div key={ii} className="relative border-b border-white/15 py-4">{delBtn(() => delItem(i, ii))}<Editable edit={edit} value={it.q} onChange={(v) => setItem(i, ii, 'q', v)} tag="h4" className="font-display font-bold text-lg" /><Editable edit={edit} value={it.a} onChange={(v) => setItem(i, ii, 'a', v)} tag="p" className="text-mut-d mt-2" /></div>))}</div>{addBtn(i, { q: 'Sual?', a: 'Cavab.' }, 'sual')}</div>);
    else if (b.type === 'cta') inner = (<div className="py-14 px-8 bg-brand text-ink">{E('h2', 'h2', 'font-display font-bold text-4xl max-w-[14ch]')}<div className="flex justify-between items-end gap-4 mt-6 flex-wrap">{E('p', 'p', 'max-w-[40ch]')}{E('b1', 'span', 'bg-ink text-white rounded-full px-5 py-2.5 font-semibold')}</div></div>);
    else if (b.type === 'marquee') inner = (<div className="bg-brand text-ink py-3 px-8 font-mono text-sm uppercase tracking-wide overflow-hidden whitespace-nowrap">{(p.items || []).map((t: string, ii: number) => <span key={ii} className="relative inline-block mr-2">{delBtn(() => delItem(i, ii))}<Editable edit={edit} value={t} onChange={(v) => setBlocks((bs) => bs.map((bb, x) => x === i ? { ...bb, props: { ...bb.props, items: bb.props.items.map((q: string, y: number) => y === ii ? v : q) } } : bb))} tag="span" className="px-2" /> ·</span>)}{addBtn(i, 'YENİ', 'söz')}</div>);
    else if (b.type === 'clients') inner = (<div className="py-10 px-8 border-y border-white/15"><div className="elbl mb-4">{E('label', 'span', '')}</div><div className="flex flex-wrap gap-3">{(p.items || []).map((t: string, ii: number) => <span key={ii} className="relative font-display font-bold text-xl text-white/40">{delBtn(() => delItem(i, ii))}<Editable edit={edit} value={t} onChange={(v) => setBlocks((bs) => bs.map((bb, x) => x === i ? { ...bb, props: { ...bb.props, items: bb.props.items.map((q: string, y: number) => y === ii ? v : q) } } : bb))} tag="span" className="px-1" /></span>)}</div>{addBtn(i, 'Yeni müştəri', 'müştəri')}</div>);
    else if (b.type === 'richtext') inner = (<div className="py-12 px-8">{E('h', 'h3', 'font-display font-bold text-2xl mb-3')}{E('p', 'p', 'text-mut-d max-w-[62ch]')}</div>);
    return (<div key={b._id} className="group relative border-b border-white/10">{Tools(i)}{inner}</div>);
  }

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-5">
      <div>
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <h1 className="font-display text-xl mr-2">Vizual Builder <span className="text-mut text-sm">— Ana səhifə</span></h1>
          <div className="flex-1" />
          <div className="flex bg-[#121212] border border-white/10 rounded-lg p-1">{(['full', 'tablet', 'mobile'] as const).map((d, k) => <button key={d} onClick={() => setDevice(d)} className={`${seg} ${device === d ? 'bg-brand text-ink font-semibold' : 'text-mut'}`}>{['🖥', '▭', '▯'][k]}</button>)}</div>
          <div className="flex bg-[#121212] border border-white/10 rounded-lg p-1"><button onClick={() => setEdit(true)} className={`${seg} ${edit ? 'bg-brand text-ink font-semibold' : 'text-mut'}`}>Redaktə</button><button onClick={() => setEdit(false)} className={`${seg} ${!edit ? 'bg-brand text-ink font-semibold' : 'text-mut'}`}>Önizləmə</button></div>
          <button onClick={exportJson} className="text-sm border border-white/15 rounded-lg px-3 py-2 text-mut hover:text-white">⤓ JSON</button>
          <button onClick={save} disabled={pending} className="bg-brand text-ink font-semibold text-sm rounded-lg px-4 py-2 disabled:opacity-60">💾 Yadda saxla</button>
          {msg && <span className="text-sm text-brand w-full text-right">{msg}</span>}
        </div>
        <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl overflow-hidden">
          <div className="mx-auto transition-all duration-300 bg-ink text-white" style={{ maxWidth: dw }}>
            {blocks.map((b, i) => renderBlock(b, i))}
            {edit && (<div className="p-6 text-center">
              <button onClick={() => setPalette(!palette)} className="border border-dashed border-white/25 text-mut rounded-full px-6 py-2.5 hover:border-brand hover:text-brand">+ Blok əlavə et</button>
              {palette && (<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 max-w-md mx-auto">{PALETTE.map(([t, n]) => <button key={t} onClick={() => add(t)} className="bg-[#161616] border border-white/15 rounded-lg px-3 py-2.5 text-sm text-left hover:border-brand">{n}</button>)}</div>)}
            </div>)}
          </div>
        </div>
      </div>

      {/* INSPECTOR */}
      <aside className="bg-[#121212] border border-white/10 rounded-2xl p-4 h-fit lg:sticky lg:top-20">
        <div className="font-mono text-[.66rem] uppercase text-mut mb-3">Səhifə SEO</div>
        {([['seo_title', 'SEO başlıq'], ['slug', 'Slug'], ['meta_desc', 'Meta təsvir']] as const).map(([k, l]) => (
          <div key={k} className="mb-3"><label className="font-mono text-[.6rem] uppercase text-mut block mb-1.5">{l}</label>
            {k === 'meta_desc' ? <textarea rows={3} value={(seo as any)[k]} onChange={(e) => setSeo({ ...seo, [k]: e.target.value })} className="w-full bg-[#161616] border border-white/15 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-brand" />
              : <input value={(seo as any)[k]} onChange={(e) => setSeo({ ...seo, [k]: e.target.value })} className="w-full bg-[#161616] border border-white/15 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-brand" />}
          </div>
        ))}
        <div className="bg-white rounded-lg p-3 mt-2"><div className="text-[#1a0dab] text-sm truncate">{seo.seo_title || 'Başlıq'}</div><div className="text-[#006621] text-xs">digiterial.com{seo.slug}</div><div className="text-[#444] text-xs line-clamp-2">{seo.meta_desc || 'Meta təsvir...'}</div></div>
        <div className="font-mono text-[.66rem] uppercase text-mut mt-6 mb-3">Tema</div>
        <div className="flex items-center gap-3"><input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="h-9 w-14 bg-[#161616] border border-white/15 rounded-lg" /><span className="text-sm text-mut">Aksent rəng</span></div>
        <p className="text-mut text-xs mt-5 leading-relaxed">Mətnə klikləyib yazın. Blok üstündə <b className="text-white">↑↓⧉✕</b>. Dəyişikliklər <b className="text-brand">Yadda saxla</b> ilə canlı sayta çıxır.</p>
      </aside>
    </div>
  );
}
