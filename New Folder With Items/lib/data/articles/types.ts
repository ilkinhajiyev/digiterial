export type Article = {
  /** URL slug — dilə uyğun açar sözlə */
  slug: string;
  /** Eyni məqalənin müxtəlif dillərdəki versiyalarını birləşdirir (hreflang üçün) */
  group: string;
  locale: 'az' | 'en' | 'ru' | 'de';
  title: string;
  /** <title> üçün (≤ 60 simvol) */
  metaTitle: string;
  /** meta description (≤ 160 simvol) */
  excerpt: string;
  keyword: string;
  category: string;
  /** ISO tarix */
  date: string;
  /**
   * Sadə formatlı mətn: boş sətir = abzas, "## " = H2, "### " = H3,
   * "- " = siyahı, "1. " = nömrəli siyahı, "> " = vurğulu qeyd,
   * **qalın**, [link mətni](/yol).
   */
  body: string;
  faq?: { q: string; a: string }[];
};
