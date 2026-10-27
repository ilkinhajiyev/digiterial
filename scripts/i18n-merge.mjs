// lib/i18n/work/<dil>-*.json tərcümələrini lib/i18n/dict/<dil>.json-a birləşdirir və çatışmayanları göstərir.
// İstifadə: node scripts/i18n-merge.mjs
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dir = path.join(root, 'lib/i18n');
const source = new Set(Object.values(JSON.parse(fs.readFileSync(path.join(dir, 'source.json'), 'utf8'))).flat());
for (const lang of ['en', 'ru', 'de']) {
  const file = path.join(dir, 'dict', `${lang}.json`);
  const dict = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const f of fs.readdirSync(path.join(dir, 'work')).filter((f) => f.startsWith(`${lang}-`) && f.endsWith('.json'))) {
    Object.assign(dict, JSON.parse(fs.readFileSync(path.join(dir, 'work', f), 'utf8')));
  }
  const out = {};
  const bad = [];
  for (const k of [...source].sort()) {
    const v = dict[k];
    if (typeof v !== 'string' || v === k) continue;
    const ph = k.match(/\{\w+\}/g) || [];
    if (ph.some((p) => !v.includes(p))) { bad.push(k); continue; }
    out[k] = v;
  }
  fs.writeFileSync(file, JSON.stringify(out, null, 1) + '\n');
  const missing = [...source].filter((k) => !(k in dict));
  console.log(lang, 'entries', Object.keys(out).length, 'missing', missing.length, 'bad placeholders', bad.length);
  if (missing.length) console.log('  missing:', missing.slice(0, 8).join(' | '));
}
