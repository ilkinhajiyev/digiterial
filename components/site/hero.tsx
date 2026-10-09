import { getTranslations } from 'next-intl/server';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { BakuClock } from '@/components/site/interactive';
import { SignalField } from '@/components/site/fx';
import WordReveal from '@/components/site/word-reveal';

export default async function Hero({ p }: { p: any }) {
  const home = !!p.showAside;
  const th = await getTranslations('hero');

  if (!home) {
    // Daxili səhifələr üçün başlıq
    return (
      <section className="relative overflow-hidden border-b border-[color:var(--line)] pb-14 pt-36 md:pb-20 md:pt-44">
        <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
        <div className="wrap relative">
          {p.eyebrow && <div className="eyebrow fade-up d1">{p.eyebrow}</div>}
          <h1 className="t-h1 mt-6 max-w-[17ch]"><WordReveal text={p.h1} delay={100} /></h1>
          <div className="mt-10 grid items-end gap-8 md:grid-cols-12">
            {p.lead && <p className="t-lead fade-up d3 md:col-span-7">{p.lead}</p>}
            {(p.b1 || p.b2) && (
              <div className="fade-up d4 flex flex-wrap gap-3 md:col-span-5 md:justify-end">
                {p.b1 && <Link href={p.b1Href || '/elaqe'} className="btn-accent">{p.b1} <ArrowRight size={18} className="arr" /></Link>}
                {p.b2 && <Link href={p.b2Href || '/isler'} className="btn-ghost">{p.b2}</Link>}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  const proofs = [th('proof1'), th('proof2'), th('proof3')];
  return (
    <section className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,#000_60%,transparent)]" />
      <div aria-hidden className="pointer-events-none absolute -right-48 -top-48 h-[640px] w-[640px] rounded-full bg-brand/[.10] blur-[120px]" />

      <div className="wrap relative grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <div className="pill-live fade-up d1 w-fit"><span className="live-dot" />{th('available')}</div>
          {p.eyebrow && <div className="fade-up d2 mt-8"><p className="eyebrow">{p.eyebrow}</p></div>}
          <h1 className="t-hero mt-5 max-w-[13ch]"><WordReveal text={p.h1} delay={150} /></h1>
          {p.lead && <p className="t-lead fade-up d4 mt-8 max-w-[54ch]">{p.lead}</p>}
          <div className="fade-up d5 mt-10 flex flex-wrap gap-3">
            {p.b1 && <Link href={p.b1Href || '/elaqe'} className="btn-accent">{p.b1} <ArrowRight size={18} className="arr" /></Link>}
            {p.b2 && <Link href={p.b2Href || '/isler'} className="btn-ghost">{p.b2}</Link>}
          </div>
          <ul className="fade-up d6 mt-10 grid gap-3 text-[.95rem] text-fg sm:grid-cols-3 sm:gap-5">
            {proofs.map((x) => (
              <li key={x} className="flex items-start gap-2.5"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-soft text-brand"><Check size={12} strokeWidth={3} /></span>{x}</li>
            ))}
          </ul>
        </div>

        {/* İnteraktiv "siqnal" paneli */}
        <div className="fade-up d4 lg:col-span-5">
          <div className="card overflow-hidden shadow-[0_40px_120px_-40px_rgba(61,255,168,.25)]">
            <div className="flex items-center justify-between border-b border-[color:var(--line)] px-5 py-3.5">
              <div className="flex items-center gap-1.5" aria-hidden><span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" /></div>
              <span className="font-mono text-[.7rem] text-muted">digiterial / growth.signal</span>
              <span className="flex items-center gap-1.5 font-mono text-[.7rem] text-muted"><span className="live-dot" />live</span>
            </div>
            <div className="relative aspect-[5/4] bg-[radial-gradient(120%_90%_at_100%_0%,rgba(61,255,168,.10),transparent_60%),linear-gradient(180deg,#0E0F12,#08090B)]">
              <SignalField labels={[th('sig1'), th('sig2'), th('sig3')]} />
            </div>
            <div className="grid grid-cols-3 divide-x divide-[color:var(--line)] border-t border-[color:var(--line)]">
              {[th('focus1'), th('focus2'), th('focus3')].map((f, i) => (
                <div key={f} className="px-4 py-3.5">
                  <div className="idx">0{i + 1}</div>
                  <div className="mt-1 text-[.82rem] font-medium leading-snug">{f}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-4 flex items-center justify-between font-mono text-[.72rem] text-muted">
            <span>{th('sigTitle')}</span>
            <span>{th('now')} · <BakuClock /></span>
          </p>
        </div>
      </div>
    </section>
  );
}
