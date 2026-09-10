'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import DigitalScene from './digital-scene';

export default function Hero({ p }: { p: any }) {
  const th = useTranslations('hero');

  return (
    <section className={`${p.showAside ? 'home-hero min-h-[760px] lg:min-h-[860px]' : 'min-h-[620px]'} pt-28 md:pt-36 pb-10 border-b border-white/10 flex items-center relative overflow-hidden`}>
      {p.showAside && <><div aria-hidden className="hero-rules absolute inset-0" /><div aria-hidden className="hero-beam absolute top-0 bottom-0 w-px bg-brand/70" /></>}
      <div className="wrap w-full relative">
        <div className={`${p.showAside ? 'hero-layout grid lg:grid-cols-[1.05fr_.95fr] gap-8 lg:gap-12' : ''} items-center`}>
          <div className="max-w-[920px]">
            <div className="hero-eyebrow flex items-center gap-3 font-mono text-[.68rem] sm:text-xs tracking-[.16em] uppercase text-neutral-400 mb-8">
              <span className="w-7 h-px bg-brand" /> {p.eyebrow}
            </div>
            <h1 className="hero-title-in font-display font-medium text-[clamp(3rem,5.5vw,5.6rem)] leading-[1.02] tracking-[-.065em] text-[#f1f2ea]">{p.h1}</h1>
            {p.lead && <p className="hero-copy-in mt-8 max-w-[58ch] text-neutral-300 text-base sm:text-lg md:text-xl leading-relaxed">{p.lead}</p>}
            <div className="hero-copy-in flex gap-3 mt-9 flex-wrap">
              <Link href={p.b1Href || '/xidmetler'} className="hbtn hbtn-y min-w-[190px]">{p.b1} <ArrowUpRight size={18} /></Link>
              <Link href={p.b2Href || '/elaqe'} className="hbtn hbtn-o min-w-[170px]">{p.b2} <span>→</span></Link>
            </div>
          </div>

          {p.showAside && <DigitalScene />}

        </div>

        {p.showAside && <div className="hero-meta"><span><i />{th('available')}</span><span>Bakı, Azərbaycan · 40.4093° N</span><span>Strategy / Design / Technology</span></div>}
        {p.showAside && <a href="#services" className="scrollcue mt-6 inline-flex items-center gap-3 font-mono text-[.68rem] uppercase tracking-[.18em] text-mut-d hover:text-brand transition-colors">
          <span className="w-10 h-10 rounded-full border border-white/15 grid place-items-center"><ArrowDown size={15} /></span>{th('explore')}
        </a>}
      </div>
    </section>
  );
}
