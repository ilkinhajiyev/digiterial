export function readFilters(search: Record<string, string | string[] | undefined>) {
  const one = (key: string) => {
    const value = search[key];
    return (Array.isArray(value) ? value[0] : value || '').trim();
  };
  return {
    q: one('q'),
    brand: one('marka'),
    thickness: one('qalinliq'),
    area: one('sahe'),
    unit: one('vahid'),
    stock: one('stok'),
    sub: one('alt'),
  };
}
