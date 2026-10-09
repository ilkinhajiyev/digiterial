import 'server-only';
import { getTranslations } from 'next-intl/server';
import type { Block } from '@/lib/data/page-registry';

/**
 * Hər səhifənin standart blokları — tərcümə fayllarından qurulur.
 * Builder-də həmin səhifə/dil saxlanılmayıbsa, sayt bunları göstərir;
 * builder də redaktə üçün bu blokları başlanğıc kimi açır.
 */
export async function defaultBlocks(key: string, locale: string): Promise<Block[]> {
  const t = await getTranslations({ locale, namespace: 'home' });
  const th = await getTranslations({ locale, namespace: 'hero' });
  const c = await getTranslations({ locale, namespace: 'common' });
  const pg = await getTranslations({ locale, namespace: 'pages' });

  const marquee: Block = { type: 'marquee', props: { items: ['i1', 'i2', 'i3', 'i4', 'i5', 'i6'].map((k) => t(`marquee.${k}`)) } };
  const band: Block = { type: 'band', props: { label: t('band.label'), big: t('band.big'), h3: t('band.h3'), p: t('band.p') } };
  const workbench: Block = { type: 'workbench', props: { label: t('workbench.label'), heading: t('workbench.heading'), text: t('workbench.text'), items: [1, 2, 3, 4].map((n) => ({ h: t(`workbench.h${n}`), p: t(`workbench.p${n}`) })) } };
  const process: Block = { type: 'process', props: { label: t('process.label'), heading: t('process.heading'), text: t('process.text'), items: [1, 2, 3, 4].map((n) => ({ h: t(`process.h${n}`), p: t(`process.p${n}`) })) } };
  const toolkit: Block = { type: 'toolkit', props: { label: t('toolkit.label'), heading: t('toolkit.heading'), text: t('toolkit.text'), row1: [1, 2, 3, 4].map((n) => t(`toolkit.r${n}`)), row2: [5, 6, 7, 8].map((n) => t(`toolkit.r${n}`)) } };
  const principles: Block = { type: 'principles', props: { label: t('principles.label'), heading: t('principles.heading'), items: [1, 2, 3].map((n) => ({ h: t(`principles.h${n}`), p: t(`principles.p${n}`) })) } };
  const faq: Block = { type: 'faq', props: { label: t('faq.label'), heading: t('faq.heading'), items: [1, 2, 3, 4, 5].map((n) => ({ q: t(`faq.q${n}`), a: t(`faq.a${n}`) })) } };
  const cta: Block = { type: 'cta', props: { h2: t('cta.h2'), p: t('cta.p'), b1: t('cta.b1') } };
  const work: Block = { type: 'work', props: { label: t('work.label'), heading: t('work.heading'), b1: t('work.all'), limit: 3 } };

  switch (key) {
    case 'home':
      return [
        { type: 'hero', props: { eyebrow: th('eyebrow'), h1: th('h1'), lead: th('lead'), b1: th('b1'), b2: th('b2'), b1Href: '/elaqe', b2Href: '/isler', showAside: true } },
        marquee, band,
        { type: 'services', props: { label: t('servicesHead.label'), heading: t('servicesHead.heading'), text: t('servicesHead.text') } },
        workbench, process, work, toolkit, principles, faq, cta,
      ];
    case 'services':
      return [
        { type: 'hero', props: { eyebrow: pg('services.eyebrow'), h1: pg('services.h1'), lead: pg('services.lead'), b1: c('audit'), b2: c('work'), b1Href: '/elaqe', b2Href: '/isler' } },
        { type: 'services', props: { label: t('servicesHead.label'), heading: t('servicesHead.heading'), text: t('servicesHead.text') } },
        workbench, process, faq, cta,
      ];
    case 'about':
      return [
        { type: 'hero', props: { eyebrow: pg('about.eyebrow'), h1: `${pg('about.h1a')} ${pg('about.h1b')}`, lead: pg('about.lead'), b1: c('contact'), b2: c('services'), b1Href: '/elaqe', b2Href: '/xidmetler' } },
        { type: 'richtext', props: { label: pg('about.storyLabel'), h: pg('about.storyH'), p: `${pg('about.storyP1')}\n${pg('about.storyP2')}` } },
        band, principles, process, toolkit, cta,
      ];
    case 'case-studies':
      return [
        { type: 'hero', props: { eyebrow: pg('cases.eyebrow'), h1: `${pg('cases.h1a')} ${pg('cases.h1b')}`, lead: pg('cases.lead'), b1: c('contact'), b2: c('services'), b1Href: '/elaqe', b2Href: '/xidmetler' } },
        { ...work, props: { ...work.props, limit: 12, featuredOnly: false } },
        process, cta,
      ];
    default:
      return [];
  }
}
