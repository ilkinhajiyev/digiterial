import { createClient } from '@/lib/supabase/server';
import AnalyticsCharts from '@/components/admin/analytics-charts';

async function count(table: string) { const sb = await createClient(); const { count } = await sb.from(table).select('*', { count: 'exact', head: true }); return count ?? 0; }

export default async function Page() {
  const [leads, clients] = await Promise.all([count('leads'), count('clients')]);
  const kpi = [{ l: 'Ziyarətçi (30g)', v: '11.2k' }, { l: 'Lead', v: leads }, { l: 'Müştəri', v: clients }, { l: 'Konversiya', v: '3.4%' }];
  return (
    <>
      <h1 className="font-display text-2xl mb-1">Statistika</h1>
      <p className="text-mut text-sm mb-6">Marketinq performansının ümumi görünüşü <span className="text-mut/60">(demo data — GA4 inteqrasiyası TODO)</span></p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {kpi.map((k) => <div key={k.l} className="bg-[#121212] border border-white/10 rounded-2xl p-5"><div className="font-mono text-[.7rem] uppercase text-mut">{k.l}</div><div className="font-display font-bold text-3xl mt-2">{k.v}</div></div>)}
      </div>
      <AnalyticsCharts />
    </>
  );
}
