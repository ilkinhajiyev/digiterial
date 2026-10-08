import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import WordReveal from '@/components/site/word-reveal';

export default function PageHeader({ eyebrow, title, lead, back, children }: { eyebrow?: string; title: string; lead?: string; back?: { href: string; label: string }; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-14 pt-40 md:pb-20 md:pt-52">
      <div aria-hidden className="aurora pointer-events-none absolute inset-0" />
      <div className="wrap relative">
        {back && <Link href={back.href} className="fade-up d1 mb-10 flex w-fit items-center gap-2 font-mono text-[.7rem] uppercase tracking-[.18em] text-ash transition hover:text-bone"><ArrowLeft size={14} />{back.label}</Link>}
        {eyebrow && <div className="eyebrow fade-up d1">{eyebrow}</div>}
        <h1 className="t-h1 mt-8 max-w-[15ch]"><WordReveal text={title} delay={150} /></h1>
        {(lead || children) && (
          <div className="mt-12 grid gap-8 border-t border-[color:var(--line)] pt-8 md:grid-cols-12">
            {lead && <p className="t-lead fade-up d4 md:col-span-6">{lead}</p>}
            {children && <div className="fade-up d5 md:col-span-6 md:flex md:justify-end">{children}</div>}
          </div>
        )}
      </div>
    </section>
  );
}
