export default function Logo({ brand = 'Digiterial', logoUrl, className = '' }: { brand?: string; logoUrl?: string; className?: string }) {
  if (logoUrl) return <img src={logoUrl} alt={brand} className={`h-8 w-auto object-contain ${className}`} />;
  return (
    <span className={`inline-flex items-baseline font-display text-[1.7rem] font-medium leading-none tracking-[-.02em] ${className}`}>
      {brand}<sup className="ml-0.5 font-body text-[.6rem] font-normal text-brand">®</sup>
    </span>
  );
}
