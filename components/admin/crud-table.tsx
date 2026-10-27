'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ImageField, GalleryField } from '@/components/admin/image-upload';
import { I, Badge, label, money, fmtDate, ago, PageHead, btn, input } from './ui';

export type Col = { key: string; label: string; fmt?: 'badge' | 'money' | 'bool' | 'date' | 'progress' | 'ago'; ctx?: string };
export type Field = {
  name: string; label: string;
  type?: 'text' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox' | 'image' | 'gallery' | 'email' | 'tel' | 'url';
  options?: string[]; required?: boolean; span2?: boolean; placeholder?: string; ctx?: string;
};
type Result = { ok: boolean; error?: string };

interface Props {
  title: string; subtitle?: string; rows: any[]; cols: Col[]; fields: Field[];
  upsert?: (id: string | null, fd: FormData) => Promise<Result>;
  destroy?: (id: string) => Promise<Result | { ok: boolean }>;
  readOnly?: boolean;
  toolbar?: React.ReactNode; // əlavə düymələr
  hideHead?: boolean;
  board?: (openEdit: (row: any) => void) => React.ReactNode; // Kanban görünüşü (varsa lövhə/cədvəl dəyişdiricisi çıxır)
}

function Cell({ val, col }: { val: any; col: Col }) {
  if (val == null || val === '') return <span className="text-white/20">—</span>;
  switch (col.fmt) {
    case 'money': return <span className="adm-num">{money(val)}</span>;
    case 'bool': return val ? <span className="text-mint">Bəli</span> : <span className="text-mut">Xeyr</span>;
    case 'badge': return <Badge v={val} ctx={col.ctx} />;
    case 'date': return <span className="adm-num text-mut-d">{fmtDate(val)}</span>;
    case 'ago': return <span className="text-mut-d" title={fmtDate(val)}>{ago(val)}</span>;
    case 'progress': {
      const n = Math.max(0, Math.min(100, Number(val) || 0));
      return <span className="flex items-center gap-2 min-w-[110px]"><span className="flex-1 h-1.5 rounded-full bg-white/[.07] overflow-hidden"><span className="block h-full rounded-full bg-mint" style={{ width: `${n}%` }} /></span><span className="adm-num text-[12px] text-mut-d w-9 text-right">{n}%</span></span>;
    }
    default: return <span className="block truncate max-w-[280px]">{String(val)}</span>;
  }
}

const csvCell = (v: unknown) => { const s = v == null ? '' : String(v); return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };

export default function CrudTable({ title, subtitle, rows, cols, fields, upsert, destroy, readOnly, toolbar, hideHead, board }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const canEdit = !readOnly && !!upsert;
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const filterCol = cols.find((c) => c.fmt === 'badge');
  const [filter, setFilter] = useState<string>('');
  const [mode, setMode] = useState<'board' | 'table'>(board ? 'board' : 'table');
  useEffect(() => { if (!board) return; try { const m = localStorage.getItem(`adm-view-${pathname}`); if (m === 'table' || m === 'board') setMode(m); } catch {} }, [board, pathname]);
  const switchMode = (m: 'board' | 'table') => { setMode(m); try { localStorage.setItem(`adm-view-${pathname}`, m); } catch {} };

  // "+ Yeni" menyusundan ?new=1 ilə gəldikdə formanı aç
  useEffect(() => {
    if (canEdit && params.get('new') === '1') { setEdit(null); setErr(''); setOpen(true); router.replace(pathname); }
  }, [params, canEdit, router, pathname]);

  const filterOptions = useMemo(() => {
    if (!filterCol) return [];
    const m = new Map<string, number>();
    rows.forEach((r) => { const v = r[filterCol.key]; if (v != null && v !== '') m.set(String(v), (m.get(String(v)) || 0) + 1); });
    return [...m.entries()];
  }, [rows, filterCol]);

  const view = useMemo(() => {
    const s = search.trim().toLowerCase();
    let out = rows.filter((r) =>
      (!s || cols.some((c) => `${r[c.key] ?? ''} ${c.fmt === 'badge' ? label(r[c.key], c.ctx) : ''}`.toLowerCase().includes(s))) &&
      (!filter || !filterCol || String(r[filterCol.key]) === filter));
    if (sort) out = [...out].sort((a, b) => {
      const x = a[sort.key], y = b[sort.key];
      if (x == null) return 1; if (y == null) return -1;
      const nx = Number(x), ny = Number(y);
      return (!isNaN(nx) && !isNaN(ny) ? nx - ny : String(x).localeCompare(String(y), 'az')) * sort.dir;
    });
    return out;
  }, [rows, cols, search, filter, filterCol, sort]);

  const openNew = () => { setEdit(null); setErr(''); setOpen(true); };
  const openEdit = (row: any) => { if (!canEdit) return; setEdit(row); setErr(''); setOpen(true); };
  const close = useCallback(() => { if (loading) return; setOpen(false); setEdit(null); setErr(''); }, [loading]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { close(); setConfirmId(null); } };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [close]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading || !upsert) return;
    setErr(''); setLoading(true);
    try {
      const r = await upsert(edit?.id ?? null, new FormData(e.currentTarget));
      if (!r.ok) { setErr(r.error || 'Yadda saxlanmadı. Yenidən cəhd edin.'); return; }
      setOpen(false); setEdit(null); router.refresh();
    } catch (ex: any) { setErr(ex?.message || 'Gözlənilməz xəta.'); }
    finally { setLoading(false); }
  };
  const remove = async (id: string) => {
    if (!destroy) return;
    setDelId(id);
    try { await destroy(id); setConfirmId(null); setOpen(false); router.refresh(); } catch { /* */ } finally { setDelId(null); }
  };
  const exportCsv = () => {
    const head = cols.map((c) => csvCell(c.label)).join(',');
    const body = view.map((r) => cols.map((c) => csvCell(c.fmt === 'badge' ? label(r[c.key], c.ctx) : r[c.key])).join(',')).join('\n');
    const blob = new Blob(['﻿' + head + '\n' + body], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.csv`; a.click(); URL.revokeObjectURL(a.href);
  };

  const lbl = 'block text-[12.5px] font-medium text-mut-d mb-1.5';

  return (
    <>
      {!hideHead && (
        <PageHead title={title} sub={subtitle ?? `${rows.length} qeyd`}>
          {toolbar}
          {board && (
            <div className="flex p-0.5 rounded-lg border border-line bg-panel" role="group" aria-label="Görünüş">
              <button onClick={() => switchMode('board')} aria-pressed={mode === 'board'} className={`h-8 px-2.5 rounded-md inline-flex items-center gap-1.5 text-[13px] ${mode === 'board' ? 'bg-white/[.08] text-paper' : 'text-mut hover:text-paper'}`}><I n="kanban" className="w-4 h-4" />Lövhə</button>
              <button onClick={() => switchMode('table')} aria-pressed={mode === 'table'} className={`h-8 px-2.5 rounded-md inline-flex items-center gap-1.5 text-[13px] ${mode === 'table' ? 'bg-white/[.08] text-paper' : 'text-mut hover:text-paper'}`}><I n="table" className="w-4 h-4" />Cədvəl</button>
            </div>
          )}
          <button onClick={exportCsv} className={btn.ghost} disabled={!view.length}><I n="download" className="w-4 h-4" />CSV</button>
          {canEdit && <button onClick={openNew} className={btn.primary}><I n="plus" className="w-4 h-4" sw={2.4} />Yeni</button>}
        </PageHead>
      )}

      {board && mode === 'board' ? board(openEdit) : (
      <div className="bg-panel border border-line rounded-2xl overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-line">
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <I n="search" className="w-4 h-4 text-mut absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Axtar…" className={`${input} pl-9 py-2 bg-panel2`} aria-label="Cədvəldə axtar" />
          </div>
          {filterOptions.length > 1 && (
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtr">
              <button onClick={() => setFilter('')} className={`h-8 px-3 rounded-full text-[12.5px] border transition ${!filter ? 'bg-paper text-ink border-paper' : 'border-line text-mut-d hover:text-paper'}`}>Hamısı <span className="adm-num opacity-60">{rows.length}</span></button>
              {filterOptions.map(([v, n]) => (
                <button key={v} onClick={() => setFilter(filter === v ? '' : v)} className={`h-8 px-3 rounded-full text-[12.5px] border transition ${filter === v ? 'bg-paper text-ink border-paper' : 'border-line text-mut-d hover:text-paper'}`}>{label(v, filterCol?.ctx)} <span className="adm-num opacity-60">{n}</span></button>
              ))}
            </div>
          )}
          <span className="ml-auto text-[12px] text-mut adm-num">{view.length} / {rows.length}</span>
        </div>
        <div className="overflow-x-auto adm-scroll">
          <table className="w-full text-[13.5px] min-w-[640px]">
            <thead>
              <tr className="text-left">
                {cols.map((c) => (
                  <th key={c.key} className="px-4 py-2.5 font-medium text-[12px] text-mut border-b border-line whitespace-nowrap">
                    <button onClick={() => setSort((s) => (s?.key === c.key ? (s.dir === 1 ? { key: c.key, dir: -1 } : null) : { key: c.key, dir: 1 }))} className="inline-flex items-center gap-1 hover:text-paper">
                      {c.label}{sort?.key === c.key ? <span className="text-brand">{sort.dir === 1 ? '↑' : '↓'}</span> : <I n="sort" className="w-3 h-3 opacity-30" />}
                    </button>
                  </th>
                ))}
                {canEdit && <th className="border-b border-line w-24" />}
              </tr>
            </thead>
            <tbody>
              {view.map((row, ri) => (
                <tr key={row.id ?? ri} onClick={() => openEdit(row)} className={`group border-b border-line last:border-0 ${canEdit ? 'cursor-pointer hover:bg-white/[.025]' : ''}`}>
                  {cols.map((c, ci) => (
                    <td key={c.key} className={`px-4 py-3 ${ci === 0 ? 'font-medium text-paper' : 'text-mut-d'}`}><Cell val={row[c.key]} col={c} /></td>
                  ))}
                  {canEdit && (
                    <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                      {confirmId === row.id ? (
                        <span className="flex items-center justify-end gap-1.5">
                          <button onClick={() => remove(row.id)} disabled={delId === row.id} className="h-7 px-2.5 rounded-md bg-danger/15 text-danger text-[12px] font-semibold hover:bg-danger/25">{delId === row.id ? 'Silinir…' : 'Sil'}</button>
                          <button onClick={() => setConfirmId(null)} className="h-7 px-2 rounded-md text-mut text-[12px] hover:text-paper">Ləğv</button>
                        </span>
                      ) : (
                        <span className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition">
                          <button onClick={() => openEdit(row)} className={btn.icon} aria-label="Redaktə et"><I n="edit" className="w-4 h-4" /></button>
                          {destroy && <button onClick={() => setConfirmId(row.id)} className={`${btn.icon} hover:!text-danger`} aria-label="Sil"><I n="trash" className="w-4 h-4" /></button>}
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {view.length === 0 && (
            <div className="py-16 px-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-panel2 border border-line grid place-items-center mx-auto mb-4 text-mut"><I n={search || filter ? 'search' : 'plus'} /></div>
              <p className="font-medium">{search || filter ? 'Uyğun nəticə tapılmadı' : 'Hələ qeyd yoxdur'}</p>
              <p className="text-mut text-sm mt-1">{search || filter ? 'Axtarışı və ya filtri dəyişin.' : canEdit ? 'İlk qeydi əlavə edin.' : 'Məlumat burada görünəcək.'}</p>
              {!search && !filter && canEdit && <button onClick={openNew} className={`${btn.primary} mt-5`}><I n="plus" className="w-4 h-4" sw={2.4} />Yeni qeyd</button>}
            </div>
          )}
        </div>
      </div>
      )}

      {/* Sağdan açılan redaktə paneli */}
      {open && canEdit && (
        <div className="fixed inset-0 z-[65] bg-black/55 backdrop-blur-[2px]" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
          <aside className="absolute right-0 top-0 h-full w-full max-w-[520px] bg-panel border-l border-line shadow-pop flex flex-col animate-slide-in" role="dialog" aria-label={edit ? 'Qeydi redaktə et' : 'Yeni qeyd'}>
            <header className="flex items-center gap-3 px-6 h-16 border-b border-line shrink-0">
              <div className="min-w-0">
                <div className="text-[12px] text-mut">{title}</div>
                <h3 className="font-display font-bold text-[17px] truncate">{edit ? (edit[cols[0]?.key] || 'Redaktə') : 'Yeni qeyd'}</h3>
              </div>
              <button onClick={close} disabled={loading} className={`${btn.icon} ml-auto`} aria-label="Bağla"><I n="x" /></button>
            </header>
            <form onSubmit={submit} noValidate className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto adm-scroll px-6 py-5 grid grid-cols-2 gap-4 content-start">
                {fields.map((f) => (
                  <div key={f.name} className={f.span2 || f.type === 'textarea' || f.type === 'image' || f.type === 'gallery' ? 'col-span-2' : 'col-span-2 sm:col-span-1'}>
                    <label htmlFor={`f-${f.name}`} className={lbl}>{f.label}{f.required && <span className="text-brand ml-0.5">*</span>}</label>
                    {f.type === 'select' ? (
                      <select id={`f-${f.name}`} name={f.name} defaultValue={edit?.[f.name] ?? f.options?.[0] ?? ''} disabled={loading} className={input}>
                        {f.options?.map((o) => <option key={o} value={o}>{label(o, f.ctx)}</option>)}
                      </select>
                    ) : f.type === 'textarea' ? (
                      <textarea id={`f-${f.name}`} name={f.name} defaultValue={edit?.[f.name] ?? ''} rows={4} disabled={loading} placeholder={f.placeholder} className={`${input} resize-y`} />
                    ) : f.type === 'checkbox' ? (
                      <label className="flex items-center gap-2.5 h-[42px] cursor-pointer select-none">
                        <input type="checkbox" id={`f-${f.name}`} name={f.name} defaultChecked={!!edit?.[f.name]} disabled={loading} className="w-4 h-4 accent-[#F1B43A]" />
                        <span className="text-sm text-mut-d">Bəli</span>
                      </label>
                    ) : f.type === 'image' ? (
                      <ImageField name={f.name} defaultValue={edit?.[f.name]} />
                    ) : f.type === 'gallery' ? (
                      <GalleryField name={f.name} defaultValue={edit?.[f.name]} />
                    ) : (
                      <input id={`f-${f.name}`} name={f.name} type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : f.type || 'text'}
                        defaultValue={edit?.[f.name] ?? ''} required={f.required} disabled={loading} placeholder={f.placeholder} className={input} />
                    )}
                  </div>
                ))}
                {err && <div className="col-span-2 bg-danger/10 border border-danger/30 text-danger text-sm rounded-lg px-4 py-3" role="alert">{err}</div>}
              </div>
              <footer className="flex items-center gap-2 px-6 py-4 border-t border-line shrink-0">
                {edit && destroy && (confirmId === edit.id
                  ? <><button type="button" onClick={() => remove(edit.id)} className="h-9 px-3 rounded-lg bg-danger/15 text-danger text-[13px] font-semibold">{delId ? 'Silinir…' : 'Silməyi təsdiqlə'}</button><button type="button" onClick={() => setConfirmId(null)} className="h-9 px-2 text-mut text-[13px]">Ləğv</button></>
                  : <button type="button" onClick={() => setConfirmId(edit.id)} className="h-9 px-3 rounded-lg text-danger/80 hover:text-danger hover:bg-danger/10 text-[13px] inline-flex items-center gap-1.5"><I n="trash" className="w-4 h-4" />Sil</button>)}
                <button type="button" onClick={close} disabled={loading} className={`${btn.ghost} ml-auto`}>Ləğv et</button>
                <button type="submit" disabled={loading} className={`${btn.primary} min-w-[120px] justify-center`}>{loading ? 'Saxlanır…' : 'Yadda saxla'}</button>
              </footer>
            </form>
          </aside>
        </div>
      )}
    </>
  );
}
