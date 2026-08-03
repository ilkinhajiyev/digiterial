import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export const fmtMoney = (n: number) => new Intl.NumberFormat('az-AZ').format(n) + ' ₼';
