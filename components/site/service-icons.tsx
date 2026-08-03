export function ServiceIcon({ slug, className = 'w-8 h-8' }: { slug: string; className?: string }) {
  const c = `${className}`;
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (slug) {
    case 'veb-saytlar': return (<svg viewBox="0 0 24 24" className={c}><rect x="2.5" y="4" width="19" height="14" rx="2" {...p} /><path d="M2.5 8h19M6 6h.01M9 6h.01" {...p} /><path d="M9 21h6" {...p} /></svg>);
    case 'seo': return (<svg viewBox="0 0 24 24" className={c}><circle cx="10.5" cy="10.5" r="6.5" {...p} /><path d="M21 21l-5.2-5.2" {...p} /><path d="M8 10.5h5M10.5 8v5" {...p} /></svg>);
    case 'reklam': return (<svg viewBox="0 0 24 24" className={c}><circle cx="12" cy="12" r="9" {...p} /><circle cx="12" cy="12" r="5" {...p} /><circle cx="12" cy="12" r="1.4" {...p} /></svg>);
    case 'brendinq': return (<svg viewBox="0 0 24 24" className={c}><path d="M12 3l9 9-9 9-9-9 9-9z" {...p} /><path d="M8 12l4 4 4-4-4-4-4 4z" {...p} /></svg>);
    case 'smm': return (<svg viewBox="0 0 24 24" className={c}><circle cx="7" cy="7" r="3" {...p} /><circle cx="17" cy="17" r="3" {...p} /><path d="M9.5 8.5l5 7M17 7l-3 3M7 17l3-3" {...p} /></svg>);
    case 'ai-avtomatlasdirma': return (<svg viewBox="0 0 24 24" className={c}><rect x="6" y="6" width="12" height="12" rx="2" {...p} /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" {...p} /><circle cx="12" cy="12" r="2" {...p} /></svg>);
    default: return (<svg viewBox="0 0 24 24" className={c}><circle cx="12" cy="12" r="9" {...p} /><path d="M12 7v5l3 2" {...p} /></svg>);
  }
}
