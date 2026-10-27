// Tərcümə üçün bütün azərbaycanca mətnləri toplayır:
//   lib/i18n/source.json      — { fayl: [mətnlər] } (tərcüməçi üçün kontekst)
//   lib/i18n/client-keys.json — brauzerə göndərilən açarlar ('use client' faylları)
// İstifadə: node scripts/i18n-extract.mjs
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import createJiti from 'jiti';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const jiti = createJiti(new URL(import.meta.url).pathname, { alias: { '@': root }, interopDefault: true });
jiti.import = async (p) => jiti(p);
const out = {};
const client = new Set();
const add = (file, s) => {
  s = s.trim() === s ? s : s; // boşluqlar açarın hissəsidir, toxunmuruq
  if (!/\p{L}/u.test(s)) return;
  (out[file] ||= new Set()).add(s);
};

// 1) Məzmun modulları: runtime-da gəzirik (dəqiq)
const SKIP = new Set(['slug', 'icon', 'group', 'service', 'date', 'url', 'href', 'id', 'image_url', 'gallery', 'industry', 't', 'key', 'locale', 'category_key']);
const walk = (file, x, k) => {
  if (SKIP.has(k)) return;
  if (typeof x === 'string') return add(file, x);
  if (Array.isArray(x)) return x.forEach((v) => walk(file, v));
  if (x && typeof x === 'object') for (const [kk, v] of Object.entries(x)) walk(file, v, kk);
};
for (const f of ['lib/content/services.ts', 'lib/content/blog.ts', 'lib/content/industries.ts', 'lib/content/glossary.ts']) {
  const mod = await jiti.import(path.join(root, f));
  for (const [name, v] of Object.entries(mod)) if (typeof v !== 'function' && name !== 'HOME_ORDER') walk(f, v);
}
{
  // portfolio.ts Supabase klientini import edir — yalnız fallbackPortfolio massivini AST-dən götürürük
  const f = 'lib/data/portfolio.ts';
  const sf = ts.createSourceFile(f, fs.readFileSync(path.join(root, f), 'utf8'), ts.ScriptTarget.Latest, true);
  const visit = (n) => {
    if (ts.isVariableDeclaration(n) && n.name.getText() === 'fallbackPortfolio') {
      const lit = (m) => {
        if (ts.isPropertyAssignment(m) && SKIP.has(m.name.getText())) return;
        if (ts.isPropertyAssignment(m) && ['category', 'client'].includes(m.name.getText())) return;
        if (ts.isStringLiteral(m) || ts.isNoSubstitutionTemplateLiteral(m)) add(f, m.text);
        ts.forEachChild(m, lit);
      };
      lit(n.initializer);
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
}
// Contact form (client) xidmət adlarını göstərir
const svc = await jiti.import(path.join(root, 'lib/content/services.ts'));
svc.services.forEach((s) => client.add(s.title));

// 2) Komponent və səhifələr: AST-dən mətn literalları
const TEXT_ATTRS = new Set(['alt', 'aria-label', 'title', 'placeholder', 'label', 'content']);
const looksCode = (s) => /^</.test(s) || /var\(--|\d+px solid|^[A-Z][a-z]+\/[A-Za-z_]+$|^[MmLlHhVvCcZzAaQqSsTt0-9 .,\-]+$/.test(s) || !/\s/.test(s.trim()) && !/[əğışçöüİƏĞŞÇÖÜ]/.test(s) && !/^[A-ZƏ]/.test(s.trim());
const files = [];
const scan = (d) => { for (const e of fs.readdirSync(path.join(root, d), { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) scan(p); else if (/\.tsx?$/.test(e.name)) files.push(p); } };
scan('components/dg'); scan('app/[locale]');
files.push('lib/actions/contact.ts'); // xəta mətnləri client formada göstərilir
const NO_TEXT = new Set(['components/dg/icons.tsx', 'components/dg/flag.tsx', 'components/dg/motion.tsx']);
for (const f of files) {
  if (NO_TEXT.has(f)) continue;
  const src = fs.readFileSync(path.join(root, f), 'utf8');
  const isClient = /^['"]use client['"]/.test(src.trim()) || f === 'lib/actions/contact.ts';
  const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const push = (s) => { if (!/\p{L}/u.test(s)) return; add(f, s); if (isClient) client.add(s); };
  const visit = (n) => {
    if (ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) return;
    if (ts.isJsxText(n)) { const s = n.text.replace(/\s+/g, ' ').trim(); if (s && /\p{L}/u.test(s)) push(s); }
    else if (ts.isJsxAttribute(n)) {
      const name = n.name.getText();
      if (n.initializer && ts.isStringLiteral(n.initializer)) { if (TEXT_ATTRS.has(name)) push(n.initializer.text); return; }
      if (['className', 'href', 'src', 'id', 'key', 'role', 'type', 'name', 'rel', 'target', 'd', 'viewBox', 'style', 'autoComplete', 'inputMode'].includes(name)) return;
    }
    else if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) {
      const p = n.parent;
      if (p && ts.isPropertyAssignment(p) && p.name === n) return;
      if (p && ts.isPropertyAssignment(p) && (SKIP.has(p.name.getText()) || /@type|@context|tz|timeZone|addressCountry|addressLocality|areaServed|dayOfWeek|opens|closes|priceRange|telephone/.test(p.name.getText()))) return;
      if (p && ts.isExpressionStatement(p)) return;
      if (p && ts.isArrayLiteralExpression(p) && p.parent && ts.isPropertyAssignment(p.parent) && /dayOfWeek|availableLanguage/.test(p.parent.name.getText())) return;
      if (p && ts.isElementAccessExpression(p)) return;
      if (p && ts.isCallExpression(p) && /querySelector|matchMedia|classList|getAttribute|setAttribute|setProperty|addEventListener|removeEventListener|startsWith|split|replace|createElement|closest/.test(p.expression.getText())) return;
      if (p && ts.isBinaryExpression(p) && /===|!==/.test(p.operatorToken.getText())) return;
      if (ts.isLiteralTypeNode(p)) return;
      if (!looksCode(n.text)) push(n.text);
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
}

const src = Object.fromEntries(Object.entries(out).map(([k, v]) => [k, [...v]]));
fs.writeFileSync(path.join(root, 'lib/i18n/source.json'), JSON.stringify(src, null, 1));
fs.writeFileSync(path.join(root, 'lib/i18n/client-keys.json'), JSON.stringify([...client].sort(), null, 1));
const all = new Set(Object.values(src).flat());
console.log('files', Object.keys(src).length, 'strings', all.size, 'client', client.size, 'words', [...all].join(' ').split(/\s+/).length);
