'use server';

import { randomBytes } from 'crypto';
import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { hashPassword, verifyPassword } from './auth-crypto';
import { clearSession, currentUser, setSession } from './session';
import { readCatalog, updateCatalog } from './store';
import type { L10n, Product, Status, Stock, Variant } from './types';

function staffOrThrow() {
  return currentUser().then((user) => {
    if (!user) throw new Error('Unauthorized');
    return user;
  });
}

async function adminOrThrow() {
  const user = await staffOrThrow();
  if (user.role !== 'admin') throw new Error('Forbidden');
  return user;
}

function l10n(fd: FormData, key: string): L10n {
  return {
    az: String(fd.get(`${key}_az`) || '').trim(),
    en: String(fd.get(`${key}_en`) || '').trim(),
    ru: String(fd.get(`${key}_ru`) || '').trim(),
  };
}

function statusOf(value: FormDataEntryValue | null): Status {
  const v = String(value || '');
  if (v === 'draft' || v === 'archived' || v === 'published') return v;
  return 'draft';
}

function parsePrice(raw: string): { amount: number; currency: 'AZN' } | null | 'invalid' {
  const text = raw.trim().replace(',', '.');
  if (!text) return null;
  const amount = Number(text);
  if (!Number.isFinite(amount) || amount < 0) return 'invalid';
  return { amount, currency: 'AZN' };
}

function parseStock(status: string, qtyRaw: string): Stock | 'invalid' {
  if (status === 'unknown' || status === '') return null;
  if (status !== 'in' && status !== 'out') return 'invalid';
  const qtyText = qtyRaw.trim();
  if (!qtyText) return { status, qty: null };
  const qty = Number(qtyText);
  if (!Number.isInteger(qty) || qty < 0) return 'invalid';
  return { status, qty };
}

function skuTaken(products: Product[], sku: string, variantId: string): boolean {
  const needle = sku.trim().toLowerCase();
  if (!needle) return false;
  return products.some((product) => product.variants.some((variant) => variant.id !== variantId && variant.sku && variant.sku.toLowerCase() === needle));
}

export async function login(fd: FormData) {
  const username = String(fd.get('username') || '').trim();
  const password = String(fd.get('password') || '');
  const user = readCatalog().users.find((item) => item.username === username);
  if (!user || !verifyPassword(password, user.passwordHash)) redirect('/admin/login?error=1');
  await setSession(user);
  redirect('/admin');
}

export async function logout() {
  await clearSession();
  redirect('/admin/login');
}

function touch() {
  revalidatePath('/', 'layout');
}

class FormError extends Error {}

export async function saveProduct(fd: FormData) {
  await staffOrThrow();
  const id = String(fd.get('id') || '');
  try {
  updateCatalog((catalog) => {
    const product = catalog.products.find((item) => item.id === id);
    if (!product) throw new FormError('Məhsul tapılmadı.');
    const name = l10n(fd, 'name');
    if (!name.az) throw new FormError('Azərbaycan adı mütləqdir.');
    product.name = name;
    product.status = statusOf(fd.get('status'));
    product.categoryId = String(fd.get('categoryId') || product.categoryId);
    product.subcategoryId = String(fd.get('subcategoryId') || product.subcategoryId);
    product.family = String(fd.get('family') || '').trim();
    const brand = String(fd.get('brand') || '').trim();
    product.brand = brand || null;
    product.featured = fd.get('featured') === 'on';
    product.slug = String(fd.get('slug') || product.slug).trim();

    for (const variant of product.variants) {
      const prefix = `v_${variant.id}_`;
      if (!fd.has(`${prefix}name_az`)) continue;
      const sku = String(fd.get(`${prefix}sku`) || '').trim();
      if (sku && skuTaken(catalog.products, sku, variant.id)) throw new FormError(`Artikul artıq var: ${sku}`);
      const price = parsePrice(String(fd.get(`${prefix}price`) || ''));
      if (price === 'invalid') throw new FormError('Qiymət rəqəm olmalıdır və ya boş (naməlum).');
      const stock = parseStock(String(fd.get(`${prefix}stock`) || ''), String(fd.get(`${prefix}qty`) || ''));
      if (stock === 'invalid') throw new FormError('Stok dəyəri yanlışdır.');
      const unit = String(fd.get(`${prefix}unit`) || '').trim();
      variant.sku = sku || null;
      variant.price = price;
      variant.stock = stock;
      variant.unit = unit || null;
      variant.status = statusOf(fd.get(`${prefix}status`));
      variant.name = l10n(fd, `${prefix}name`);
      variant.description = l10n(fd, `${prefix}description`);
      const thick = String(fd.get(`${prefix}thickness`) || '').trim();
      variant.thicknessMm = thick ? Number(thick) : null;
      if (variant.thicknessMm != null && !Number.isFinite(variant.thicknessMm)) throw new FormError('Qalınlıq rəqəm olmalıdır.');
      variant.applicationAreas = ['dam', 'fasad', 'temel', 'doseme', 'daxili'].filter((area) => fd.get(`${prefix}area_${area}`) === 'on');
    }
  });
  } catch (error) {
    if (error instanceof FormError) redirect(`/admin/products/${id}?error=${encodeURIComponent(error.message)}`);
    throw error;
  }
  touch();
  redirect(`/admin/products/${id}?saved=1`);
}

export async function addVariant(fd: FormData) {
  await staffOrThrow();
  const id = String(fd.get('id') || '');
  updateCatalog((catalog) => {
    const product = catalog.products.find((item) => item.id === id);
    if (!product) return;
    const variant: Variant = {
      id: `v-${randomBytes(4).toString('hex')}`,
      sku: null,
      status: 'draft',
      name: { az: 'Yeni variant', en: 'New variant', ru: 'Новый вариант' },
      description: { az: '', en: '', ru: '' },
      price: null,
      stock: null,
      unit: null,
      thicknessMm: null,
      applicationAreas: [],
      specs: [],
      image: product.images[0]?.src || null,
    };
    product.variants.push(variant);
  });
  touch();
}

export async function deleteVariant(fd: FormData) {
  await adminOrThrow();
  const id = String(fd.get('id') || '');
  const variantId = String(fd.get('variantId') || '');
  updateCatalog((catalog) => {
    const product = catalog.products.find((item) => item.id === id);
    if (!product) return;
    product.variants = product.variants.filter((variant) => variant.id !== variantId);
  });
  touch();
}

function uploadRoot() {
  if (process.env.CATALOG_DATA_DIR) return path.join(process.env.CATALOG_DATA_DIR, 'media');
  return path.join(process.cwd(), 'public', 'media', 'uploads');
}

function publicSrc(filename: string) {
  if (process.env.CATALOG_DATA_DIR) return `/uploads/${filename}`;
  return `/media/uploads/${filename}`;
}

async function storeFile(file: File, allowed: string[]) {
  if (!allowed.includes(file.type)) throw new Error('Fayl növü qəbul edilmir.');
  if (file.size <= 0 || file.size > 8_000_000) throw new Error('Fayl boşdur və ya 8 MB-dan böyükdür.');
  const ext = file.type === 'application/pdf' ? 'pdf' : file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const filename = `${Date.now()}-${randomBytes(3).toString('hex')}.${ext}`;
  const dir = uploadRoot();
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return publicSrc(filename);
}

export async function addProductImage(fd: FormData) {
  await staffOrThrow();
  const id = String(fd.get('id') || '');
  const file = fd.get('file');
  if (!(file instanceof File) || file.size === 0) return;
  const src = await storeFile(file, ['image/jpeg', 'image/png', 'image/webp']);
  updateCatalog((catalog) => {
    const product = catalog.products.find((item) => item.id === id);
    if (!product) return;
    product.images.push({ id: path.basename(src), src, alt: product.name });
  });
  touch();
}

export async function removeProductImage(fd: FormData) {
  await staffOrThrow();
  const id = String(fd.get('id') || '');
  const src = String(fd.get('src') || '');
  updateCatalog((catalog) => {
    const product = catalog.products.find((item) => item.id === id);
    if (!product) return;
    product.images = product.images.filter((image) => image.src !== src);
  });
  touch();
}

export async function addProductPdf(fd: FormData) {
  await staffOrThrow();
  const id = String(fd.get('id') || '');
  const file = fd.get('file');
  if (!(file instanceof File) || file.size === 0) return;
  const src = await storeFile(file, ['application/pdf']);
  const title = l10n(fd, 'pdf');
  updateCatalog((catalog) => {
    const product = catalog.products.find((item) => item.id === id);
    if (!product) return;
    product.pdfs.push({
      id: path.basename(src),
      src,
      title: title.az ? title : { az: file.name, en: file.name, ru: file.name },
    });
  });
  touch();
}

export async function removeProductPdf(fd: FormData) {
  await staffOrThrow();
  const id = String(fd.get('id') || '');
  const pdfId = String(fd.get('pdfId') || '');
  updateCatalog((catalog) => {
    const product = catalog.products.find((item) => item.id === id);
    if (!product) return;
    product.pdfs = product.pdfs.filter((pdf) => pdf.id !== pdfId);
  });
  touch();
}

export async function createProduct(fd: FormData) {
  await staffOrThrow();
  const name = l10n(fd, 'name');
  const slug = String(fd.get('slug') || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-|-$/g, '');
  if (!name.az || !slug) return;
  updateCatalog((catalog) => {
    if (catalog.products.some((item) => item.slug === slug || item.id === slug)) return;
    const categoryId = String(fd.get('categoryId') || catalog.categories[0]?.id || '');
    const category = catalog.categories.find((item) => item.id === categoryId);
    catalog.products.push({
      id: slug,
      slug,
      status: 'draft',
      categoryId,
      subcategoryId: category?.subs[0]?.id || '',
      family: String(fd.get('family') || name.az),
      brand: null,
      featured: false,
      name,
      variants: [
        {
          id: `v-${randomBytes(4).toString('hex')}`,
          sku: null,
          status: 'draft',
          name,
          description: { az: '', en: '', ru: '' },
          price: null,
          stock: null,
          unit: null,
          thicknessMm: null,
          applicationAreas: [],
          specs: [],
          image: null,
        },
      ],
      images: [],
      pdfs: [],
    });
  });
  touch();
  redirect(`/admin/products/${slug}`);
}

export async function deleteProduct(fd: FormData) {
  await adminOrThrow();
  const id = String(fd.get('id') || '');
  updateCatalog((catalog) => {
    catalog.products = catalog.products.filter((item) => item.id !== id);
  });
  touch();
  redirect('/admin/products');
}

export async function saveCategory(fd: FormData) {
  await staffOrThrow();
  const id = String(fd.get('id') || '');
  updateCatalog((catalog) => {
    const category = catalog.categories.find((item) => item.id === id);
    if (!category) return;
    category.name = l10n(fd, 'name');
    category.summary = l10n(fd, 'summary');
    for (const sub of category.subs) {
      sub.name = l10n(fd, `sub_${sub.id}`);
    }
  });
  touch();
}

export async function saveSettings(fd: FormData) {
  await adminOrThrow();
  updateCatalog((catalog) => {
    catalog.settings.whatsappE164 = String(fd.get('whatsappE164') || '').replace(/\D/g, '');
    catalog.settings.whatsappDisplay = String(fd.get('whatsappDisplay') || '').trim();
    catalog.settings.whatsappConfirmed = fd.get('whatsappConfirmed') === 'on';
    catalog.settings.phoneDisplay = String(fd.get('phoneDisplay') || '').trim();
    catalog.settings.phoneE164 = String(fd.get('phoneE164') || '').replace(/\D/g, '');
    catalog.settings.email = String(fd.get('email') || '').trim();
    catalog.settings.city = l10n(fd, 'city');
    const address = String(fd.get('addressLine') || '').trim();
    catalog.settings.addressLine = address || null;
  });
  touch();
}

export async function saveBanner(fd: FormData) {
  await staffOrThrow();
  const id = String(fd.get('id') || '');
  updateCatalog((catalog) => {
    const banner = catalog.banners.find((item) => item.id === id);
    if (!banner) return;
    banner.title = l10n(fd, 'title');
    banner.subtitle = l10n(fd, 'subtitle');
    banner.href = String(fd.get('href') || '/kataloq');
    banner.status = statusOf(fd.get('status'));
    const image = String(fd.get('image') || '').trim();
    if (image) banner.image = image;
  });
  touch();
}

export async function addBanner(fd: FormData) {
  await staffOrThrow();
  const file = fd.get('file');
  let image = '/media/brand/sochi-logo.png';
  if (file instanceof File && file.size > 0) image = await storeFile(file, ['image/jpeg', 'image/png', 'image/webp']);
  const id = `banner-${randomBytes(3).toString('hex')}`;
  updateCatalog((catalog) => {
    catalog.banners.push({
      id,
      status: 'draft',
      image,
      href: '/kataloq',
      title: l10n(fd, 'title'),
      subtitle: { az: '', en: '', ru: '' },
    });
  });
  touch();
}

export async function saveAbout(fd: FormData) {
  await staffOrThrow();
  updateCatalog((catalog) => {
    catalog.pages.about.title = l10n(fd, 'title');
    catalog.pages.about.lead = l10n(fd, 'lead');
    catalog.pages.about.why = l10n(fd, 'why');
  });
  touch();
}

export async function saveService(fd: FormData) {
  await staffOrThrow();
  const groupId = String(fd.get('groupId') || '');
  const itemId = String(fd.get('itemId') || '');
  updateCatalog((catalog) => {
    const group = catalog.pages.services.find((item) => item.id === groupId);
    if (!group) return;
    if (!itemId) {
      group.title = l10n(fd, 'title');
      group.description = l10n(fd, 'description');
      return;
    }
    const item = group.items.find((entry) => entry.id === itemId);
    if (!item) return;
    item.title = l10n(fd, 'title');
    item.description = l10n(fd, 'description');
  });
  touch();
}

export async function createUser(fd: FormData) {
  await adminOrThrow();
  const username = String(fd.get('username') || '').trim();
  const password = String(fd.get('password') || '');
  const role = fd.get('role') === 'admin' ? 'admin' : 'editor';
  if (!/^[a-z0-9._-]{3,32}$/i.test(username) || password.length < 8) return;
  updateCatalog((catalog) => {
    if (catalog.users.some((user) => user.username.toLowerCase() === username.toLowerCase())) return;
    catalog.users.push({
      id: `user-${randomBytes(4).toString('hex')}`,
      username,
      role,
      passwordHash: hashPassword(password),
    });
  });
  touch();
}
