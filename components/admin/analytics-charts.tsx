'use client';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';

const traffic = [
  { m: 'Yan', v: 4200 }, { m: 'Fev', v: 5100 }, { m: 'Mar', v: 6800 },
  { m: 'Apr', v: 7400 }, { m: 'May', v: 9100 }, { m: 'İyn', v: 11200 },
];
const channels = [
  { name: 'Üzvi', value: 46 }, { name: 'Google Ads', value: 24 },
  { name: 'Sosial', value: 18 }, { name: 'Birbaşa', value: 12 },
];
const conv = [
  { m: 'Yan', v: 32 }, { m: 'Fev', v: 41 }, { m: 'Mar', v: 38 },
  { m: 'Apr', v: 52 }, { m: 'May', v: 61 }, { m: 'İyn', v: 74 },
];
const COLORS = ['#F1E500', '#9a9a93', '#5b5b55', '#2e2e2b'];

const card = 'bg-[#121212] border border-white/10 rounded-2xl p-5';

export default function AnalyticsCharts() {
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className={`${card} lg:col-span-2`}>
        <div className="font-mono text-[.7rem] uppercase text-mut mb-4">Üzvi trafik (aylıq)</div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={traffic}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F1E500" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#F1E500" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="m" stroke="#8A8A85" fontSize={11} />
            <YAxis stroke="#8A8A85" fontSize={11} />
            <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 10, color: '#fff', fontSize: 12 }} />
            <Area type="monotone" dataKey="v" stroke="#F1E500" strokeWidth={2} fill="url(#grad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={card}>
        <div className="font-mono text-[.7rem] uppercase text-mut mb-4">Trafik mənbələri</div>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={channels} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
              {channels.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
            </Pie>
            <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 10, color: '#fff', fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-1 mt-2">
          {channels.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-mut">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i] }} />
              {c.name} {c.value}%
            </div>
          ))}
        </div>
      </div>

      <div className={`${card} lg:col-span-3`}>
        <div className="font-mono text-[.7rem] uppercase text-mut mb-4">Konversiyalar (aylıq)</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={conv}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="m" stroke="#8A8A85" fontSize={11} />
            <YAxis stroke="#8A8A85" fontSize={11} />
            <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 10, color: '#fff', fontSize: 12 }} cursor={{ fill: '#ffffff08' }} />
            <Bar dataKey="v" fill="#F1E500" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
