'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export type Col = { key: string; label: string; fmt?: 'badge' | 'money' | 'bool' };
export type Field = {
  name: string; label: string;
  type?: 'text' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox';
  options?: string[]; required?: boolean; span2?: boolean; placeholder?: string;
};

const money = (v: any) => v != null ? new Intl.NumberFormat('az-AZ').format(Number(v)) + ' ₼' : '—';

function Cell({ val, fmt }: { val: any; fmt?: string }) {
  if (val == null || val === '') return <span className="text-white/20">—</span>;
  if (fmt === 'money')  return <>{money(val)}</>;
  if (fmt === 'bool')   return <span className={val ? 'text-brand' : 'text-white/30'}>{val ? '✓' : '✗'}</span>;
  if (fmt === 'badge')  return (
    <span className="font-mono text-[.67rem] border border-white/20 rounded-full px-2 py-0.5 text-white/50 whitespace-nowrap">
      {String(val)}
    </span>
  );
  return <span className="truncate max-w-[200px] block">{String(val)}</span>;
}

interface Props {
  title: string; subtitle?: string; rows: any[]; cols: Col[]; fields: Field[];
  upsert: (id: string | null, fd: FormData) => Promise<{ ok: boolean; error?: string }>;
  destroy: (id: string) => Promise<{ ok: boolean }>;
  readOnly?: boolean;
}

export default function CrudTable({ title, subtitle, rows, cols, fields, upsert, destroy, readOnly }: Props) {
  const router = useRouter();
  const [open,    setOpen]    = useState(false);
  const [edit,    setEdit]    = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [delId,   setDelId]   = useState<string | null>(null);
  const [err,     setErr]     = useState('');
  const [search,  setSearch]  = useState('');

  const filtered = search
    ? rows.filter(r => cols.some(c => String(r[c.key] ?? '').toLowerCase().includes(search.toLowerCase())))
    : rows;

  const openNew  = () => { setEdit(null); setErr(''); setOpen(true); };
  const openEdit = (row: any) => { setEdit(row); setErr(''); setOpen(true); };
  const close    = useCallback(() => { if (loading) return; setOpen(false); setEdit(null); setErr(''); }, [loading]);

  /* ── UPSERT ─────────────────────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setErr('');
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      const result = await upsert(edit?.id ?? null, fd);
      if (!result.ok) {
        setErr(result.error || 'Xəta baş verdi. Yenidən cəhd edin.');
        return;
      }
      close();
      router.refresh();
    } catch (ex: any) {
      setErr(ex?.message || 'Gözlənilməz xəta baş verdi.');
    } finally {
      setLoading(false);
    }
  };

  /* ── DELETE ─────────────────────────────────────────────────────────── */
  const handleDelete = async (id: string) => {
    setDelId(id);
    try {
      await destroy(id);
      router.refresh();
    } catch {
      /* silent */
    } finally {
      setDelId(null);
    }
  };

  /* ── INPUT STYLES ───────────────────────────────────────────────────── */
  const inp = [
    'w-full bg-[#0c0c0c] border border-white/15 rounded-lg px-3 py-2.5',
    'text-white text-sm outline-none transition',
    'focus:border-brand focus:ring-1 focus:ring-brand/30',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' ');
  const lbl = 'font-mono text-[.62rem] uppercase text-white/45 block mb-1.5';

  /* ── RENDER ─────────────────────────────────────────────────────────── */
  return (
    <>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <div>
          <h1 className="font-display text-2xl font-bold">{title}</h1>
          <p className="text-white/40 text-sm">{subtitle ?? `${rows.length} qeyd`}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Axtar…"
              className="bg-[#161616] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm text-white outline-none focus:border-brand/50 w-44" />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 text-xs">⌕</span>
          </div>
          {!readOnly && (
            <button onClick={openNew}
              className="flex items-center gap-1.5 bg-brand text-ink font-semibold text-sm rounded-lg px-4 py-2.5 hover:opacity-90 active:scale-[.97] transition select-none">
              <span className="text-base leading-none">+</span> Yeni
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr>
              {cols.map(c => (
                <th key={c.key}
                  className="text-left font-mono text-[.64rem] uppercase text-white/35 font-medium px-4 py-3 border-b border-white/8 whitespace-nowrap">
                  {c.label}
                </th>
              ))}
              {!readOnly && <th className="border-b border-white/8 w-16" />}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, ri) => (
              <tr key={row.id ?? ri} className="hover:bg-white/[.025] transition-colors group">
                {cols.map(c => (
                  <td key={c.key} className="px-4 py-3 border-b border-white/5">
                    <Cell val={row[c.key]} fmt={c.fmt} />
                  </td>
                ))}
                {!readOnly && (
                  <td className="px-3 py-3 border-b border-white/5">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(row)}
                        title="Redaktə et"
                        className="w-7 h-7 rounded-md bg-white/5 hover:bg-brand/20 hover:text-brand text-white/50 transition flex items-center justify-center text-sm">
                        ✎
                      </button>
                      <button onClick={() => handleDelete(row.id)}
                        title="Sil"
                        disabled={delId === row.id}
                        className="w-7 h-7 rounded-md bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/50 transition flex items-center justify-center text-sm disabled:opacity-40">
                        {delId === row.id ? '…' : '🗑'}
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={cols.length + (readOnly ? 0 : 1)}
                  className="text-center py-12 text-white/25 font-mono text-xs">
                  {search ? 'Axtarışa uyğun nəticə yoxdur' : 'Hələ qeyd yoxdur — "Yeni" düyməsini basın'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && !readOnly && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 backdrop-blur-sm overflow-y-auto"
          onMouseDown={e => { if (e.target === e.currentTarget) close(); }}>
          <div className="bg-[#181818] border border-white/15 rounded-2xl w-full max-w-lg mx-4 my-8 shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="font-display font-bold text-lg">
                {edit ? 'Redaktə et' : 'Yeni qeyd'}
              </h3>
              <button onClick={close} disabled={loading}
                className="w-8 h-8 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition flex items-center justify-center text-lg disabled:opacity-30">
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              <div className="px-6 py-5 grid grid-cols-2 gap-3">
                {fields.map(f => (
                  <div key={f.name} className={f.span2 || f.type === 'textarea' ? 'col-span-2' : ''}>
                    <label htmlFor={`field-${f.name}`} className={lbl}>
                      {f.label}{f.required && <span className="text-brand ml-0.5">*</span>}
                    </label>

                    {f.type === 'select' ? (
                      <select
                        id={`field-${f.name}`} name={f.name}
                        defaultValue={edit?.[f.name] ?? f.options?.[0] ?? ''}
                        disabled={loading} className={inp}>
                        {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>

                    ) : f.type === 'textarea' ? (
                      <textarea
                        id={`field-${f.name}`} name={f.name}
                        defaultValue={edit?.[f.name] ?? ''}
                        rows={3} disabled={loading} placeholder={f.placeholder}
                        className={inp + ' resize-none'} />

                    ) : f.type === 'checkbox' ? (
                      <label className="flex items-center gap-2.5 mt-1.5 cursor-pointer select-none">
                        <input
                          type="checkbox" id={`field-${f.name}`} name={f.name}
                          defaultChecked={!!edit?.[f.name]}
                          disabled={loading}
                          className="w-4 h-4 accent-brand rounded cursor-pointer" />
                        <span className="text-sm text-white/60">bəli</span>
                      </label>

                    ) : (
                      <input
                        id={`field-${f.name}`} name={f.name}
                        type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                        defaultValue={edit?.[f.name] ?? ''}
                        required={f.required}
                        disabled={loading}
                        placeholder={f.placeholder}
                        className={inp} />
                    )}
                  </div>
                ))}
              </div>

              {/* Error */}
              {err && (
                <div className="mx-6 mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
                  {err}
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-end gap-2 px-6 pb-5 pt-1">
                <button type="button" onClick={close} disabled={loading}
                  className="px-4 py-2.5 text-sm border border-white/15 rounded-lg text-white/60 hover:text-white hover:border-white/30 transition disabled:opacity-40">
                  Ləğv et
                </button>
                <button type="submit" disabled={loading}
                  className="px-5 py-2.5 text-sm bg-brand text-ink font-semibold rounded-lg hover:opacity-90 active:scale-[.97] transition disabled:opacity-60 min-w-[110px] flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity=".25" strokeWidth="2" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Saxlanır…
                    </>
                  ) : (
                    'Yadda saxla'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
