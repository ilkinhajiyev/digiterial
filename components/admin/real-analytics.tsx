'use client';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import type { Ga4Data } from '@/lib/actions/ga4';

const COLORS = ['#F1E500', '#c9c400', '#9a9a93', '#6b6b64', '#44443f', '#2e2e2b'];
const card = 'bg-[#121212] border border-white/10 rounded-2xl p-5';

export default function RealAnalytics({ ga4, leads, clients }: { ga4: Ga4Data; leads: number; clients: number }) {
  // GA4 qurulmayıbsa — təlimat göstər
  if (!ga4.configured) {
    return (
      <>
        <h1 className="font-display text-2xl mb-1">Statistika</h1>
        <p className="text-mut text-sm mb-6">Real ziyarətçi məlumatları üçün Google Analytics 4 qoşulmalıdır.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[{ l: 'Lead', v: leads }, { l: 'Müştəri', v: clients }].map(k => (
            <div key={k.l} className={card}>
              <div className="font-mono text-[.7rem] uppercase text-mut">{k.l}</div>
              <div className="font-display font-bold text-3xl mt-2">{k.v}</div>
            </div>
          ))}
        </div>

        <div className="bg-[#121212] border border-brand/30 rounded-2xl p-6 max-w-2xl">
          <h3 className="font-display font-bold text-lg mb-3 text-brand">GA4 real statistikanı necə qoşmalı?</h3>
          <ol className="text-sm text-white/70 space-y-2.5 list-decimal pl-5">
            <li><b className="text-white">GA4 property yaradın:</b> analytics.google.com → property → Measurement ID (G-XXXX) alın və <b>Tənzimləmələr → Analitika</b> bölməsinə yazın.</li>
            <li><b className="text-white">Service Account yaradın:</b> console.cloud.google.com → yeni layihə → "Google Analytics Data API"-ni aktiv edin.</li>
            <li>IAM → Service Accounts → yeni account → JSON açar endirin.</li>
            <li><b className="text-white">GA4-ə giriş verin:</b> GA4 Admin → Property Access → service account emailini <b>Viewer</b> kimi əlavə edin.</li>
            <li><b className="text-white">Hostinger-də 3 env dəyişəni əlavə edin:</b>
              <div className="font-mono text-[.7rem] bg-black/40 rounded-lg p-3 mt-2 space-y-1 text-white/60">
                <div>GA4_PROPERTY_ID = <span className="text-brand">512345678</span></div>
                <div>GA4_CLIENT_EMAIL = <span className="text-brand">xxx@yyy.iam.gserviceaccount.com</span></div>
                <div>GA4_PRIVATE_KEY = <span className="text-brand">-----BEGIN PRIVATE KEY-----\n...</span></div>
              </div>
            </li>
          </ol>
          <p className="text-mut text-xs mt-4">Qoşulduqdan sonra bu səhifədə ölkələr, trafik mənbələri, ən çox baxılan səhifələr avtomatik görünəcək.</p>
        </div>
      </>
    );
  }

  // GA4 xəta verib
  if (!ga4.ok) {
    return (
      <>
        <h1 className="font-display text-2xl mb-1">Statistika</h1>
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 mt-4 max-w-xl">
          <p className="text-red-400 text-sm">GA4 bağlantı xətası: {ga4.error}</p>
          <p className="text-mut text-xs mt-2">Env dəyişənlərini və service account icazələrini yoxlayın.</p>
        </div>
      </>
    );
  }

  const s = ga4.summary!;
  const kpi = [
    { l: 'İstifadəçi (28g)', v: s.users.toLocaleString() },
    { l: 'Sessiya', v: s.sessions.toLocaleString() },
    { l: 'Səhifə baxışı', v: s.pageViews.toLocaleString() },
    { l: 'Orta müddət', v: s.avgDuration },
    { l: 'Lead', v: leads },
    { l: 'Müştəri', v: clients },
  ];

  return (
    <>
      <h1 className="font-display text-2xl mb-1">Statistika</h1>
      <p className="text-mut text-sm mb-6">Google Analytics 4 · son 28 gün · <span className="text-brand">canlı məlumat</span></p>

      {/* KPI kartlar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        {kpi.map(k => (
          <div key={k.l} className={card}>
            <div className="font-mono text-[.62rem] uppercase text-mut">{k.l}</div>
            <div className="font-display font-bold text-2xl mt-1.5">{k.v}</div>
          </div>
        ))}
      </div>

      {/* Gündəlik trafik */}
      <div className={card + ' mb-4'}>
        <div className="font-mono text-[.7rem] uppercase text-mut mb-4">Gündəlik istifadəçi</div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={ga4.daily}>
            <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F1E500" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#F1E500" stopOpacity={0} />
            </linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="date" stroke="#8A8A85" fontSize={11} />
            <YAxis stroke="#8A8A85" fontSize={11} />
            <Tooltip contentStyle={{ background: '#0b0b0b', border: '1px solid #333', borderRadius: 8 }} />
            <Area type="monotone" dataKey="users" stroke="#F1E500" strokeWidth={2} fill="url(#g)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        {/* Ölkələr */}
        <div className={card}>
          <div className="font-mono text-[.7rem] uppercase text-mut mb-4">Ölkələr</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ga4.countries} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" stroke="#8A8A85" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="#8A8A85" fontSize={11} width={80} />
              <Tooltip contentStyle={{ background: '#0b0b0b', border: '1px solid #333', borderRadius: 8 }} />
              <Bar dataKey="users" fill="#F1E500" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Trafik mənbələri */}
        <div className={card}>
          <div className="font-mono text-[.7rem] uppercase text-mut mb-4">Haradan gəlirlər</div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={ga4.sources} dataKey="users" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(e: any) => e.name}>
                {(ga4.sources || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0b0b0b', border: '1px solid #333', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Ən çox baxılan səhifələr */}
        <div className={card}>
          <div className="font-mono text-[.7rem] uppercase text-mut mb-4">Ən çox baxılan səhifələr</div>
          <div className="space-y-2">
            {(ga4.pages || []).map((p, i) => (
              <div key={i} className="flex items-center justify-between text-sm border-b border-white/5 pb-2">
                <span className="font-mono text-white/70 truncate max-w-[70%]">{p.path}</span>
                <span className="text-brand font-semibold">{p.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cihazlar */}
        <div className={card}>
          <div className="font-mono text-[.7rem] uppercase text-mut mb-4">Cihazlar</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={ga4.devices} dataKey="users" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} label={(e: any) => e.name}>
                {(ga4.devices || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0b0b0b', border: '1px solid #333', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
