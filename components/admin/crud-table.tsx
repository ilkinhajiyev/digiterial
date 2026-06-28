'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export type Col = { key: string; label: string; fmt?: 'badge' | 'money' | 'bool' };
export type Field = { name: string; label: string; type?: 'text' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox'; options?: string[]; required?: boolean; span2?: boolean; placeholder?: string };

const money = (v: any) => v != null ? new Intl.NumberFormat('az-AZ').format(Number(v)) + ' ₼' : '—';

function CellVal({ val, fmt }: { val: any; fmt?: string }) {
  if (val == null || val === '') return <span className="text-white/25">—</span>;
  if (fmt === 'money') return <>{money(val)}</>;
  if (fmt === 'bool') return <span className={val ? 'text-brand' : 'text-white/30'}>{val ? '✓' : '✗'}</span>;
  if (fmt === 'badge') return <span className="font-mono text-[.68rem] border border-white/20 rounded-full px-2 py-0.5 text-mut whitespace-nowrap">{String(val)}</span>;
  return <>{String(val)}</>;
}

interface Props {
  title: string;
  subtitle?: string;
  rows: any[];
  cols: Col[];
  fields: Field[];
  upsert: (id: string | null, fd: FormData) => Promise<{ ok: boolean; error?: string }>;
  destroy: (id: string) => Promise<{ ok: boolean }>;
  readOnly?: boolean;
}

export default function CrudTable({ title, subtitle, rows, cols, fields, upsert, destroy, readOnly }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [search, setSearch] = useState('');

  const filtered = search
    ? rows.filter(r => cols.some(c => String(r[c.key] ?? '').toLowerCase().includes(search.toLowerCase())))
    : rows;

  function openNew() { setEdit(null); setErr(''); setOpen(true); }
  function openEdit(row: any) { setEdit(row); setErr(''); setOpen(true); }
  function close() { setOpen(false); setEdit(null); setErr(''); }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErr('');
    try {
      const fd = new FormData(e.currentTarget);
      const r = await upsert(edit?.id ?? null, fd);
      if (!r.ok) { setErr(r.error || 'Xəta baş verdi'); setLoading(false); return; }
      close();
      router.refresh();
    } catch (ex: any) {
      setErr(ex?.message || 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm('Silinsin?')) return;
    setLoading(true);
    try { await destroy(id); router.refresh(); }
    catch { /* silent */ }
    finally { setLoading(false); }
  }

  const inp = 'w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2.5 text-white outline-none focus:border-brand text-sm disabled:opacity-50';
  const lbl = 'font-mono text-[.62rem] uppercase text-white/50 block mb-1.5';

  return (
    <>
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-end gap-3 mb-5">
        <div>
          <h1 className="font-display text-2xl font-bold">{title}</h1>
          <p className="text-white/40 text-sm mt-0.5">{subtitle ?? `${rows.length} qeyd`}</p>
        </div>
        <div className="flex items-center gap-2">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Axtar…"
            className="bg-[#161616] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-brand w-40" />
          {!readOnly && (
            <button onClick={openNew}
              className="bg-brand text-ink font-semibold text-sm rounded-lg px-4 py-2.5 hover:opacity-90 active:scale-95 transition">
              + Yeni
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr>
              {cols.map(c => (
                <th key={c.key} className="text-left font-mono text-[.65rem] uppercase text-white/40 font-medium px-4 py-3 border-b border-white/10 whitespace-nowrap">{c.label}</th>
              ))}
              {!readOnly && <th className="border-b border-white/10 w-20" />}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, ri) => (
              <tr key={row.id ?? ri} className="hover:bg-white/[0.03] transition">
                {cols.map(c => (
                  <td key={c.key} className="px-4 py-3 border-b border-white/5 max-w-[220px] truncate">
                    <CellVal val={row[c.key]} fmt={c.fmt} />
                  </td>
                ))}
                {!readOnly && (
                  <td className="px-3 py-3 border-b border-white/5">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => openEdit(row)}
                        className="text-white/30 hover:text-brand transition text-base leading-none" title="Redaktə">✎</button>
                      <button onClick={() => onDelete(row.id)}
                        className="text-white/30 hover:text-red-400 transition text-base leading-none" title="Sil">🗑</button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={cols.length + (readOnly ? 0 : 1)} className="text-center text-white/30 py-10 font-mono text-sm">
                {search ? 'Axtarışa uyğun qeyd yoxdur' : 'Hələ qeyd yoxdur'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && !readOnly && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
          onClick={e => { if (e.target === e.currentTarget) close(); }}>
          <div className="bg-[#161616] border border-white/15 rounded-2xl w-full max-w-lg p-6 my-8 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-display font-bold text-lg">{edit ? 'Redaktə' : 'Yeni qeyd'}</h3>
              <button onClick={close} className="text-white/40 hover:text-white text-xl leading-none">✕</button>
            </div>

            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {fields.map(f => (
                  <div key={f.name} className={f.span2 || f.type === 'textarea' ? 'col-span-2' : ''}>
                    <label className={lbl}>{f.label}{f.required && <span className="text-brand ml-0.5">*</span>}</label>
                    {f.type === 'select' ? (
                      <select name={f.name} defaultValue={edit?.[f.name] ?? f.options?.[0] ?? ''} disabled={loading} className={inp}>
                        {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : f.type === 'textarea' ? (
                      <textarea name={f.name} defaultValue={edit?.[f.name] ?? ''} rows={3} disabled={loading} className={inp} placeholder={f.placeholder} />
                    ) : f.type === 'checkbox' ? (
                      <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" name={f.name} id={f.name} defaultChecked={!!edit?.[f.name]} disabled={loading} className="w-4 h-4 accent-brand" />
                        <label htmlFor={f.name} className="text-sm text-white/70 cursor-pointer">bəli</label>
                      </div>
                    ) : (
                      <input
                        type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                        name={f.name}
                        defaultValue={edit?.[f.name] ?? ''}
                        required={f.required}
                        disabled={loading}
                        placeholder={f.placeholder}
                        className={inp}
                      />
                    )}
                  </div>
                ))}
              </div>

              {err && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2.5 mb-4">{err}</div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={close} disabled={loading}
                  className="text-sm px-4 py-2.5 border border-white/15 rounded-lg text-white/70 hover:text-white hover:border-white/30 transition disabled:opacity-50">
                  Ləğv et
                </button>
                <button type="submit" disabled={loading}
                  className="text-sm px-5 py-2.5 bg-brand text-ink font-semibold rounded-lg hover:opacity-90 active:scale-95 transition disabled:opacity-60 min-w-[100px]">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity=".25" /><path d="M12 2a10 10 0 0 1 10 10" /></svg>
                      Saxlanır…
                    </span>
                  ) : 'Yadda saxla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
