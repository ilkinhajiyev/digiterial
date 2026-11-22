// Lüğət əsaslı tərcümə: mənbə mətn azərbaycancadır, açar elə həmin mətnin özüdür.
// Lüğətdə olmayan mətn azərbaycanca qalır. Dəyişənlər: t('{n} xidmət', { n: 8 }).
export type Dict = Record<string, string>;
export type Vars = Record<string, string | number>;
export type T = (s: string, vars?: Vars) => string;

export function translate(dict: Dict | undefined, s: string, vars?: Vars) {
  let out = (dict && dict[s]) || s;
  if (vars) for (const k in vars) out = out.split(`{${k}}`).join(String(vars[k]));
  return out;
}

// Məzmun obyektlərini (xidmətlər, bloq, sahələr…) dərindən tərcümə edir; texniki açarlara toxunmur
const SKIP = new Set(['slug', 'icon', 'group', 'service', 'date', 'url', 'href', 'id', 'image_url', 'gallery', 'industry', 't', 'key', 'locale']);
export function localizeWith<V>(dict: Dict | undefined, v: V): V {
  if (!dict) return v;
  // Tam mətn lüğətdə yoxdursa: çoxsətirli mətn (layihə təsviri) sətir-sətir, teqlər vergüllə ayrılaraq tərcümə olunur
  const str = (x: string, key?: string): string => {
    if (dict[x]) return dict[x];
    if (/\n/.test(x)) return x.split(/\r?\n/).map((l) => dict[l.trim()] || l).join('\n');
    if (key === 'tags' && x.includes(',')) return x.split(',').map((p) => dict[p.trim()] || p.trim()).join(', ');
    return dict[x.trim()] || x;
  };
  const walk = (x: unknown, key?: string): unknown => {
    if (typeof x === 'string') return str(x, key);
    if (Array.isArray(x)) return x.map((v) => walk(v, key));
    if (x && typeof x === 'object') {
      const o: Record<string, unknown> = {};
      for (const [k, val] of Object.entries(x)) o[k] = SKIP.has(k) ? val : walk(val, k);
      return o;
    }
    return x;
  };
  return walk(v) as V;
}
