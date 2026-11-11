import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 32).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [algo, salt, hash] = stored.split('$');
  if (algo !== 'scrypt' || !salt || !hash) return false;
  const got = scryptSync(password, salt, 32);
  const expected = Buffer.from(hash, 'hex');
  if (got.length !== expected.length) return false;
  return timingSafeEqual(got, expected);
}

export function sessionSecret(): string {
  const fromEnv = process.env.ADMIN_SESSION_SECRET || '';
  if (fromEnv.length >= 16) return fromEnv;
  if (process.env.NODE_ENV === 'production') return '';
  return 'dev-only-sochi-admin-session';
}

export type SessionPayload = { uid: string; role: 'admin' | 'editor'; exp: number };

export function signSession(payload: SessionPayload): string {
  const secret = sessionSecret();
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is required in production');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function readSession(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const secret = sessionSecret();
  if (!secret) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = createHmac('sha256', secret).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload.uid || !payload.exp || payload.exp < Date.now()) return null;
    if (payload.role !== 'admin' && payload.role !== 'editor') return null;
    return payload;
  } catch {
    return null;
  }
}
