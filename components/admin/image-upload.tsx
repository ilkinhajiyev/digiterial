'use client';
import { useState, useRef } from 'react';
import { uploadImage } from '@/lib/actions/upload';

/* ---- TƏK ŞƏKİL ---- */
export function ImageField({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const [url, setUrl] = useState(defaultValue || '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setErr('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await uploadImage(fd);
      if (r.ok && r.url) setUrl(r.url);
      else setErr(r.error || 'Xəta');
    } catch { setErr('Yükləmə xətası'); }
    finally { setBusy(false); }
  }

  return (
    <div>
      <input type="hidden" name={name} value={url} readOnly />
      <div className="flex items-center gap-3">
        <div className="w-20 h-20 rounded-lg border border-white/15 bg-[#0c0c0c] overflow-hidden shrink-0 grid place-items-center">
          {url
            ? <img src={url} alt="" className="w-full h-full object-cover" />
            : <span className="text-white/25 text-2xl">🖼</span>}
        </div>
        <div className="flex-1">
          <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
            className="bg-white/10 hover:bg-white/15 text-white text-sm rounded-lg px-4 py-2.5 transition disabled:opacity-50">
            {busy ? 'Yüklənir…' : url ? '🔄 Dəyiş' : '⬆ Şəkil seç'}
          </button>
          {url && (
            <button type="button" onClick={() => setUrl('')}
              className="ml-2 text-red-400 text-sm hover:underline">Sil</button>
          )}
          <input ref={inputRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
          {err && <p className="text-red-400 text-xs mt-1">{err}</p>}
          <p className="text-white/30 text-[.62rem] mt-1 font-mono">Kvadrat 1:1, min 800×800px, maks 5MB</p>
        </div>
      </div>
    </div>
  );
}

/* ---- QALEREYA (çox şəkil) ---- */
export function GalleryField({ name, defaultValue }: { name: string; defaultValue?: string }) {
  // defaultValue: newline-separated URLs (DB formatı) və ya JSON array
  const parse = (v?: string): string[] => {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    try { const j = JSON.parse(v); if (Array.isArray(j)) return j; } catch {}
    return String(v).split('\n').map(x => x.trim()).filter(Boolean);
  };
  const [urls, setUrls] = useState<string[]>(parse(defaultValue));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true); setErr('');
    const added: string[] = [];
    for (const file of files) {
      try {
        const fd = new FormData();
        fd.append('file', file);
        const r = await uploadImage(fd);
        if (r.ok && r.url) added.push(r.url);
        else setErr(r.error || 'Bəzi şəkillər yüklənmədi');
      } catch { setErr('Yükləmə xətası'); }
    }
    setUrls(prev => [...prev, ...added]);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = '';
  }

  function remove(i: number) { setUrls(prev => prev.filter((_, j) => j !== i)); }

  return (
    <div>
      {/* DB newline formatında saxlanılır */}
      <input type="hidden" name={name} value={urls.join('\n')} readOnly />
      <div className="grid grid-cols-4 gap-2 mb-2">
        {urls.map((u, i) => (
          <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-white/15 group">
            <img src={u} alt="" className="w-full h-full object-cover" />
            <button type="button" onClick={() => remove(i)}
              className="absolute top-1 right-1 w-6 h-6 rounded-md bg-black/70 text-red-400 text-xs opacity-0 group-hover:opacity-100 transition">✕</button>
          </div>
        ))}
        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
          className="aspect-square rounded-lg border border-dashed border-white/25 hover:border-brand text-white/40 hover:text-brand grid place-items-center text-2xl transition disabled:opacity-50">
          {busy ? '…' : '+'}
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={onPick} className="hidden" />
      {err && <p className="text-red-400 text-xs">{err}</p>}
      <p className="text-white/30 text-[.62rem] font-mono">Bir neçə şəkil seçə bilərsiniz · {urls.length} şəkil</p>
    </div>
  );
}
