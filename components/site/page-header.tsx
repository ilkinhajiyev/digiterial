import { ChevronRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import WordReveal from '@/components/site/word-reveal';
import { JsonLd } from '@/components/site/jsonld';
import { SITE_URL, localePath } from '@/lib/seo';

type Crumb = { href: string; label: string };

/** Daxili səhifə başlığı + görünən breadcrumb + BreadcrumbList schema. */
export default async function PageHeader({ eyebrow, title, lead, back, crumbs, locale, children }: {
  eyebrow?: string; title: string; lead?: string; back?: Crumb; crumbs?: Crumb[]; locale?: string; children?: React.ReactNode;
}) {
  const n = await getTranslations('nav');
  const trail: Crumb[] = [{ href: '/', label: n('home') }, ...(crumbs || (back ? [back] : []))];
  const ld = locale ? {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [...trail, { href: '', label: title.replace(/\*/g, '') }].map((c, i) => ({
      '@type': 'ListItem', position: i + 1, name: c.label, ...(c.href ? { item: `${SITE_URL}${localePath(locale, c.href)}` } : {}),
    })),
  } : null;

  return (
    <section className="relative overflow-hidden border-b border-[color:var(--line)] pb-14 pt-32 md:pb-20 md:pt-40">
      {ld && <JsonLd data={ld} />}
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-brand/[.08] blur-[110px]" />
      <div className="wrap relative">
        <nav aria-label="Breadcrumb" className="fade-up d1 mb-10">
          <ol className="flex flex-wrap items-center gap-1.5 text-[.85rem] text-muted">
            {trail.map((c) => (
              <li key={c.href} className="flex items-center gap-1.5"><Link href={c.href} className="transition hover:text-fg">{c.label}</Link><ChevronRight size={14} className="text-muted" /></li>
            ))}
            <li aria-current="page" className="max-w-[40ch] truncate text-fg">{title.replace(/\*/g, '')}</li>
          </ol>
        </nav>
        {eyebrow && <div className="eyebrow fade-up d1">{eyebrow}</div>}
        <h1 className="t-h1 mt-5 max-w-[18ch]"><WordReveal text={title} delay={100} /></h1>
        {(lead || children) && (
          <div className="mt-10 grid items-end gap-8 md:grid-cols-12">
            {lead && <p className="t-lead fade-up d3 md:col-span-7">{lead}</p>}
            {children && <div className="fade-up d4 md:col-span-5 md:flex md:justify-end">{children}</div>}
          </div>
        )}
      </div>
    </section>
  );
}
