export default function Logo({ brand = 'Digiterial', logoUrl, className = '' }: { brand?: string; logoUrl?: string; className?: string }) {
  if (logoUrl) return <img src={logoUrl} alt={brand} className={`h-8 w-auto object-contain ${className}`} />;
  return (
    <span className={`inline-flex items-center gap-2 font-display text-[1.15rem] font-semibold tracking-[-.04em] ${className}`}>
      <span aria-hidden className="grid h-7 w-7 place-items-center rounded-[9px] bg-ink text-bone">
        <span className="h-2.5 w-2.5 rounded-[3px] bg-brand" />
      </span>
      {brand.toLowerCase()}
    </span>
  );
}
