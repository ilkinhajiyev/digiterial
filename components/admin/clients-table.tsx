'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addClient, editClient, removeClient } from '@/lib/actions/clients';

type Client = { id: string; name: string; industry?: string; status: string; website?: string; contact_email?: string; contact_phone?: string };

export default function ClientsTable({ rows }: { rows: Client[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Client | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(async () => {
      if (edit) await editClient(edit.id, fd); else await addClient(fd);
      setOpen(false); setEdit(null); router.refresh();
    });
  }
  function del(id: string) { if (confirm('Silinsin?')) start(async () => { await removeClient(id); router.refresh(); }); }

  const inp = 'w-full bg-[#161616] border border-white/15 rounded-lg px-3 py-2.5 text-white outline-none focus:border-brand text-sm';
  const lbl = 'font-mono text-[.62rem] uppercase text-mut block mb-1.5';
  return (
    <>
      <div className="flex justify-between items-end mb-5">
        <div><h1 className="font-display text-2xl">Müştərilər</h1><p className="text-mut text-sm">{rows.length} qeyd</p></div>
        <button onClick={() => { setEdit(null); setOpen(true); }} className="bg-brand text-ink font-semibold text-sm rounded-lg px-4 py-2.5">+ Yeni müştəri</button>
      </div>
      <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="text-left">
            {['Ad', 'Sahə', 'Status', 'Email', ''].map((h) => <th key={h} className="font-mono text-[.66rem] uppercase text-mut font-medium px-4 py-3 border-b border-white/10">{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="hover:bg-[#161616]">
                <td className="px-4 py-3 border-b border-white/5 font-medium">{c.name}</td>
                <td className="px-4 py-3 border-b border-white/5 text-mut">{c.industry}</td>
                <td className="px-4 py-3 border-b border-white/5"><span className="font-mono text-[.7rem] border border-white/15 rounded-full px-2 py-0.5 text-mut">{c.status}</span></td>
                <td className="px-4 py-3 border-b border-white/5 text-mut">{c.contact_email}</td>
                <td className="px-4 py-3 border-b border-white/5 text-right">
                  <button onClick={() => { setEdit(c); setOpen(true); }} className="text-mut hover:text-brand mr-3">✎</button>
                  <button onClick={() => del(c.id)} className="text-mut hover:text-red-400">🗑</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="text-center text-mut py-8">Qeyd yoxdur.</td></tr>}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <form onSubmit={onSubmit} className="bg-[#121212] border border-white/15 rounded-2xl w-full max-w-md p-6">
            <h3 className="font-display text-lg mb-4">{edit ? 'Redaktə' : 'Yeni müştəri'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className={lbl}>Ad</label><input name="name" defaultValue={edit?.name} required className={inp} /></div>
              <div><label className={lbl}>Sahə</label><input name="industry" defaultValue={edit?.industry} className={inp} /></div>
              <div><label className={lbl}>Status</label><select name="status" defaultValue={edit?.status || 'active'} className={inp}><option value="active">active</option><option value="negotiation">negotiation</option><option value="paused">paused</option><option value="archived">archived</option></select></div>
              <div><label className={lbl}>Website</label><input name="website" defaultValue={edit?.website} className={inp} /></div>
              <div><label className={lbl}>Email</label><input name="contact_email" defaultValue={edit?.contact_email} className={inp} /></div>
              <div className="col-span-2"><label className={lbl}>Telefon</label><input name="contact_phone" defaultValue={edit?.contact_phone} className={inp} /></div>
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
