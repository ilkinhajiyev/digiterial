'use server';

// Google Search Console (Search Analytics) API-dən statistika çəkir.
// Ayrıca env dəyişəni tələb olunmur — GA4 üçün istifadə olunan eyni service account
// (GA4_CLIENT_EMAIL / GA4_PRIVATE_KEY) yenidən istifadə edilir. Yalnız fərq: bu service
// account-un Search Console-da (Ayarlar → Users and permissions) əlavə olunmuş olması lazımdır.

import { GoogleAuth } from 'google-auth-library';

export type SearchConsoleData = {
  ok: boolean;
  error?: string;
  configured: boolean;
  summary?: { clicks: number; impressions: number; ctr: string; position: string };
  daily?: { date: string; clicks: number }[];
  queries?: { query: string; clicks: number }[];
  pages?: { page: string; clicks: number }[];
  countries?: { name: string; clicks: number }[];
};

function siteUrlFor() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || 'https://digiterial.com';
  let host = raw;
  try { host = new URL(raw).hostname; } catch { /* raw artıq hostname ola bilər */ }
  host = host.replace(/^www\./, '');
  return `sc-domain:${host}`;
}

async function query(token: string, siteUrl: string, body: Record<string, any>) {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    }
  );
  const json: any = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = json?.error?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json;
}

export async function getSearchConsoleData(days = 28): Promise<SearchConsoleData> {
  const clientEmail = process.env.GA4_CLIENT_EMAIL;
  let privateKey = process.env.GA4_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    return { ok: false, configured: false, error: 'Search Console hələ qurulmayıb (GA4 ilə eyni service account tələb olunur)' };
  }

  // GA4-də istifadə olunan eyni normalizasiya məntiqi
  privateKey = privateKey.trim();
  if (
    (privateKey.startsWith('"') && privateKey.endsWith('"')) ||
    (privateKey.startsWith("'") && privateKey.endsWith("'"))
  ) {
    privateKey = privateKey.slice(1, -1).trim();
  }
  privateKey = privateKey.replace(/\r/g, '');
  privateKey = privateKey.replace(/\\\\n/g, '\n');
  privateKey = privateKey.replace(/\\n/g, '\n');
  privateKey = privateKey.trim() + '\n';

  const looksLikePem =
    /^-----BEGIN (RSA )?PRIVATE KEY-----\n/.test(privateKey) &&
    /\n-----END (RSA )?PRIVATE KEY-----\n?$/.test(privateKey);
  if (!looksLikePem) {
    return { ok: false, configured: true, error: 'GA4_PRIVATE_KEY PEM formatında deyil — GA4 bölməsindəki açar problemini əvvəlcə həll edin.' };
  }

  const siteUrl = siteUrlFor();
  // Search Console məlumatları adətən 2-3 gün gecikmə ilə gəlir
  const date2 = new Date();
  date2.setDate(date2.getDate() - 3);
  const date1 = new Date(date2.getTime() - days * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const base = { startDate: fmt(date1), endDate: fmt(date2) };

  try {
    const auth = new GoogleAuth({
      credentials: { client_email: clientEmail, private_key: privateKey },
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });
    const authClient = await auth.getClient();
    const tokenResp = await authClient.getAccessToken();
    const token = tokenResp?.token;
    if (!token) {
      return { ok: false, configured: true, error: 'Google-dan access token alına bilmədi.' };
    }

    const [summaryR, dailyR, queriesR, pagesR, countriesR] = await Promise.allSettled([
      query(token, siteUrl, { ...base }),
      query(token, siteUrl, { ...base, dimensions: ['date'] }),
      query(token, siteUrl, { ...base, dimensions: ['query'], rowLimit: 10 }),
      query(token, siteUrl, { ...base, dimensions: ['page'], rowLimit: 10 }),
      query(token, siteUrl, { ...base, dimensions: ['country'], rowLimit: 8 }),
    ]);

    if (summaryR.status === 'rejected') throw summaryR.reason;

    const totalsRow = (summaryR.value?.rows && summaryR.value.rows[0]) || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
    const rows = (r: PromiseSettledResult<any>) => (r.status === 'fulfilled' ? (r.value?.rows || []) : []);

    return {
      ok: true,
      configured: true,
      summary: {
        clicks: totalsRow.clicks || 0,
        impressions: totalsRow.impressions || 0,
        ctr: ((totalsRow.ctr || 0) * 100).toFixed(1) + '%',
        position: (totalsRow.position || 0).toFixed(1),
      },
      daily: rows(dailyR).map((r: any) => ({
        date: String(r.keys?.[0] || '').slice(5).replace('-', '.'),
        clicks: r.clicks || 0,
      })),
      queries: rows(queriesR).map((r: any) => ({ query: String(r.keys?.[0] || ''), clicks: r.clicks || 0 })),
      pages: rows(pagesR).map((r: any) => ({ page: String(r.keys?.[0] || ''), clicks: r.clicks || 0 })),
      countries: rows(countriesR).map((r: any) => ({ name: String(r.keys?.[0] || ''), clicks: r.clicks || 0 })),
    };
  } catch (ex: any) {
    let msg = ex?.message || 'Search Console sorğu xətası';
    if (/permission|forbidden|403|not verified/i.test(msg)) {
      msg += ' — service account-un Search Console-da "Users and permissions" bölməsinə əlavə olunduğunu yoxlayın.';
    }
    return { ok: false, configured: true, error: msg };
  }
}
