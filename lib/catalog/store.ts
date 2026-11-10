import 'server-only';
import fs from 'fs';
import path from 'path';
import { unstable_noStore as noStore } from 'next/cache';
import { hashPassword } from './auth-crypto';
import type { Catalog, User } from './types';

const bundled = path.join(process.cwd(), 'data', 'catalog.json');

export function catalogFile(): string {
  const dir = process.env.CATALOG_DATA_DIR;
  if (!dir) return bundled;
  return path.join(dir, 'catalog.json');
}

function ensureFile(): string {
  const file = catalogFile();
  if (!fs.existsSync(file)) {
    if (file !== bundled && fs.existsSync(bundled)) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.copyFileSync(bundled, file);
    } else {
      throw new Error(`Catalog file not found at ${file}`);
    }
  }
  return file;
}

function readDisk(): Catalog {
  const file = ensureFile();
  return JSON.parse(fs.readFileSync(file, 'utf8')) as Catalog;
}

let devUser: User | null = null;
function developmentAdmin(): User {
  if (!devUser) {
    devUser = {
      id: 'dev-admin',
      username: 'admin',
      role: 'admin',
      passwordHash: hashPassword(process.env.ADMIN_DEV_PASSWORD || 'sochi-dev-admin'),
      devOnly: true,
    };
  }
  return devUser;
}

export function readCatalog(): Catalog {
  noStore();
  const catalog = readDisk();
  if (process.env.NODE_ENV !== 'production' && !catalog.users.some((u) => u.username === 'admin')) {
    catalog.users = [...catalog.users, developmentAdmin()];
  }
  return catalog;
}

export function updateCatalog(mutate: (catalog: Catalog) => void): void {
  const file = ensureFile();
  const catalog = readDisk();
  mutate(catalog);
  catalog.users = catalog.users.filter((u) => !u.devOnly);
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(catalog, null, 2));
  fs.renameSync(tmp, file);
}
