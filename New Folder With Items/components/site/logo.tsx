export default function Logo({ brand = 'Digiterial', logoUrl, className = '', dark = false }: { brand?: string; logoUrl?: string; className?: string; dark?: boolean }) {
  if (logoUrl) return <img src={logoUrl} alt={brand} className={`h-8 w-auto object-contain ${className}`} />;
  return (
    <span className={`inline-flex items-center gap-2 font-display text-[1.3rem] font-semibold tracking-[-.05em] ${className}`}>
      <span aria-hidden className="grid h-7 w-7 grid-cols-2 gap-[3px] rounded-[7px] bg-brand p-[6px]">
        <span className="rounded-[1.5px] bg-onbrand" /><span className="rounded-[1.5px] bg-onbrand/35" />
        <span className="rounded-[1.5px] bg-onbrand/35" /><span className="rounded-[1.5px] bg-onbrand" />
      </span>
      <span className="text-fg">{brand.toLowerCase()}</span>
    </span>
  );
}
