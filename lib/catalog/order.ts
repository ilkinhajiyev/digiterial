export type OrderLine = { productId: string; variantId: string; qty: number };

const KEY = 'sochi-order-v1';

export function readOrder(): OrderLine[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]') as unknown;
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((line): line is OrderLine => {
        if (!line || typeof line !== 'object') return false;
        const row = line as OrderLine;
        return typeof row.productId === 'string' && typeof row.variantId === 'string' && Number.isFinite(row.qty);
      })
      .map((line) => ({ ...line, qty: clampQty(line.qty) }));
  } catch {
    return [];
  }
}

export function clampQty(qty: number): number {
  if (!Number.isFinite(qty)) return 1;
  return Math.max(1, Math.min(9999, Math.round(qty)));
}

export function writeOrder(lines: OrderLine[]) {
  localStorage.setItem(KEY, JSON.stringify(lines));
  window.dispatchEvent(new Event('sochi-order'));
}

export function addToOrder(productId: string, variantId: string, qty: number) {
  const lines = readOrder();
  const amount = clampQty(qty);
  const existing = lines.find((line) => line.productId === productId && line.variantId === variantId);
  if (existing) existing.qty = clampQty(existing.qty + amount);
  else lines.push({ productId, variantId, qty: amount });
  writeOrder(lines);
}

export function orderCount(): number {
  return readOrder().reduce((sum, line) => sum + line.qty, 0);
}
