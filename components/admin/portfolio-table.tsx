'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addPortfolio, editPortfolio, removePortfolio } from '@/lib/actions/portfolio';

type Item = { id: string; title: string; category: 'web' | 'smm'; client?: string; description?: string; url?: string; image_url?: string; tags?: string; metric?: string; featured?: boolean; position?: number };
const CATN: Record<string, string> = { web: 'Veb sayt', smm: 'SMM' };

export default function PortfolioTable({ rows }: { rows: Item[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Item | null>(null);
  const [filter, setFilter] = useState<'all' | 'web' | 'smm'>('all');

  const shown = rows.filter((r) => filter === 'all' || r.category === filter);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(async () => {
      if (edit) await editPortfolio(edit.id, fd); else await addPortfolio(fd);
      setOpen(false); setEdit(null); router.refresh();
    });
  }
  function del(id: string) { if (confirm('Silinsin?')) start(async () => { await removePortfolio(id); router.refresh(); }); }

  const inp = 'w-full bg-[#161616] border border-white/15 rounded-lg px-3 py-2.5 text-white outline-none focus:border-brand text-sm';
  const lbl = 'font-mono text-[.62rem] uppercase text-mut block mb-1.5';
  const tab = (k: 'all' | 'web' | 'smm', t: string) => (
    <button onClick={() => setFilter(k)} className={`text-sm px-3 py-1.5 rounded-lg ${filter === k ? 'bg-brand text-ink font-semibold' : 'text-mut hover:text-white'}`}>{t}</button>
  );

  return (
    <>
      <div className="flex justify-between items-end mb-5 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl">Portfolio</h1>
          <p className="text-mut text-sm">{rows.length} qeyd · Veb {rows.filter(r=>r.category==='web').length} · SMM {rows.filter(r=>r.category==='smm').length}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#121212] border border-white/10 rounded-xl p-1">{tab('all','Hamısı')}{tab('web','Veb sayt')}{tab('smm','SMM')}</div>
          <button onClick={() => { setEdit(null); setOpen(true); }} className="bg-brand text-ink font-semibold text-sm rounded-lg px-4 py-2.5">+ Yeni qeyd</button>
        </div>
      </div>

      <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr>{['', 'Başlıq', 'Kateqoriya', 'Müştəri', 'Metrik', ''].map((h, i) => <th key={i} className="text-left font-mono text-[.66rem] uppercase text-mut font-medium px-4 py-3 border-b border-white/10">{h}</th>)}</tr></thead>
          <tbody>
            {shown.map((it) => (
              <tr key={it.id} className="hover:bg-[#161616]">
                <td className="px-4 py-3 border-b border-white/5 w-14">
                  {it.image_url ? <img src={it.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-white/10" />}
                </td>
                <td className="px-4 py-3 border-b border-white/5 font-medium">{it.title}{it.featured && <span className="ml-2 text-brand text-xs">★</span>}</td>
                <td className="px-4 py-3 border-b border-white/5"><span className="font-mono text-[.7rem] border border-white/15 rounded-full px-2 py-0.5 text-mut">{CATN[it.category]}</span></td>
                <td className="px-4 py-3 border-b border-white/5 text-mut">{it.client}</td>
                <td className="px-4 py-3 border-b border-white/5 font-mono text-mut">{it.metric}</td>
                <td className="px-4 py-3 border-b border-white/5 text-right whitespace-nowrap">
                  <button onClick={() => { setEdit(it); setOpen(true); }} className="text-mut hover:text-brand mr-3">✎</button>
                  <button onClick={() => del(it.id)} className="text-mut hover:text-red-400">🗑</button>
                </td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={6} className="text-center text-mut py-8">Qeyd yoxdur.</td></tr>}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5 overflow-auto" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <form onSubmit={onSubmit} className="bg-[#121212] border border-white/15 rounded-2xl w-full max-w-lg p-6 my-8">
            <h3 className="font-display text-lg mb-4">{edit ? 'Qeydi redaktə et' : 'Yeni portfolio qeydi'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className={lbl}>Başlıq</label><input name="title" defaultValue={edit?.title} required className={inp} placeholder="Layihə adı" /></div>
              <div><label className={lbl}>Kateqoriya</label><select name="category" defaultValue={edit?.category || 'web'} className={inp}><option value="web">Veb sayt</option><option value="smm">SMM</option></select></div>
              <div><label className={lbl}>Müştəri</label><input name="client" defaultValue={edit?.client} className={inp} /></div>
              <div className="col-span-2"><label className={lbl}>Təsvir</label><textarea name="description" defaultValue={edit?.description} rows={2} className={inp} /></div>
              <div><label className={lbl}>Sayt / link</label><input name="url" defaultValue={edit?.url} className={inp} placeholder="https://" /></div>
              <div><label className={lbl}>Şəkil URL</label><input name="image_url" defaultValue={edit?.image_url} className={inp} placeholder="https://...jpg" /></div>
              <div><label className={lbl}>Teqlər (vergüllə)</label><input name="tags" defaultValue={edit?.tags} className={inp} placeholder="WordPress, SEO" /></div>
              <div><label className={lbl}>Metrik / nəticə</label><input name="metric" defaultValue={edit?.metric} className={inp} placeholder="+214% sifariş" /></div>
              <div><label className={lbl}>Sıra (position)</label><input name="position" type="number" defaultValue={edit?.position ?? 0} className={inp} /></div>
              <label className="flex items-center gap-2 text-sm text-mut mt-6"><input type="checkbox" name="featured" defaultChecked={edit?.featured} className="accent-[#F1E500]" /> Seçilmiş (★)</label>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button type="button" onClick={() => setOpen(false)} className="text-sm px-4 py-2 border border-white/15 rounded-lg">Ləğv</button>
              <button disabled={pending} className="text-sm px-4 py-2 bg-brand text-ink font-semibold rounded-lg disabled:opacity-60">Yadda saxla</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
