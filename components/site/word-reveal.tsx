/** Başlığı sözlərə bölüb hər sözü maskanın altından ardıcıl qaldırır (yalnız CSS). `*söz*` = qızılı kursiv. */
export default function WordReveal({ text, delay = 0, step = 55 }: { text?: string; delay?: number; step?: number }) {
  if (!text) return null;
  let i = 0;
  const segs = String(text).split(/\*([^*]+)\*/g);
  return (
    <>
      {segs.map((seg, si) =>
        seg.split(/(\s+)/).map((w, wi) => {
          if (!w) return null;
          if (/^\s+$/.test(w)) return ' ';
          const d = delay + i++ * step;
          const inner = si % 2 ? <em>{w}</em> : w;
          return (
            <span key={`${si}-${wi}`} className="inline-block overflow-hidden pb-[.22em] -mb-[.22em] pt-[.04em] -mt-[.04em] align-bottom">
              <span className="line-up inline-block" style={{ animationDelay: `${d}ms` }}>{inner}</span>
            </span>
          );
        })
      )}
    </>
  );
}
