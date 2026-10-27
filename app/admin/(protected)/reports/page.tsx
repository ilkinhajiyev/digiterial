import { createServiceClient } from '@/lib/supabase/service';
import { PageHead, Card, money } from '@/components/admin/ui';

const MONTHS = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn', 'İyl', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'];

export default async function Page() {
  const svc = createServiceClient();
  const [{ data: leads }, { data: invoices }] = await Promise.all([
    svc.from('leads').select('created_at,stage,value').then((r) => r, () => ({ data: [] as any[] })),
    svc.from('invoices').select('issue_date,amount,status').then((r) => r, () => ({ data: [] as any[] })),
  ]);
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => new Date(now.getFullYear(), now.getMonth() - 5 + i, 1));
  const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}`;
  const rows = months.map((m) => {
    const k = key(m);
    const L = (leads || []).filter((l: any) => key(new Date(l.created_at)) === k);
    const P = (invoices || []).filter((i: any) => i.status === 'paid' && i.issue_date && key(new Date(i.issue_date)) === k);
    return { label: `${MONTHS[m.getMonth()]} ${m.getFullYear()}`, leads: L.length, won: L.filter((l: any) => l.stage === 'won').length, revenue: P.reduce((a: number, i: any) => a + Number(i.amount), 0) };
  });
  const maxRev = Math.max(1, ...rows.map((r) => r.revenue));
  const maxLead = Math.max(1, ...rows.map((r) => r.leads));
  return (
    <>
      <PageHead title="Hesabatlar" sub="Son 6 ayın icmalı: lead axını və ödənilmiş gəlir" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mb-3">
        <Card title="Ödənilmiş gəlir">
          <div className="px-5 pb-5 h-[220px] flex items-end gap-3">
            {rows.map((r) => (
              <div key={r.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="adm-num text-[11.5px] text-mut-d">{r.revenue ? money(r.revenue) : ''}</span>
                <span className="w-full max-w-[44px] rounded-t-md bg-brand/80" style={{ height: `${(r.revenue / maxRev) * 150}px`, minHeight: r.revenue ? 4 : 0 }} />
                <span className="text-[11.5px] text-mut">{r.label.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Lead-lər və qazanılanlar">
          <div className="px-5 pb-5 h-[220px] flex items-end gap-3">
            {rows.map((r) => (
              <div key={r.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="adm-num text-[11.5px] text-mut-d">{r.leads || ''}</span>
                <span className="w-full max-w-[44px] rounded-t-md bg-white/[.08] relative overflow-hidden" style={{ height: `${(r.leads / maxLead) * 150}px`, minHeight: r.leads ? 4 : 0 }}>
                  <span className="absolute bottom-0 inset-x-0 bg-mint/80" style={{ height: r.leads ? `${(r.won / r.leads) * 100}%` : 0 }} />
                </span>
                <span className="text-[11.5px] text-mut">{r.label.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card>
        <div className="overflow-x-auto adm-scroll">
          <table className="w-full text-[13.5px] min-w-[520px]">
            <thead><tr className="text-left text-[12px] text-mut">{['Ay', 'Lead', 'Qazanılan', 'Konversiya', 'Gəlir'].map((h) => <th key={h} className="px-5 py-3 font-medium border-b border-line">{h}</th>)}</tr></thead>
            <tbody>
              {rows.slice().reverse().map((r) => (
                <tr key={r.label} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 font-medium">{r.label}</td>
                  <td className="px-5 py-3 adm-num">{r.leads}</td>
                  <td className="px-5 py-3 adm-num">{r.won}</td>
                  <td className="px-5 py-3 adm-num text-mut-d">{r.leads ? Math.round((r.won / r.leads) * 100) : 0}%</td>
                  <td className="px-5 py-3 adm-num">{money(r.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
