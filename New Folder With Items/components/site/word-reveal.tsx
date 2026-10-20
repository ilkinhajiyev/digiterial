/** Başlığı sözlərə bölüb hər sözü maskanın altından ardıcıl qaldırır (yalnız CSS). `*söz*` = kobalt vurğu. */
export default function WordReveal({ text, delay = 0, step = 45 }: { text?: string; delay?: number; step?: number }) {
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
          return (
            <span key={`${si}-${wi}`} className="inline-block overflow-hidden pb-[.1em] -mb-[.1em] align-bottom">
              <span className="line-up" style={{ animationDelay: `${d}ms` }}>{si % 2 ? <em>{w}</em> : w}</span>
            </span>
          );
        })
      )}
    </>
  );
}
