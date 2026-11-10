/** Fold Azerbaijani (and common RU) letters so search matches with or without diacritics. */
export function fold(input: string): string {
  return input
    .toLocaleLowerCase('az')
    .replace(/ə/g, 'e')
    .replace(/ı/g, 'i')
    .replace(/\u0307/g, '')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ё/g, 'е');
}

export function includesFold(haystack: string, needle: string): boolean {
  const n = fold(needle).trim();
  if (!n) return true;
  return fold(haystack).includes(n);
}
