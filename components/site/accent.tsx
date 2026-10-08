/** Mətndə *ulduz* arasındakı sözləri vurğulayır (builder-də də işləyir). */
export function Accent({ text }: { text?: string }) {
  if (!text) return null;
  const parts = String(text).split(/\*([^*]+)\*/g);
  return <>{parts.map((p, i) => (i % 2 ? <span key={i} className="relative whitespace-nowrap text-brand-deep"><span className="relative">{p}</span></span> : p))}</>;
}
