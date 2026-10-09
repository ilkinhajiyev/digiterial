/** Mətndə *ulduz* arasındakı sözləri kobalt vurğu ilə göstərir (builder-də də işləyir). */
export function Accent({ text }: { text?: string }) {
  if (!text) return null;
  const parts = String(text).split(/\*([^*]+)\*/g);
  return <>{parts.map((p, i) => (i % 2 ? <em key={i}>{p}</em> : p))}</>;
}
export const plain = (s = '') => s.replace(/\*/g, '');
