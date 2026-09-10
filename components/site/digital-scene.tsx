'use client';

import { useRef, type PointerEvent } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUpRight, Layers, MousePointer2, Sparkles } from 'lucide-react';

/** CSS 3D scene: local, resolution independent, no external assets or WebGL. */
export default function DigitalScene() {
  const t = useTranslations('hero');
  const ref = useRef<HTMLDivElement>(null);
  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    ref.current?.style.setProperty('--rx', `${-(event.clientY - bounds.top - bounds.height / 2) / 55}deg`);
    ref.current?.style.setProperty('--ry', `${(event.clientX - bounds.left - bounds.width / 2) / 45}deg`);
  }
  function reset() {
    ref.current?.style.setProperty('--rx', '0deg');
    ref.current?.style.setProperty('--ry', '0deg');
  }
  return <div className="digital-scene" onPointerMove={move} onPointerLeave={reset} aria-hidden="true">
    <div className="scene-halo" /><div className="scene-floor" />
    <div className="scene-world" ref={ref}>
      <div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" />
      <div className="scene-browser">
        <div className="browser-toolbar"><span className="browser-dots">● ● ●</span><span>digiterial / digital experience</span><ArrowUpRight size={12} /></div>
        <div className="browser-content">
          <div className="browser-brand">d<span>®</span><span className="browser-menu">☰</span></div>
          <div className="browser-kicker">DESIGNED TO MAKE A DIFFERENCE</div>
          <div className="browser-title">{t('systemLine1')}<br /><span>{t('systemLine2')}</span></div>
          <div className="mini-lines"><i /><i /></div>
          <div className="mini-button">DIGITERIAL STUDIO <ArrowUpRight size={12} /></div>
          <div className="chrome-object"><div className="chrome-core" /></div>
          <div className="browser-bottom"><span>INDEPENDENT DIGITAL STUDIO</span><span>01 — 03</span></div>
        </div>
      </div>
      <div className="floating-note note-design"><div className="note-icon"><Layers size={20}/></div><div><small>01 / DIGITAL CRAFT</small><strong>{t('focus3')}</strong></div></div>
      <div className="floating-note note-growth"><div className="growth-header"><Sparkles size={16} /><span>{t('analytics')}</span><ArrowUpRight size={16} /></div><div className="chart-bars">{[28,44,35,62,52,78,68,94].map((height,i)=><i key={i} style={{height: `${height}%`}} />)}</div><span className="growth-caption">{t('focus2')}</span></div>
      <div className="scene-cursor"><MousePointer2 size={25} fill="#ddfb45" /><span>Digiterial</span></div>
      <div className="scene-sphere" />
    </div>
    <div className="scene-caption"><span className="signal-dot" /> WEB · BRAND · GROWTH <span>© DIGITERIAL</span></div>
  </div>;
}
