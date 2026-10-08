import { getTranslations } from 'next-intl/server';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { BakuClock } from '@/components/site/interactive';
import { ServiceIcon } from '@/components/site/service-icons';
import { Accent } from '@/components/site/accent';

/** Ana səhifənin sağ tərəfi: dürüst məlumatlı "bento" kompozisiya (saxta statistika yoxdur). */
async function HeroBento() {
  const th = await getTranslations('hero');
  const h = await getTranslations('home');
  const sv = await getTranslations('svc');
  const layers = [1, 2, 3, 4].map((n) => h(`workbench.h${n}`));
  const focus = [['veb-saytlar', th('focus1')], ['reklam', th('focus2')], ['brendinq', th('focus3')]] as const;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4" aria-label={th('whatWeDo')}>
      {/* Sistem qatları */}
      <div className="rise rise-2 col-span-2 rounded-[1.5rem] bg-ink p-5 text-bone sm:col-span-1 sm:row-span-2 sm:p-6">
        <div className="flex items-center justify-between font-mono text-[.7rem] uppercase tracking-[.14em] text-[#A39E94]">
          <span>{th('layers')}</span><span>01—04</span>
        </div>
        <ol className="signal-track mt-6 space-y-5 sm:mt-8 sm:space-y-7">
          <span aria-hidden className="signal-dot" />
          {layers.map((l, i) => (
            <li key={i} className="relative pl-9">
              <span aria-hidden className="absolute left-[7px] top-[7px] h-[9px] w-[9px] rounded-full border border-white/30 bg-ink" />
              <span className="block font-mono text-[.68rem] text-[#8C877D]">0{i + 1}</span>
              <span className="block font-display text-[1.02rem] leading-snug tracking-tight">{l}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Status + saat */}
      <div className="rise rise-3 flex flex-col justify-between rounded-[1.5rem] bg-brand p-5 text-ink sm:p-6">
        <div className="flex items-center gap-2 text-[.85rem] font-medium"><span className="live-dot" />{th('available')}</div>
        <div className="mt-8">
          <div className="font-mono text-[.68rem] uppercase tracking-[.14em] text-ink/60">{th('now')}</div>
          <div className="font-display text-[2.3rem] font-medium leading-none tracking-tight sm:text-[2.8rem]"><BakuClock /></div>
          <div className="mt-2 text-[.82rem] text-ink/70">{th('reply')}</div>
        </div>
      </div>

      {/* Əsas istiqamətlər */}
      <div className="rise rise-4 rounded-[1.5rem] border border-line bg-bone p-5 sm:p-6">
        <div className="font-mono text-[.68rem] uppercase tracking-[.14em] text-mut">{th('whatWeDo')}</div>
        <ul className="mt-4 space-y-1">
          {focus.map(([slug, label]) => (
            <li key={slug}>
              <Link href={`/xidmetler/${slug}`} className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-paper" title={sv(`${slug}.title`)}>
                <ServiceIcon slug={slug} className="h-5 w-5 shrink-0 text-brand-deep" />
                <span className="text-[.9rem] leading-tight">{label}</span>
                <ArrowRight size={14} className="ml-auto opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default async function Hero({ p }: { p: any }) {
  const home = !!p.showAside;
  return (
    <section className={`relative overflow-hidden ${home ? 'pb-14 pt-28 md:pb-20 md:pt-36' : 'pb-14 pt-32 md:pb-20 md:pt-44'}`}>
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand/[.10] blur-3xl" />
      <div className={`wrap relative ${home ? 'grid items-end gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14' : ''}`}>
        <div>
          {p.eyebrow && <div className="eyebrow rise rise-1">{p.eyebrow}</div>}
          <h1 className={`t-h1 rise rise-2 mt-6 ${home ? 'max-w-[13ch]' : 'max-w-[18ch]'}`}><Accent text={p.h1} /></h1>
          {p.lead && <p className="t-lead rise rise-3 mt-6 max-w-[52ch]">{p.lead}</p>}
          {(p.b1 || p.b2) && (
            <div className="rise rise-4 mt-9 flex flex-wrap gap-3">
              {p.b1 && <Link href={p.b1Href || '/elaqe'} className="btn-primary">{p.b1} <ArrowUpRight size={18} className="arr" /></Link>}
              {p.b2 && <Link href={p.b2Href || '/isler'} className="btn-ghost">{p.b2}</Link>}
            </div>
          )}
        </div>
        {home && <HeroBento />}
      </div>
    </section>
  );
}
