import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
export default async function Page() {
  const sb = await createClient();
  const { data } = await sb.from('pages').select('*').order('updated_at', { ascending: false });
  const rows = (data as any[]) || [];
  return (
    <>
      <div className="flex justify-between items-end mb-5"><div><h1 className="font-display text-2xl">Sayt / Səhifələr</h1><p className="text-mut text-sm">{rows.length} səhifə</p></div>
        <Link href="/admin/builder" className="bg-brand text-ink font-semibold text-sm rounded-lg px-4 py-2.5">Vizual Builder →</Link></div>
      <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]"><thead><tr>{['Açar', 'Slug', 'Dil', 'Status', 'Yenilənib', ''].map((h) => <th key={h} className="text-left font-mono text-[.66rem] uppercase text-mut font-medium px-4 py-3 border-b border-white/10">{h}</th>)}</tr></thead>
          <tbody>{rows.map((p) => (<tr key={p.id} className="hover:bg-[#161616]"><td className="px-4 py-3 border-b border-white/5 font-medium">{p.key}</td><td className="px-4 py-3 border-b border-white/5 text-mut">{p.slug}</td><td className="px-4 py-3 border-b border-white/5 font-mono">{p.locale}</td><td className="px-4 py-3 border-b border-white/5"><span className="font-mono text-[.7rem] border border-white/15 rounded-full px-2 py-0.5 text-mut">{p.status}</span></td><td className="px-4 py-3 border-b border-white/5 font-mono text-mut text-xs">{new Date(p.updated_at).toLocaleDateString('az')}</td><td className="px-4 py-3 border-b border-white/5 text-right"><Link href="/admin/builder" className="text-brand hover:underline">Redaktə</Link></td></tr>))}
          {rows.length === 0 && <tr><td colSpan={6} className="text-center text-mut py-8">Səhifə yoxdur. Builder-dən yaradın.</td></tr>}</tbody></table>
      </div>
    </>
  );
}
