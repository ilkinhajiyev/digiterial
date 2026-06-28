import { createClient } from '@/lib/supabase/server';
export default async function ProjectsPage() {
  const sb = await createClient();
  const { data } = await sb.from('projects').select('*').order('created_at', { ascending: false });
  const rows = (data as any[]) || [];
  return (
    <>
      <h1 className="font-display text-2xl mb-5">Layihələr</h1>
      <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm"><thead><tr>{['Layihə','Növ','İrəliləyiş','Son tarix','Status'].map((h)=><th key={h} className="text-left font-mono text-[.66rem] uppercase text-mut font-medium px-4 py-3 border-b border-white/10">{h}</th>)}</tr></thead>
        <tbody>{rows.map((p)=>(<tr key={p.id} className="hover:bg-[#161616]"><td className="px-4 py-3 border-b border-white/5 font-medium">{p.name}</td><td className="px-4 py-3 border-b border-white/5 text-mut">{p.type}</td><td className="px-4 py-3 border-b border-white/5"><div className="h-1.5 w-32 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-brand" style={{width:`${p.progress}%`}}/></div></td><td className="px-4 py-3 border-b border-white/5 font-mono text-mut">{p.due_date}</td><td className="px-4 py-3 border-b border-white/5"><span className="font-mono text-[.7rem] border border-white/15 rounded-full px-2 py-0.5 text-mut">{p.status}</span></td></tr>))}
        {rows.length===0&&<tr><td colSpan={5} className="text-center text-mut py-8">Layihə yoxdur.</td></tr>}</tbody></table>
      </div>
    </>
  );
}
