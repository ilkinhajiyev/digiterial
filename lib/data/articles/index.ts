import { az } from './az';
import { en } from './en';
import { ru } from './ru';
import { de } from './de';
import type { Article } from './types';

export type { Article } from './types';

const ALL: Article[] = [...az, ...en, ...ru, ...de];

/** Dilə görə məqalələr, ən yenisi əvvəl. */
export const articlesFor = (locale: string) =>
  ALL.filter((a) => a.locale === locale).sort((a, b) => b.date.localeCompare(a.date));

export const articleBySlug = (slug: string) => ALL.find((a) => a.slug === slug) || null;

/** Eyni məqalənin bütün dillərdəki versiyaları (hreflang üçün). */
export const articleTranslations = (group: string) => ALL.filter((a) => a.group === group);

export const allArticles = () => ALL;
