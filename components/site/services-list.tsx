'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { services } from '@/lib/data/services';
import { ServiceIcon } from '@/components/site/service-icons';

export default function ServicesList({ label, heading }: { label: string; heading: string }) {
  const t = useTranslations('svc');
  const [active, setActive] = useState(0);
  const current = services[active];

  return (
    <section id="services" className="scroll-mt-20 py-24 md:py-32 bg-paper text-ink overflow-hidden">
      <div className="wrap">
        <div className="grid lg:grid-cols-[1.08fr_.92fr] gap-12 lg:gap-16 items-start">
          <div>
            <div className="elbl text-ink/55">{label}</div>
            <h2 className="font-display font-semibold text-[clamp(2.4rem,5.5vw,5.2rem)] leading-[.92] tracking-[-.055em] mt-5 max-w-[12ch]">{heading}</h2>

            <div className="mt-12 border-t border-ink/20">
              {services.map((service, idx) => {
                const isActive = active === idx;
                return (
                  <Link
                    key={service.slug}
                    href={`/xidmetler/${service.slug}`}
                    onMouseEnter={() => setActive(idx)}
                    onFocus={() => setActive(idx)}
                    onTouchStart={() => setActive(idx)}
                    className={`service-row group relative grid grid-cols-[38px_1fr_auto] gap-3 sm:gap-5 items-center py-5 sm:py-6 border-b border-ink/20 overflow-hidden ${isActive ? 'is-active' : ''}`}
                  >
                    <span className="service-sweep" aria-hidden />
                    <span className="relative z-10 font-mono text-xs transition-colors">{String(idx + 1).padStart(2, '0')}</span>
                    <div className="relative z-10 min-w-0">
                      <div className="flex items-center gap-3">
                        <ServiceIcon slug={service.slug} className="service-row-icon hidden sm:block w-6 h-6 shrink-0" />
                        <h3 className="font-display font-semibold text-[clamp(1.3rem,3vw,2.15rem)] tracking-tight truncate">{t(`${service.slug}.title`)}</h3>
                      </div>
                      <p className="lg:hidden text-sm mt-2 text-ink/60 group-[.is-active]:text-white/65 line-clamp-2">{t(`${service.slug}.short`)}</p>
                    </div>
                    <span className="service-arrow relative z-10 w-10 h-10 rounded-full border border-ink/25 grid place-items-center transition-all">↗</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <aside className="hidden lg:block sticky top-28">
            <div key={current.slug} className="service-preview relative min-h-[560px] bg-ink text-white p-9 xl:p-11 overflow-hidden">
              <div aria-hidden className="service-preview-orbit" />
              <div className="relative z-10 h-full min-h-[480px] flex flex-col justify-between">
                <div className="flex justify-between items-start gap-6">
                  <span className="font-mono text-[.68rem] uppercase tracking-[.18em] text-white/45">Digiterial / {String(active + 1).padStart(2, '0')}</span>
                  <span className="service-preview-icon text-brand"><ServiceIcon slug={current.slug} className="w-16 h-16" /></span>
                </div>
                <div>
                  <span className="font-mono text-xs uppercase tracking-[.16em] text-brand">{t(`${current.slug}.tag`)}</span>
                  <h3 className="font-display font-semibold text-[clamp(2.4rem,4vw,4.5rem)] leading-[.9] tracking-[-.05em] mt-5">{t(`${current.slug}.title`)}</h3>
                  <p className="text-white/65 text-lg leading-relaxed mt-6 max-w-[40ch]">{t(`${current.slug}.short`)}</p>
                  <div className="mt-9 pt-6 border-t border-white/15 flex items-center justify-between font-mono text-xs uppercase tracking-[.14em]">
                    <span>{label}</span><span className="text-brand">Explore ↗</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
