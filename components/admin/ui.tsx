// Agency OS — ümumi UI hissələri: ikonlar, status etiketləri, formatlama
import type { ReactNode } from 'react';

const P: Record<string, string> = {
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
  pipeline: '<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="11" rx="1.5"/><rect x="17" y="4" width="4" height="7" rx="1.5"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  invoice: '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h7M9 17h5"/>',
  folder: '<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  check: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 12l3 3 5-6"/>',
  ticket: '<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/><path d="M13 6v12" stroke-dasharray="2 2"/>',
  megaphone: '<path d="M3 11v2a1 1 0 0 0 1 1h3l6 5V5L7 10H4a1 1 0 0 0-1 1z"/><path d="M17 8a5 5 0 0 1 0 8"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/>',
  layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
  blocks: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M17.5 14v7M14 17.5h7"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  report: '<path d="M4 4h16v16H4z"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
  team: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  external: '<path d="M14 3h7v7M10 14L21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
  collapse: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 9l-3 3 3 3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  kanban: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/>',
  table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
  edit: '<path d="M11 4H4v16h16v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/>',
  sort: '<path d="M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4"/>',
  arrowUp: '<path d="M7 17L17 7M8 7h9v9"/>',
  arrowDown: '<path d="M7 7l10 10M17 8v9H8"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bolt: '<path d="M13 2L3 14h9l-1 8 10-12h-9z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
};
export type AIcon = keyof typeof P | string;

export function I({ n, className = 'w-[18px] h-[18px]', sw = 1.8 }: { n: AIcon; className?: string; sw?: number }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: P[n] || '' }} />;
}

// Enum dəyərləri → azərbaycanca ad və rəng tonu
type Tone = 'neutral' | 'info' | 'warn' | 'good' | 'bad' | 'brand';
const L: Record<string, [string, Tone]> = {
  // lead mərhələləri
  new: ['Yeni', 'info'], contacted: ['Əlaqə saxlanıb', 'neutral'], proposal: ['Təklif', 'brand'], negotiation: ['Danışıq', 'warn'], won: ['Qazanıldı', 'good'], lost: ['İtirildi', 'bad'],
  // mənbələr
  organic: ['Orqanik', 'good'], paid: ['Reklam', 'brand'], social: ['Sosial', 'info'], referral: ['Tövsiyə', 'neutral'], direct: ['Birbaşa', 'neutral'],
  // layihə
  planning: ['Planlama', 'neutral'], in_progress: ['İcrada', 'info'], review: ['Yoxlamada', 'warn'], on_hold: ['Dayandırılıb', 'bad'], completed: ['Tamamlandı', 'good'], cancelled: ['Ləğv edilib', 'bad'],
  // tapşırıq
  backlog: ['Növbədə', 'neutral'], done: ['Hazır', 'good'],
  // faktura
  draft: ['Qaralama', 'neutral'], sent: ['Göndərilib', 'info'], paid_invoice: ['Ödənilib', 'good'], overdue: ['Gecikib', 'bad'], void: ['Ləğv', 'neutral'],
  // tiket
  open: ['Açıq', 'warn'], resolved: ['Həll olunub', 'good'], closed: ['Bağlı', 'neutral'],
  low: ['Aşağı', 'neutral'], medium: ['Orta', 'info'], high: ['Yüksək', 'warn'], urgent: ['Təcili', 'bad'],
  // müştəri
  active: ['Aktiv', 'good'], paused: ['Pauza', 'warn'], archived: ['Arxiv', 'neutral'],
  // kontent / səhifə
  scheduled: ['Planlaşdırılıb', 'info'], published: ['Dərc olunub', 'good'],
  // kanallar
  google: ['Google', 'info'], meta: ['Meta', 'brand'], tiktok: ['TikTok', 'neutral'], other: ['Digər', 'neutral'],
  // rollar
  admin: ['Admin', 'brand'], manager: ['Menecer', 'info'], specialist: ['Mütəxəssis', 'neutral'], client: ['Müştəri', 'neutral'],
  web: ['Veb', 'info'], smm: ['SMM', 'brand'],
};
export const label = (v: unknown, ctx?: string) => {
  const k = String(v ?? '');
  if (ctx === 'invoice' && k === 'paid') return L.paid_invoice[0];
  return L[k]?.[0] ?? k;
};
const TONES: Record<Tone, string> = {
  neutral: 'bg-white/[.06] text-mut-d ring-white/10',
  info: 'bg-info/10 text-info ring-info/25',
  warn: 'bg-brand/10 text-brand ring-brand/25',
  brand: 'bg-brand/15 text-brand ring-brand/30',
  good: 'bg-mint/10 text-mint ring-mint/25',
  bad: 'bg-danger/10 text-danger ring-danger/25',
};
export function Badge({ v, ctx }: { v: unknown; ctx?: string }) {
  const k = String(v ?? '');
  if (!k) return <span className="text-white/20">—</span>;
  const tone = ctx === 'invoice' && k === 'paid' ? 'good' : L[k]?.[1] ?? 'neutral';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-medium ring-1 ring-inset whitespace-nowrap ${TONES[tone]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />{label(k, ctx)}
    </span>
  );
}

export const money = (n: unknown) => (n == null || n === '' ? '—' : new Intl.NumberFormat('az-AZ', { maximumFractionDigits: 0 }).format(Number(n)) + ' ₼');
const MONTHS = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avq', 'sen', 'okt', 'noy', 'dek'];
export function fmtDate(v: unknown) {
  if (!v) return '—';
  const d = new Date(String(v));
  if (isNaN(+d)) return String(v);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
export function ago(v: unknown) {
  if (!v) return '';
  const s = (Date.now() - +new Date(String(v))) / 1000;
  if (s < 60) return 'indicə';
  if (s < 3600) return `${Math.floor(s / 60)} dəq əvvəl`;
  if (s < 86400) return `${Math.floor(s / 3600)} saat əvvəl`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)} gün əvvəl`;
  return fmtDate(v);
}
export function initials(name?: string | null) {
  return (name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('');
}
export function Avatar({ name, size = 28 }: { name?: string | null; size?: number }) {
  const hue = [...(name || 'x')].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <span className="inline-grid place-items-center rounded-full font-semibold text-ink shrink-0" style={{ width: size, height: size, fontSize: size * 0.4, background: `hsl(${hue} 70% 78%)` }}>
      {initials(name)}
    </span>
  );
}

export function PageHead({ title, sub, children }: { title: string; sub?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div className="min-w-0">
        <h1 className="font-display font-bold text-[26px] leading-tight tracking-[-0.02em]">{title}</h1>
        {sub && <p className="text-mut text-sm mt-1">{sub}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export function Card({ children, className = '', title, action }: { children: ReactNode; className?: string; title?: string; action?: ReactNode }) {
  return (
    <section className={`bg-panel border border-line rounded-2xl ${className}`}>
      {title && <header className="flex items-center justify-between gap-3 px-5 pt-4 pb-3"><h2 className="text-[13px] font-semibold text-mut-d">{title}</h2>{action}</header>}
      {children}
    </section>
  );
}

export const btn = {
  primary: 'inline-flex items-center gap-2 rounded-lg bg-brand text-ink font-semibold text-[13.5px] px-3.5 py-2 hover:brightness-105 active:scale-[.98] transition disabled:opacity-50',
  ghost: 'inline-flex items-center gap-2 rounded-lg border border-line bg-panel2 text-paper text-[13.5px] px-3 py-2 hover:bg-panel3 transition disabled:opacity-50',
  icon: 'inline-grid place-items-center w-8 h-8 rounded-lg text-mut hover:text-paper hover:bg-white/[.06] transition',
};
export const input = 'w-full bg-ink border border-line rounded-lg px-3 py-2.5 text-[14px] text-paper placeholder:text-white/25 outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/15 disabled:opacity-40';
