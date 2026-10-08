import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Accent } from '@/components/site/accent';

export default function PageHeader({ eyebrow, title, lead, back, children }: { eyebrow?: string; title: string; lead?: string; back?: { href: string; label: string }; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-12 pt-32 md:pb-16 md:pt-40">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-brand/[.10] blur-3xl" />
      <div className="wrap relative">
        {back && <Link href={back.href} className="rise rise-1 mb-8 flex w-fit items-center gap-2 text-sm text-[color:var(--ink-2)] transition hover:text-ink"><ArrowLeft size={16} />{back.label}</Link>}
        {eyebrow && <div className="eyebrow rise rise-1">{eyebrow}</div>}
        <h1 className="t-h1 rise rise-2 mt-6 max-w-[18ch]"><Accent text={title} /></h1>
        {lead && <p className="t-lead rise rise-3 mt-6 max-w-[56ch]">{lead}</p>}
        {children && <div className="rise rise-4 mt-8">{children}</div>}
      </div>
    </section>
  );
}
