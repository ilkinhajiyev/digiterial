import 'server-only';
import { cookies } from 'next/headers';
import { readSession, signSession } from './auth-crypto';
import { readCatalog } from './store';
import type { User } from './types';

const COOKIE = 'sochi_admin';

export async function currentUser(): Promise<User | null> {
  const jar = await cookies();
  const session = readSession(jar.get(COOKIE)?.value);
  if (!session) return null;
  const user = readCatalog().users.find((u) => u.id === session.uid);
  if (!user || user.role !== session.role) return null;
  return user;
}

export async function requireStaff(): Promise<User | null> {
  return currentUser();
}

export async function setSession(user: User) {
  const token = signSession({ uid: user.id, role: user.role, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
