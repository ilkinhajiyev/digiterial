import 'server-only';

type Entry = { count: number; resetAt: number };
const globalStore = globalThis as typeof globalThis & { __digiterialRateLimits?: Map<string, Entry> };
const store = globalStore.__digiterialRateLimits || new Map<string, Entry>();
globalStore.__digiterialRateLimits = store;

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export function requestIp(headers: Headers) {
  return (headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'unknown')
    .split(',')[0]
    .trim()
    .slice(0, 64);
}
