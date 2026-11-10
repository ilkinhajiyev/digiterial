export const locales = ['az', 'en', 'ru'] as const;
export type Locale = (typeof locales)[number];
export type L10n = Record<Locale, string>;
export type Status = 'draft' | 'published' | 'archived';
export type Role = 'admin' | 'editor';

export type Spec = { key: string; value: string | L10n };

export type Price = { amount: number; currency: 'AZN' } | null;
export type Stock = { status: 'in' | 'out'; qty: number | null } | null;

export type Variant = {
  id: string;
  sku: string | null;
  status: Status;
  name: L10n;
  description: L10n;
  price: Price;
  stock: Stock;
  unit: string | null;
  thicknessMm: number | null;
  applicationAreas: string[];
  specs: Spec[];
  image: string | null;
};

export type Media = { id: string; src: string; alt?: L10n; title?: L10n };

export type Product = {
  id: string;
  slug: string;
  status: Status;
  categoryId: string;
  subcategoryId: string;
  family: string;
  brand: string | null;
  featured: boolean;
  name: L10n;
  variants: Variant[];
  images: { id: string; src: string; alt: L10n }[];
  pdfs: { id: string; src: string; title: L10n }[];
};

export type Category = {
  id: string;
  name: L10n;
  summary: L10n;
  subs: { id: string; name: L10n }[];
};

export type Banner = {
  id: string;
  status: Status;
  image: string;
  href: string;
  title: L10n;
  subtitle: L10n;
};

export type Settings = {
  whatsappE164: string;
  whatsappDisplay: string;
  whatsappConfirmed: boolean;
  phoneDisplay: string;
  phoneE164: string;
  email: string;
  city: L10n;
  addressLine: string | null;
};

export type ServiceItem = { id: string; title: L10n; description: L10n };
export type ServiceGroup = { id: string; title: L10n; description: L10n; items: ServiceItem[] };
export type Certificate = { id: string; title: L10n; description: L10n; image: string; pdf: string | null };

export type BlogPost = { title: string; desc: string };
export type BlogLocale = {
  badge: string;
  mainTitle: string;
  subtitle: string;
  triggerText: string;
  item1: BlogPost;
  item2: BlogPost;
  item3: BlogPost;
};

export type User = {
  id: string;
  username: string;
  role: Role;
  passwordHash: string;
  devOnly?: boolean;
};

export type Catalog = {
  version: number;
  source: { site: string; extracted: string; note: string };
  settings: Settings;
  banners: Banner[];
  categories: Category[];
  products: Product[];
  pages: {
    about: { title: L10n; lead: L10n; why: L10n };
    services: ServiceGroup[];
    certificates: Certificate[];
    blog: Record<Locale, BlogLocale>;
  };
  users: User[];
};

export function isLocale(value: string): value is Locale {
  return value === 'az' || value === 'en' || value === 'ru';
}

export function pick(value: L10n | string | undefined, locale: string): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (isLocale(locale) && value[locale]) return value[locale];
  return value.az || '';
}
