import { createClient } from '@/lib/supabase/server';
import { fmtMoney } from '@/lib/utils';

async function count(table: string) {
  const sb = await createClient();
  const { count } = await sb.from(table).select('*', { count: 'exact', head: true });
  return count ?? 0;
}

export default async function Dashboard() {
  const sb = await createClient();
  const [clients, leads, projects] = await Promise.all([count('clients'), count('leads'), count('projects')]);
  const { data: invoices } = await sb.from('invoices').select('amount,status');
  const paid = (invoices || []).filter((i) => i.status === 'paid').reduce((a, i) => a + Number(i.amount), 0);
  const kpi = [
    { l: 'Ödənilmiş gəlir', v: fmtMoney(paid) }, { l: 'Müştərilər', v: clients },
    { l: 'Lead-lər', v: leads }, { l: 'Layihələr', v: projects },
  ];
  return (
    <>
      <h1 className="font-display text-2xl mb-1">İdarə paneli</h1>
      <p className="text-mut text-sm mb-6">Agentliyin ümumi vəziyyəti</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpi.map((k) => (
          <div key={k.l} className="bg-[#121212] border border-white/10 rounded-2xl p-5">
            <div className="font-mono text-[.7rem] uppercase tracking-wide text-mut">{k.l}</div>
            <div className="font-display font-bold text-3xl mt-2">{k.v}</div>
          </div>
        ))}
      </div>
    </>
  );
}
