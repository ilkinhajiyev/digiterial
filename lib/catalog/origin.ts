import 'server-only';
import { headers } from 'next/headers';

export function publicSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://sochi.az').replace(/\/$/, '');
}

export async function requestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  if (!host) return publicSiteUrl();
  const proto = h.get('x-forwarded-proto') || (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https');
  return `${proto}://${host}`;
}
