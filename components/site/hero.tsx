'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

export default function Hero({ p }: { p: any }) {
  const th = useTranslations('hero');

  return (
    <section className={`${p.showAside ? 'min-h-[820px] lg:min-h-screen' : 'min-h-[620px]'} pt-28 md:pt-36 pb-10 border-b border-white/10 flex items-center`}>
      <div className="wrap w-full">
        <div className={`${p.showAside ? 'grid lg:grid-cols-[1.35fr_.65fr] gap-14 lg:gap-20' : ''} items-end`}>
          <div className="max-w-[920px]">
            <div className="flex items-center gap-3 font-mono text-[.68rem] sm:text-xs tracking-[.16em] uppercase text-neutral-400 mb-8">
              <span className="w-7 h-px bg-brand" /> {p.eyebrow}
            </div>
            <h1 className="font-display font-medium text-[clamp(3.4rem,8.1vw,8rem)] leading-[.88] tracking-[-.065em] text-[#f1f2ea]">{p.h1}</h1>
            {p.lead && <p className="mt-8 max-w-[58ch] text-neutral-300 text-base sm:text-lg md:text-xl leading-relaxed">{p.lead}</p>}
            <div className="flex gap-3 mt-9 flex-wrap">
              <Link href={p.b1Href || '/xidmetler'} className="hbtn hbtn-y min-w-[190px]">{p.b1} <ArrowUpRight size={18} /></Link>
              <Link href={p.b2Href || '/elaqe'} className="hbtn hbtn-o min-w-[170px]">{p.b2} <span>→</span></Link>
            </div>
          </div>

          {p.showAside && <aside className="border-t border-white/20 lg:border-t-0 lg:border-l lg:pl-10 pt-7 lg:pt-0 pb-1">
            <div className="font-mono text-[.68rem] uppercase tracking-[.18em] text-neutral-500 mb-7">{th('whatWeDo')}</div>
            <div className="border-t border-white/10">
              {[th('focus1'), th('focus2'), th('focus3')].map((item, i) => (
                <div key={item} className="flex gap-5 py-5 border-b border-white/10">
                  <span className="font-mono text-[.68rem] text-brand pt-1">0{i + 1}</span>
                  <span className="font-display text-lg text-neutral-200">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between gap-6 text-sm">
              <div><span className="block text-neutral-500 text-xs mb-1">{th('basedIn')}</span>Bakı, Azərbaycan</div>
              <div className="flex items-center gap-2 text-neutral-300"><span className="w-2 h-2 rounded-full bg-brand" />{th('available')}</div>
            </div>
          </aside>}
        </div>

        {p.showAside && <a href="#services" className="mt-12 md:mt-16 inline-flex items-center gap-3 font-mono text-[.68rem] uppercase tracking-[.18em] text-mut-d hover:text-brand transition-colors">
          <span className="w-10 h-10 rounded-full border border-white/15 grid place-items-center"><ArrowDown size={15} /></span>{th('explore')}
        </a>}
      </div>
    </section>
  );
}
