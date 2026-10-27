import Link from 'next/link';
import { I, Badge, Card, money, fmtDate, ago, label, Avatar, btn } from './ui';

export type DashData = {
  userName: string;
  leads: { id: string; name: string; company?: string; service?: string; value?: number; stage: string; source?: string; created_at: string }[];
  projects: { id: string; name: string; status: string; progress?: number; due_date?: string; type?: string }[];
  tasks: { id: string; title: string; status: string; due_date?: string; area?: string }[];
  invoices: { id: string; number: string; amount: number; status: string; issue_date?: string; due_date?: string }[];
  openTickets: number;
  activeClients: number;
};

const STAGES = ['new', 'contacted', 'proposal', 'negotiation', 'won', 'lost'];
const DAY = 86400000;

function Spark({ data }: { data: number[] }) {
  const w = 96, h = 30, max = Math.max(1, ...data);
  const pts = data.map((v, i) => [(i / Math.max(1, data.length - 1)) * w, h - 3 - (v / max) * (h - 6)]);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="overflow-visible">
      <path d={`${d} L${w},${h} L0,${h} Z`} fill="rgba(162,255,203,.12)" />
      <path d={d} fill="none" stroke="#A2FFCB" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx={pts.at(-1)![0]} cy={pts.at(-1)![1]} r="2.6" fill="#A2FFCB" />
    </svg>
  );
}

function Kpi({ title, value, sub, trend, spark, href, icon }: { title: string; value: string; sub?: string; trend?: number | null; spark?: number[]; href: string; icon: string }) {
  return (
    <Link href={href} className="group bg-panel border border-line rounded-2xl p-4 hover:border-white/15 transition flex flex-col gap-3 min-w-0">
      <div className="flex items-center gap-2 text-[12.5px] text-mut-d"><I n={icon} className="w-4 h-4 text-mut" />{title}<I n="arrowUp" className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-60 transition" /></div>
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="font-display font-bold text-[26px] leading-none tracking-[-0.02em] adm-num truncate">{value}</div>
          <div className="mt-2 flex items-center gap-2 text-[12px]">
            {trend != null && <span className={`inline-flex items-center gap-0.5 font-semibold ${trend >= 0 ? 'text-mint' : 'text-danger'}`}><I n={trend >= 0 ? 'arrowUp' : 'arrowDown'} className="w-3 h-3" sw={2.4} />{Math.abs(trend)}%</span>}
            {sub && <span className="text-mut truncate">{sub}</span>}
          </div>
        </div>
        {spark && <Spark data={spark} />}
      </div>
    </Link>
  );
}

export default function Dashboard({ d, now = Date.now() }: { d: DashData; now?: number }) {
  const open = d.leads.filter((l) => !['won', 'lost'].includes(l.stage));
  const pipe = open.reduce((a, l) => a + Number(l.value || 0), 0);
  const last30 = d.leads.filter((l) => now - +new Date(l.created_at) < 30 * DAY).length;
  const prev30 = d.leads.filter((l) => { const a = now - +new Date(l.created_at); return a >= 30 * DAY && a < 60 * DAY; }).length;
  const leadTrend = prev30 ? Math.round(((last30 - prev30) / prev30) * 100) : null;
  const weeks = Array.from({ length: 8 }, (_, i) => d.leads.filter((l) => { const a = now - +new Date(l.created_at); return a >= (7 - i) * 7 * DAY && a < (8 - i) * 7 * DAY; }).length);

  const nowD = new Date(now);
  const inMonth = (iso?: string, off = 0) => { if (!iso) return false; const x = new Date(iso); const m = new Date(nowD.getFullYear(), nowD.getMonth() - off, 1); return x.getFullYear() === m.getFullYear() && x.getMonth() === m.getMonth(); };
  const paidThis = d.invoices.filter((i) => i.status === 'paid' && inMonth(i.issue_date)).reduce((a, i) => a + Number(i.amount), 0);
  const paidPrev = d.invoices.filter((i) => i.status === 'paid' && inMonth(i.issue_date, 1)).reduce((a, i) => a + Number(i.amount), 0);
  const revTrend = paidPrev ? Math.round(((paidThis - paidPrev) / paidPrev) * 100) : null;
  const unpaid = d.invoices.filter((i) => ['sent', 'overdue'].includes(i.status));
  const overdue = unpaid.filter((i) => i.status === 'overdue' || (i.due_date && +new Date(i.due_date) < now));
  const active = d.projects.filter((p) => ['planning', 'in_progress', 'review'].includes(p.status));
  const avgProg = active.length ? Math.round(active.reduce((a, p) => a + Number(p.progress || 0), 0) / active.length) : 0;
  const tasks = d.tasks.filter((t) => t.status !== 'done').sort((a, b) => (a.due_date ? +new Date(a.due_date) : Infinity) - (b.due_date ? +new Date(b.due_date) : Infinity)).slice(0, 6);

  const byStage = STAGES.map((s) => { const xs = d.leads.filter((l) => l.stage === s); return { s, n: xs.length, v: xs.reduce((a, l) => a + Number(l.value || 0), 0) }; });
  const maxStage = Math.max(1, ...byStage.map((x) => x.n));
  const sources = Object.entries(d.leads.reduce<Record<string, number>>((m, l) => { const k = l.source || 'direct'; m[k] = (m[k] || 0) + 1; return m; }, {})).sort((a, b) => b[1] - a[1]);
  const srcTotal = Math.max(1, d.leads.length);
  const SRC_COLORS = ['#F1B43A', '#A2FFCB', '#7CB8FF', '#C9A2FF', '#8B919C'];

  const hour = nowD.getHours();
  const greet = hour < 6 ? 'Gecəniz xeyir' : hour < 12 ? 'Sabahınız xeyir' : hour < 18 ? 'Günortanız xeyir' : 'Axşamınız xeyir';

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-mut text-[13px] adm-num">{nowD.toLocaleDateString('az-AZ', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <h1 className="font-display font-bold text-[28px] tracking-[-0.02em] mt-1">{greet}, {d.userName.split(' ')[0]}</h1>
          <p className="text-mut-d text-sm mt-1">{d.leads.filter((l) => l.stage === 'new').length ? `${d.leads.filter((l) => l.stage === 'new').length} yeni lead cavab gözləyir.` : 'Yeni lead yoxdur.'} {overdue.length ? `${overdue.length} faktura gecikib.` : ''}</p>
        </div>
        <div className="flex gap-2"><Link href="/admin/crm?new=1" className={btn.ghost}><I n="plus" className="w-4 h-4" />Lead</Link><Link href="/admin/invoices?new=1" className={btn.primary}><I n="invoice" className="w-4 h-4" />Faktura yarat</Link></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-3">
        <Kpi title="Pipeline dəyəri" value={money(pipe)} sub={`${open.length} açıq lead`} href="/admin/crm" icon="pipeline" />
        <Kpi title="Yeni lead · 30 gün" value={String(last30)} trend={leadTrend} sub="əvvəlki 30 günə görə" spark={weeks} href="/admin/crm" icon="bolt" />
        <Kpi title="Bu ay ödənilən" value={money(paidThis)} trend={revTrend} sub="keçən aya görə" href="/admin/invoices" icon="invoice" />
        <Kpi title="Ödənilməmiş" value={money(unpaid.reduce((a, i) => a + Number(i.amount), 0))} sub={overdue.length ? `${overdue.length} gecikən` : `${unpaid.length} faktura`} href="/admin/invoices" icon="clock" />
        <Kpi title="Aktiv layihələr" value={String(active.length)} sub={`orta irəliləyiş ${avgProg}%`} href="/admin/projects" icon="folder" />
        <Kpi title="Açıq tiketlər" value={String(d.openTickets)} sub={`${d.activeClients} aktiv müştəri`} href="/admin/tickets" icon="ticket" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <Card title="Satış hunisi" className="xl:col-span-2" action={<Link href="/admin/crm" className="text-[12.5px] text-mut hover:text-paper">Pipeline →</Link>}>
          <div className="px-5 pb-5 flex flex-col gap-2.5">
            {byStage.map(({ s, n, v }) => (
              <div key={s} className="grid grid-cols-[120px_1fr_auto] items-center gap-3">
                <span className="text-[13px] text-mut-d">{label(s)}</span>
                <span className="h-7 rounded-md bg-white/[.04] overflow-hidden">
                  <span className={`block h-full rounded-md ${s === 'won' ? 'bg-mint/70' : s === 'lost' ? 'bg-danger/40' : 'bg-brand/70'}`} style={{ width: `${Math.max(n ? 4 : 0, (n / maxStage) * 100)}%` }} />
                </span>
                <span className="adm-num text-[12.5px] text-mut-d w-[120px] text-right"><b className="text-paper font-semibold">{n}</b> · {money(v)}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Lead mənbələri">
          <div className="px-5 pb-5">
            <div className="flex h-2.5 rounded-full overflow-hidden bg-white/[.05] mb-4">
              {sources.map(([k, n], i) => <span key={k} style={{ width: `${(n / srcTotal) * 100}%`, background: SRC_COLORS[i % SRC_COLORS.length] }} />)}
            </div>
            {sources.length === 0 && <p className="text-mut text-sm">Hələ lead yoxdur.</p>}
            <ul className="flex flex-col gap-2.5">
              {sources.map(([k, n], i) => (
                <li key={k} className="flex items-center gap-2.5 text-[13px]"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: SRC_COLORS[i % SRC_COLORS.length] }} /><span className="text-mut-d">{label(k)}</span><span className="ml-auto adm-num">{n}</span><span className="adm-num text-mut w-10 text-right">{Math.round((n / srcTotal) * 100)}%</span></li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <Card title="Son lead-lər" className="xl:col-span-2" action={<Link href="/admin/crm" className="text-[12.5px] text-mut hover:text-paper">Hamısı →</Link>}>
          <ul className="divide-y divide-line">
            {d.leads.slice(0, 6).map((l) => (
              <li key={l.id} className="flex items-center gap-3 px-5 py-3">
                <Avatar name={l.name} size={30} />
                <div className="min-w-0 flex-1"><div className="text-[13.5px] font-medium truncate">{l.name}{l.company ? <span className="text-mut font-normal"> · {l.company}</span> : null}</div><div className="text-[12px] text-mut truncate">{l.service || '—'}</div></div>
                <span className="hidden sm:block adm-num text-[13px]">{Number(l.value) ? money(l.value) : ''}</span>
                <Badge v={l.stage} />
                <span className="hidden md:block text-[12px] text-mut w-24 text-right">{ago(l.created_at)}</span>
              </li>
            ))}
            {d.leads.length === 0 && <li className="px-5 py-8 text-center text-mut text-sm">Saytdakı formadan gələn müraciətlər burada görünəcək.</li>}
          </ul>
        </Card>
        <Card title="Yaxınlaşan tapşırıqlar" action={<Link href="/admin/tasks" className="text-[12.5px] text-mut hover:text-paper">Lövhə →</Link>}>
          <ul className="px-3 pb-3 flex flex-col gap-1">
            {tasks.map((t) => {
              const late = t.due_date && +new Date(t.due_date) < now;
              return (
                <li key={t.id} className="flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-white/[.03]">
                  <span className={`mt-0.5 w-4 h-4 rounded-[5px] border ${t.status === 'review' ? 'border-brand bg-brand/20' : 'border-white/20'}`} />
                  <div className="min-w-0 flex-1"><div className="text-[13.5px] leading-snug">{t.title}</div><div className="text-[12px] text-mut mt-0.5">{label(t.status)}{t.area ? ` · ${t.area}` : ''}</div></div>
                  <span className={`text-[12px] adm-num whitespace-nowrap ${late ? 'text-danger' : 'text-mut'}`}>{t.due_date ? fmtDate(t.due_date) : ''}</span>
                </li>
              );
            })}
            {tasks.length === 0 && <li className="px-2 py-6 text-center text-mut text-sm">Açıq tapşırıq yoxdur.</li>}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <Card title="Aktiv layihələr" action={<Link href="/admin/projects" className="text-[12.5px] text-mut hover:text-paper">Hamısı →</Link>}>
          <ul className="px-5 pb-4 flex flex-col gap-3.5">
            {active.slice(0, 5).map((p) => (
              <li key={p.id}>
                <div className="flex items-center gap-2 text-[13.5px]"><span className="font-medium truncate">{p.name}</span><Badge v={p.status} /><span className="ml-auto text-[12px] text-mut adm-num">{p.due_date ? fmtDate(p.due_date) : ''}</span></div>
                <div className="mt-2 flex items-center gap-3"><span className="flex-1 h-1.5 rounded-full bg-white/[.06] overflow-hidden"><span className="block h-full rounded-full bg-mint" style={{ width: `${Number(p.progress || 0)}%` }} /></span><span className="adm-num text-[12px] text-mut-d w-9 text-right">{Number(p.progress || 0)}%</span></div>
              </li>
            ))}
            {active.length === 0 && <li className="py-6 text-center text-mut text-sm">Aktiv layihə yoxdur.</li>}
          </ul>
        </Card>
        <Card title="Ödənilməmiş fakturalar" action={<Link href="/admin/invoices" className="text-[12.5px] text-mut hover:text-paper">Hamısı →</Link>}>
          <ul className="divide-y divide-line">
            {unpaid.slice(0, 5).map((i) => {
              const late = i.status === 'overdue' || (i.due_date && +new Date(i.due_date) < now);
              return (
                <li key={i.id} className="flex items-center gap-3 px-5 py-3 text-[13.5px]">
                  <span className="font-mono text-[12.5px] text-mut-d">{i.number}</span>
                  <span className="text-[12px] text-mut">{i.due_date ? `son tarix ${fmtDate(i.due_date)}` : ''}</span>
                  <span className="ml-auto adm-num font-semibold">{money(i.amount)}</span>
                  <Badge v={late ? 'overdue' : i.status} ctx="invoice" />
                </li>
              );
            })}
            {unpaid.length === 0 && <li className="px-5 py-8 text-center text-mut text-sm">Bütün fakturalar ödənilib.</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
}
