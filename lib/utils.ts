import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export const fmtMoney = (n: number) => new Intl.NumberFormat('az-AZ').format(n) + ' ₼';

const AZ_MAP: Record<string, string> = { 'ə': 'e', 'ö': 'o', 'ü': 'u', 'ğ': 'g', 'ı': 'i', 'ş': 's', 'ç': 'c', 'i̇': 'i' };
export function slugify(s: string) {
  return s.toLocaleLowerCase('az').normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[əöüğışç]/g, (c) => AZ_MAP[c] || c)
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120);
}

/** Yalnız tracking ID-lər üçün təhlükəsiz simvollar (script injection-un qarşısını alır). */
export const safeId = (v: unknown, max = 40) => String(v ?? '').replace(/[^A-Za-z0-9_\-]/g, '').slice(0, max);
export const safeUrl = (v: unknown) => { const s = String(v ?? '').trim(); return /^https?:\/\/[^\s"'<>]+$/i.test(s) ? s.slice(0, 500) : ''; };
