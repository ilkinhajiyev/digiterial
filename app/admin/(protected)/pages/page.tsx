import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

const LOCALES: Record<string, string> = { az: '🇦🇿 AZ', en: '🇬🇧 EN', ru: '🇷🇺 RU' };
const STATUS_COLOR: Record<string, string> = { published: 'text-brand border-brand/40', draft: 'text-mut border-white/15' };

export default async function Page() {
  const sb = await createClient();
  const { data } = await sb.from('pages').select('*').order('updated_at', { ascending: false });
  const rows = (data as any[]) || [];

  return (
    <>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Sayt / Səhifələr</h1>
          <p className="text-white/40 text-sm mt-0.5">{rows.length} səhifə · Builder ilə redaktə</p>
        </div>
        <Link href="/admin/builder"
          className="bg-brand text-ink font-semibold text-sm rounded-lg px-4 py-2.5 hover:opacity-90 active:scale-95 transition">
          Vizual Builder →
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { l: 'Cəmi', v: rows.length },
          { l: 'Yayımlanıb', v: rows.filter(r => r.status === 'published').length },
          { l: 'Qaralama', v: rows.filter(r => r.status === 'draft').length },
        ].map(k => (
          <div key={k.l} className="bg-[#121212] border border-white/10 rounded-xl p-4">
            <div className="font-mono text-[.65rem] uppercase text-white/40">{k.l}</div>
            <div className="font-display font-bold text-2xl mt-1">{k.v}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr>
              {['Səhifə', 'Slug', 'Dil', 'Status', 'Yenilənib', ''].map(h => (
                <th key={h} className="text-left font-mono text-[.65rem] uppercase text-white/40 font-medium px-4 py-3 border-b border-white/10">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(p => (
              <tr key={p.id} className="hover:bg-white/[0.03] transition group">
                <td className="px-4 py-3.5 border-b border-white/5 font-medium">{p.key}</td>
                <td className="px-4 py-3.5 border-b border-white/5 font-mono text-white/50 text-xs">{p.slug}</td>
                <td className="px-4 py-3.5 border-b border-white/5 font-mono text-xs">{LOCALES[p.locale] ?? p.locale}</td>
                <td className="px-4 py-3.5 border-b border-white/5">
                  <span className={`font-mono text-[.68rem] border rounded-full px-2 py-0.5 ${STATUS_COLOR[p.status] ?? 'text-mut border-white/15'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 border-b border-white/5 font-mono text-xs text-white/40">
                  {new Date(p.updated_at).toLocaleDateString('az-AZ', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </td>
                <td className="px-4 py-3.5 border-b border-white/5 text-right">
                  <Link href="/admin/builder"
                    className="font-mono text-xs text-brand opacity-0 group-hover:opacity-100 transition hover:underline">
                    Redaktə →
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <div className="text-white/25 font-mono text-sm">Hələ səhifə yoxdur</div>
                  <div className="mt-3">
                    <Link href="/admin/builder" className="bg-brand text-ink font-semibold text-sm rounded-lg px-4 py-2.5 inline-block">
                      Builder-dən yarat →
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Info banner */}
      <div className="mt-4 bg-brand/5 border border-brand/20 rounded-xl p-4 flex items-start gap-3">
        <span className="text-brand text-lg mt-0.5">ℹ</span>
        <div>
          <div className="text-sm font-medium text-brand mb-1">Səhifələr necə idarə olunur?</div>
          <p className="text-white/50 text-sm">Vizual Builder-dən blokları redaktə edib <b className="text-white/70">💾 Yadda saxla</b> basın — dəyişiklik avtomatik olaraq bu siyahıda <span className="text-brand">published</span> kimi əks olunur və sayta canlı çıxır.</p>
        </div>
      </div>
    </>
  );
}
