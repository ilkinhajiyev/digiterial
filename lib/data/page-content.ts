import az from '@/messages/az.json';
import en from '@/messages/en.json';
import ru from '@/messages/ru.json';
import de from '@/messages/de.json';

const COMPLETE_MARKER = '__builder_complete';
const dictionaries: Record<string, any> = { az, en, ru, de };

export function getDefaultPageBlocks(key: string, locale: string) {
  const m = dictionaries[locale] || dictionaries.az;
  const c = m.common;
  const h = m.home;
  const page = m.pages;
  const hero = (p: any) => ({
    type: 'hero',
    props: {
      eyebrow: p.eyebrow,
      h1: [p.h1, p.h1a, p.h1b].filter(Boolean).join(' '),
      lead: p.lead,
      b1: c.services,
      b2: c.contact,
    },
  });
  const cta = { type: 'cta', props: { h2: h.cta.h2, p: h.cta.p, b1: h.cta.b1 } };

  if (key === 'home') {
    return [
      { type: 'hero', props: { eyebrow: m.hero.eyebrow, h1: m.hero.h1, lead: m.hero.lead, b1: m.hero.b1, b2: m.hero.b2, b1Href: '/elaqe', b2Href: '/isler', showAside: true } },
      { type: 'marquee', props: { items: Object.values(h.marquee) } },
      { type: 'band', props: { ...h.band } },
      { type: 'services', props: { label: h.servicesHead.label, heading: h.servicesHead.heading, light: true } },
      { type: 'workbench', props: { label: h.workbench.label, heading: h.workbench.heading, text: h.workbench.text, items: [1, 2, 3, 4].map(i => ({ h: h.workbench[`h${i}`], p: h.workbench[`p${i}`] })) } },
      { type: 'selectedWork', props: { label: h.selectedWork.label, heading: h.selectedWork.heading, viewAll: h.selectedWork.viewAll } },
      { type: 'process', props: { label: h.process.label, heading: h.process.heading, text: h.process.text, items: [1, 2, 3].map(i => ({ h: h.process[`h${i}`], p: h.process[`p${i}`] })) } },
      { type: 'legacy', props: { label: h.legacy.label, heading: h.legacy.heading, text: h.legacy.text, since: h.legacy.since, items: [h.legacy.i1, h.legacy.i2, h.legacy.i3] } },
      { type: 'toolkit', props: { label: h.toolkit.label, heading: h.toolkit.heading, text: h.toolkit.text, row1: [h.toolkit.r1, h.toolkit.r2, h.toolkit.r3, h.toolkit.r4], row2: [h.toolkit.r5, h.toolkit.r6, h.toolkit.r7, h.toolkit.r8] } },
      { type: 'principles', props: { label: h.principles.label, heading: h.principles.heading, items: [1, 2, 3].map(i => ({ h: h.principles[`h${i}`], p: h.principles[`p${i}`] })) } },
      { type: 'faq', props: { label: h.faq.label, items: [1, 2, 3, 4].map(i => ({ q: h.faq[`q${i}`], a: h.faq[`a${i}`] })) } },
      cta,
    ];
  }

  if (key === 'services') return [
    { ...hero(page.services), props: { ...hero(page.services).props, b1: c.audit, b2: c.work } },
    { type: 'services', props: { label: h.servicesHead.label, heading: page.services.h1 } },
    cta,
  ];
  if (key === 'work') return [hero(page.work), cta];
  if (key === 'about') return [hero(page.about), cta];
  if (key === 'blog') return [hero(page.blog), cta];
  if (key === 'case-studies') return [hero(page.cases), cta];
  if (key === 'contact') return [{
    type: 'contact',
    props: {
      eyebrow: page.contact.eyebrow,
      h1: page.contact.h1a,
      accent: page.contact.h1b,
      lead: page.contact.lead,
      emailLabel: page.contact.iEmail,
      phoneLabel: page.contact.iPhone,
      addressLabel: page.contact.iAddr,
      hoursLabel: page.contact.iHours,
      hours: page.contact.hours,
    },
  }];
  return [];
}

export function resolvePageBlocks(defaults: any[], saved: any[] | null | undefined) {
  if (!saved?.length) return defaults;
  const complete = saved.some(block => block?.type === COMPLETE_MARKER);
  const clean = saved.filter(block => block?.type !== COMPLETE_MARKER);
  if (complete) return clean;

  // Köhnə builder məlumatlarını yeni bölmələrlə təhlükəsiz şəkildə birləşdirir.
  const consumed = new Set<number>();
  const merged = defaults.map(block => {
    const index = clean.findIndex((savedBlock, i) => !consumed.has(i) && savedBlock.type === block.type);
    if (index === -1) return block;
    consumed.add(index);
    return { ...block, ...clean[index], props: { ...block.props, ...(clean[index].props || {}) } };
  });
  clean.forEach((block, i) => { if (!consumed.has(i)) merged.push(block); });
  return merged;
}

export function preparePageBlocks(blocks: any[]) {
  return [{ type: COMPLETE_MARKER, props: { version: 1 } }, ...blocks.filter(block => block?.type !== COMPLETE_MARKER)];
}
