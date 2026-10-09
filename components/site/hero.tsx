import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import HeroSlider, { type HeroSlide } from '@/components/site/hero-slider';
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

  // Ana səhifə: slayderli hero. 1-ci slayd builder-dəki hero mətnindən gəlir.
  const sl = (k: string) => th(`slider.${k}`);
  const slides: HeroSlide[] = [
    { key: 'growth', nav: sl('s1.nav'), tag: p.eyebrow || sl('s1.tag'), h: p.h1, p: p.lead, b1: p.b1, b1Href: p.b1Href || '/elaqe', b2: p.b2, b2Href: p.b2Href || '/isler' },
    { key: 'web', nav: sl('s2.nav'), tag: sl('s2.tag'), h: sl('s2.h'), p: sl('s2.p'), b1: sl('s2.b'), b1Href: '/xidmetler/veb-saytlar', b2: p.b1, b2Href: '/elaqe' },
    { key: 'seo', nav: sl('s3.nav'), tag: sl('s3.tag'), h: sl('s3.h'), p: sl('s3.p'), b1: sl('s3.b'), b1Href: '/xidmetler/seo', b2: p.b1, b2Href: '/elaqe', extra: { q: sl('s3.q'), you: sl('s3.you') } },
    { key: 'ads', nav: sl('s4.nav'), tag: sl('s4.tag'), h: sl('s4.h'), p: sl('s4.p'), b1: sl('s4.b'), b1Href: '/xidmetler/reklam', b2: p.b1, b2Href: '/elaqe', extra: { f1: sl('s4.f1'), f2: sl('s4.f2'), f3: sl('s4.f3'), f4: sl('s4.f4'), ch: sl('s4.ch') } },
  ];
  return (
    <HeroSlider slides={slides} labels={{
      label: sl('label'), prev: sl('prev'), next: sl('next'), pause: sl('pause'), play: sl('play'), available: th('available'),
      sig: [th('sig1'), th('sig2'), th('sig3')], focus: [th('focus1'), th('focus2'), th('focus3')],
    }} />
  );
}
