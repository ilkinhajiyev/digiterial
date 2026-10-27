'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, label, money, ago, Avatar } from './ui';

export type KCol = { key: string; tone: string };
type Item = Record<string, any> & { id: string };

// Sürüşdür-burax lövhə: kartı başqa sütuna atanda server əməliyyatı çağırılır (optimistik yeniləmə)
export default function Kanban({ items, columns, field, move, onOpen, kind }: {
  items: Item[]; columns: KCol[]; field: string;
  move: (id: string, to: string) => Promise<{ ok: boolean; error?: string }>;
  onOpen?: (row: Item) => void; kind: 'lead' | 'task';
}) {
  const router = useRouter();
  const [list, setList] = useState(items);
  const [drag, setDrag] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => setList(items), [items]);

  const drop = async (to: string) => {
    const id = drag; setDrag(null); setOver(null);
    if (!id) return;
    const prev = list;
    const cur = prev.find((x) => x.id === id);
    if (!cur || cur[field] === to) return;
    setList(prev.map((x) => (x.id === id ? { ...x, [field]: to } : x)));
    const r = await move(id, to).catch(() => ({ ok: false, error: 'Bağlantı xətası' }));
    if (!r.ok) { setList(prev); setErr(r.error || 'Dəyişiklik yadda saxlanmadı.'); setTimeout(() => setErr(''), 4000); }
    else router.refresh();
  };

  return (
    <div>
      {err && <div className="mb-3 bg-danger/10 border border-danger/30 text-danger text-sm rounded-lg px-4 py-2.5" role="alert">{err}</div>}
      <div className="flex gap-3 overflow-x-auto adm-scroll pb-3 -mx-1 px-1">
        {columns.map((c) => {
          const col = list.filter((x) => (x[field] || columns[0].key) === c.key);
          const sum = kind === 'lead' ? col.reduce((a, x) => a + Number(x.value || 0), 0) : 0;
          return (
            <section key={c.key}
              onDragOver={(e) => { e.preventDefault(); setOver(c.key); }} onDragLeave={() => setOver((o) => (o === c.key ? null : o))} onDrop={() => drop(c.key)}
              className={`w-[284px] shrink-0 rounded-2xl border transition ${over === c.key ? 'border-brand/50 bg-brand/[.04]' : 'border-line bg-panel'} flex flex-col max-h-[calc(100vh-220px)]`}>
              <header className="flex items-center gap-2 px-3.5 pt-3.5 pb-2.5">
                <Badge v={c.key} />
                <span className="adm-num text-[12px] text-mut">{col.length}</span>
                {kind === 'lead' && <span className="ml-auto adm-num text-[12px] text-mut-d">{money(sum)}</span>}
              </header>
              <div className="flex-1 overflow-y-auto adm-scroll px-2.5 pb-2.5 flex flex-col gap-2 min-h-[80px]">
                {col.map((x) => (
                  <article key={x.id} draggable onDragStart={() => setDrag(x.id)} onDragEnd={() => { setDrag(null); setOver(null); }}
                    onClick={() => onOpen?.(x)} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') onOpen?.(x); }}
                    className={`group rounded-xl border border-line bg-panel2 p-3 cursor-grab active:cursor-grabbing hover:border-white/15 transition ${drag === x.id ? 'opacity-40 rotate-1' : ''}`}>
                    {kind === 'lead' ? (
                      <>
                        <div className="flex items-start gap-2.5">
                          <Avatar name={x.name} size={26} />
                          <div className="min-w-0 flex-1"><div className="font-medium text-[13.5px] truncate">{x.name}</div><div className="text-[12px] text-mut truncate">{x.company || x.email || '—'}</div></div>
                        </div>
                        {x.service && <div className="mt-2.5 text-[12.5px] text-mut-d line-clamp-2">{x.service}</div>}
                        <div className="mt-3 flex items-center gap-2">
                          <span className="adm-num font-semibold text-[13px]">{Number(x.value) ? money(x.value) : <span className="text-mut font-normal">Dəyər yox</span>}</span>
                          <span className="ml-auto text-[11.5px] text-mut">{ago(x.created_at)}</span>
                        </div>
                        {x.source && <div className="mt-2"><span className="text-[11px] text-mut">Mənbə: {label(x.source)}</span></div>}
                      </>
                    ) : (
                      <>
                        <div className="font-medium text-[13.5px] leading-snug">{x.title}</div>
                        <div className="mt-2.5 flex items-center gap-2 text-[12px] text-mut">
                          {x.area && <span className="rounded-md bg-white/[.06] px-1.5 py-0.5 text-mut-d">{x.area}</span>}
                          {x.due_date && <span className={`ml-auto adm-num ${new Date(x.due_date) < new Date() && x.status !== 'done' ? 'text-danger' : ''}`}>{new Date(x.due_date).toLocaleDateString('az-AZ', { day: 'numeric', month: 'short' })}</span>}
                        </div>
                      </>
                    )}
                  </article>
                ))}
                {col.length === 0 && <div className="rounded-xl border border-dashed border-line text-center text-[12px] text-mut py-6">Kartı bura atın</div>}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
