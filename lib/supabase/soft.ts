/** Soft-fail helpers when Supabase is unreachable (local/dev egress, timeouts). */

const DB_TIMEOUT_MS = 1800;
const DB_COOLDOWN_MS = 60_000;
let unavailableUntil = 0;

export function supabaseLikelyDown() {
  return Date.now() < unavailableUntil;
}

export function markSupabaseUnavailable() {
  unavailableUntil = Date.now() + DB_COOLDOWN_MS;
}

export function isTransientSupabaseFailure(msg?: string) {
  if (!msg) return true;
  return /fetch failed|Failed to fetch|ECONN|ENOTFOUND|ETIMEDOUT|network|timeout|AbortError/i.test(msg);
}

export async function withSupabaseTimeout<T>(p: PromiseLike<T>, ms = DB_TIMEOUT_MS): Promise<T> {
  let t: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve(p),
      new Promise<T>((_, reject) => {
        t = setTimeout(() => reject(new Error('timeout')), ms);
      }),
    ]);
  } finally {
    if (t) clearTimeout(t);
  }
}
