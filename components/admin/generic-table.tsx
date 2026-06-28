'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createRow, updateRow, deleteRow } from '@/lib/actions/crud';

export type Field = { name: string; label: string; type?: 'text' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox'; options?: string[]; required?: boolean; full?: boolean };
export type Column = { key: string; label: string; format?: 'badge' | 'money' | 'bool' | 'date' };

const money = (n: any) => new Intl.NumberFormat('az-AZ').format(Number(n || 0)) + ' ₼';

export default function GenericTable({ table, title, subtitle, rows, columns, fields, revalidate, readOnly }: {
  table: string; title: string; subtitle?: string; rows: any[]; columns: Column[]; fields: Field[]; revalidate: string; readOnly?: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<any | null>(null);

  function build(form: HTMLFormElement) {
    const fd = new FormData(form); const rec: Record<string, any> = {};
    fields.forEach((f) => {
      const v = fd.get(f.name);
      if (f.type === 'checkbox') rec[f.name] = v === 'on';
      else if (f.type === 'number') rec[f.name] = v === '' || v === null ? null : Number(v);
      else rec[f.name] = v === '' ? null : v;
    });
    return rec;
  }
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const rec = build(e.currentTarget);
    start(async () => {
      if (edit) await updateRow(table, edit.id, rec, revalidate); else await createRow(table, rec, revalidate);
      setOpen(false); setEdit(null); router.refresh();
    });
  }
  function del(id: string) { if (confirm('Silinsin?')) start(async () => { await deleteRow(table, id, revalidate); router.refresh(); }); }

  const inp = 'w-full bg-[#161616] border border-white/15 rounded-lg px-3 py-2.5 text-white outline-none focus:border-brand text-sm';
  const lbl = 'font-mono text-[.62rem] uppercase text-mut block mb-1.5';

  const cell = (row: any, c: Column) => {
    const v = row[c.key];
    if (c.format === 'money') return money(v);
    if (c.format === 'bool') return v ? '✓' : '—';
    if (c.format === 'badge') return <span className="font-mono text-[.7rem] border border-white/15 rounded-full px-2 py-0.5 text-mut">{v}</span>;
    return v ?? '—';
  };

  return (
    <>
      <div className="flex justify-between items-end mb-5 flex-wrap gap-3">
        <div><h1 className="font-display text-2xl">{title}</h1><p className="text-mut text-sm">{subtitle || `${rows.length} qeyd`}</p></div>
        {!readOnly && <button onClick={() => { setEdit(null); setOpen(true); }} className="bg-brand text-ink font-semibold text-sm rounded-lg px-4 py-2.5">+ Yeni</button>}
      </div>
      <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead><tr>{columns.map((c) => <th key={c.key} className="text-left font-mono text-[.66rem] uppercase text-mut font-medium px-4 py-3 border-b border-white/10">{c.label}</th>)}{!readOnly && <th className="border-b border-white/10" />}</tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-[#161616]">
                {columns.map((c) => <td key={c.key} className="px-4 py-3 border-b border-white/5">{cell(r, c)}</td>)}
                {!readOnly && <td className="px-4 py-3 border-b border-white/5 text-right whitespace-nowrap">
                  <button onClick={() => { setEdit(r); setOpen(true); }} className="text-mut hover:text-brand mr-3">✎</button>
                  <button onClick={() => del(r.id)} className="text-mut hover:text-red-400">🗑</button>
                </td>}
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={columns.length + 1} className="text-center text-mut py-8">Qeyd yoxdur.</td></tr>}
          </tbody>
        </table>
      </div>

      {open && !readOnly && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5 overflow-auto" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <form onSubmit={onSubmit} className="bg-[#121212] border border-white/15 rounded-2xl w-full max-w-lg p-6 my-8">
            <h3 className="font-display text-lg mb-4">{edit ? 'Redaktə' : 'Yeni qeyd'}</h3>
            <div className="grid grid-cols-2 gap-3">
              {fields.map((f) => (
                <div key={f.name} className={f.full || f.type === 'textarea' ? 'col-span-2' : ''}>
                  <label className={lbl}>{f.label}</label>
                  {f.type === 'select' ? (
                    <select name={f.name} defaultValue={edit?.[f.name] ?? f.options?.[0]} className={inp}>{f.options?.map((o) => <option key={o} value={o}>{o}</option>)}</select>
                  ) : f.type === 'textarea' ? (
                    <textarea name={f.name} defaultValue={edit?.[f.name] ?? ''} rows={3} className={inp} />
                  ) : f.type === 'checkbox' ? (
                    <label className="flex items-center gap-2 text-sm text-mut mt-2"><input type="checkbox" name={f.name} defaultChecked={!!edit?.[f.name]} className="accent-[#F1E500]" /> bəli</label>
                  ) : (
                    <input type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'} name={f.name} defaultValue={edit?.[f.name] ?? ''} required={f.required} className={inp} />
                  )}
                </div>
              ))}
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
