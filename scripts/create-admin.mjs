import { randomBytes, scryptSync } from 'crypto';
import fs from 'fs';
import path from 'path';

const username = process.argv[2];
const password = process.env.ADMIN_PASSWORD || '';
const role = process.argv[3] === 'editor' ? 'editor' : 'admin';
if (!username || password.length < 8) {
  console.error('Usage: ADMIN_PASSWORD=... node scripts/create-admin.mjs <username> [admin|editor]');
  process.exit(1);
}
const file = process.env.CATALOG_DATA_DIR
  ? path.join(process.env.CATALOG_DATA_DIR, 'catalog.json')
  : path.join(process.cwd(), 'data', 'catalog.json');
const catalog = JSON.parse(fs.readFileSync(file, 'utf8'));
if (catalog.users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
  console.error('User already exists');
  process.exit(1);
}
const salt = randomBytes(16).toString('hex');
const hash = scryptSync(password, salt, 32).toString('hex');
catalog.users.push({ id: `user-${randomBytes(4).toString('hex')}`, username, role, passwordHash: `scrypt$${salt}$${hash}` });
fs.writeFileSync(file, JSON.stringify(catalog, null, 2));
console.log(`Created ${role} ${username}`);
