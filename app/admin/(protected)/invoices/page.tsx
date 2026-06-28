import { createClient } from '@/lib/supabase/server';
import { fmtMoney } from '@/lib/utils';
export default async function InvoicesPage() {
  const sb = await createClient();
  const { data } = await sb.from('invoices').select('*').order('created_at', { ascending: false });
  const rows = (data as any[]) || [];
  return (
    <>
      <h1 className="font-display text-2xl mb-5">Fakturalar</h1>
      <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm"><thead><tr>{['#','Məbləğ','Tarix','Status'].map((h)=><th key={h} className="text-left font-mono text-[.66rem] uppercase text-mut font-medium px-4 py-3 border-b border-white/10">{h}</th>)}</tr></thead>
        <tbody>{rows.map((v)=>(<tr key={v.id} className="hover:bg-[#161616]"><td className="px-4 py-3 border-b border-white/5 font-mono">{v.number}</td><td className="px-4 py-3 border-b border-white/5 font-medium">{fmtMoney(Number(v.amount))}</td><td className="px-4 py-3 border-b border-white/5 font-mono text-mut">{v.issue_date}</td><td className="px-4 py-3 border-b border-white/5"><span className="font-mono text-[.7rem] border border-white/15 rounded-full px-2 py-0.5 text-mut">{v.status}</span></td></tr>))}
        {rows.length===0&&<tr><td colSpan={4} className="text-center text-mut py-8">Faktura yoxdur.</td></tr>}</tbody></table>
      </div>
    </>
  );
}
