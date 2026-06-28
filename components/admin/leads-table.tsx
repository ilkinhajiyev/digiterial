'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addLead } from '@/lib/actions/leads';
type Lead = { id: string; name: string; company?: string; service?: string; value?: number; stage: string };
export default function LeadsTable({ rows }: { rows: Lead[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const fd = new FormData(e.currentTarget);
    start(async () => { await addLead(fd); setOpen(false); router.refresh(); });
  }
  const inp = 'w-full bg-[#161616] border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-brand';
  return (
    <>
      <div className="flex justify-between items-end mb-5">
        <div><h1 className="font-display text-2xl">CRM / Lead-lər</h1><p className="text-mut text-sm">{rows.length} lead</p></div>
        <button onClick={() => setOpen(true)} className="bg-brand text-ink font-semibold text-sm rounded-lg px-4 py-2.5">+ Yeni lead</button>
      </div>
      <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm"><thead><tr>{['Ad','Şirkət','Xidmət','Dəyər','Mərhələ'].map((h)=><th key={h} className="text-left font-mono text-[.66rem] uppercase text-mut font-medium px-4 py-3 border-b border-white/10">{h}</th>)}</tr></thead>
        <tbody>{rows.map((l)=>(<tr key={l.id} className="hover:bg-[#161616]"><td className="px-4 py-3 border-b border-white/5 font-medium">{l.name}</td><td className="px-4 py-3 border-b border-white/5 text-mut">{l.company}</td><td className="px-4 py-3 border-b border-white/5">{l.service}</td><td className="px-4 py-3 border-b border-white/5 font-mono">{l.value} ₼</td><td className="px-4 py-3 border-b border-white/5"><span className="font-mono text-[.7rem] border border-white/15 rounded-full px-2 py-0.5 text-mut">{l.stage}</span></td></tr>))}
        {rows.length===0&&<tr><td colSpan={5} className="text-center text-mut py-8">Lead yoxdur.</td></tr>}</tbody></table>
      </div>
      {open && (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5" onClick={(e)=>{if(e.target===e.currentTarget)setOpen(false);}}>
        <form onSubmit={onSubmit} className="bg-[#121212] border border-white/15 rounded-2xl w-full max-w-md p-6">
          <h3 className="font-display text-lg mb-4">Yeni lead</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><input name="name" required placeholder="Ad" className={inp}/></div>
            <input name="company" placeholder="Şirkət" className={inp}/>
            <input name="service" placeholder="Xidmət" className={inp}/>
            <input name="value" type="number" placeholder="Dəyər ₼" className={inp}/>
            <select name="stage" className={inp}><option value="new">new</option><option value="contacted">contacted</option><option value="proposal">proposal</option><option value="negotiation">negotiation</option><option value="won">won</option><option value="lost">lost</option></select>
          </div>
          <div className="flex justify-end gap-2 mt-5"><button type="button" onClick={()=>setOpen(false)} className="text-sm px-4 py-2 border border-white/15 rounded-lg">Ləğv</button><button disabled={pending} className="text-sm px-4 py-2 bg-brand text-ink font-semibold rounded-lg disabled:opacity-60">Əlavə et</button></div>
        </form></div>)}
    </>
  );
}
