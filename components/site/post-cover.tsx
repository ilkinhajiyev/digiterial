/** Şəkli olmayan məqalələr üçün kateqoriyaya görə generativ üz qabığı (SVG/CSS, şəkil yükləmir). */
const PATTERNS: Record<string, string> = {
  seo: 'radial-gradient(circle at 80% 20%, rgba(61,255,168,.35), transparent 45%), radial-gradient(circle at 10% 90%, rgba(61,255,168,.12), transparent 40%)',
  ads: 'conic-gradient(from 200deg at 70% 60%, rgba(61,255,168,.0), rgba(61,255,168,.35), rgba(61,255,168,0) 40%)',
  web: 'linear-gradient(135deg, rgba(61,255,168,.22), transparent 55%), radial-gradient(circle at 85% 85%, rgba(255,255,255,.08), transparent 40%)',
  default: 'radial-gradient(circle at 70% 30%, rgba(61,255,168,.25), transparent 50%)',
};
const kind = (c = '') => (/seo/i.test(c) ? 'seo' : /rekl|adv|рекл|werb/i.test(c) ? 'ads' : /veb|web|сайт|konv|conv/i.test(c) ? 'web' : 'default');

export default function PostCover({ title, category, keyword, large = false }: { title: string; category?: string; keyword?: string; large?: boolean }) {
  const k = kind(category);
  return (
    <div className="relative h-full w-full overflow-hidden bg-surface-2" style={{ backgroundImage: PATTERNS[k] }}>
      <div aria-hidden className="dot-grid absolute inset-0 opacity-60 [mask-image:linear-gradient(to_top,#000,transparent)]" />
      <div className="relative flex h-full flex-col justify-between p-6">
        {category && <span className="w-fit rounded-full border border-brand/40 bg-bg/60 px-3 py-1 font-mono text-[.68rem] uppercase tracking-[.12em] text-brand backdrop-blur">{category}</span>}
        <span aria-hidden className={`max-w-[18ch] font-semibold leading-[1.02] tracking-[-.04em] text-fg/90 ${large ? 'text-[clamp(1.8rem,4vw,3.4rem)]' : 'text-[1.5rem]'}`}>{(() => { const x = keyword || title; return x.charAt(0).toLocaleUpperCase() + x.slice(1); })()}</span>
      </div>
    </div>
  );
}
