'use server';
import { requireAdmin } from '@/lib/security/admin';
import { createPrivateKey } from 'node:crypto';

// Google Analytics 4 Data API-dən real statistika çəkir.
// Lazımi env dəyişənləri (Hostinger-də):
//   GA4_PROPERTY_ID          — GA4 property ID (rəqəm, məs. 512345678)
//   GA4_CLIENT_EMAIL         — service account email
//   GA4_PRIVATE_KEY          — service account private key (\n-lərlə)
// Alternativ: GA4_SERVICE_ACCOUNT_JSON — bütün JSON açarı bir dəyişəndə saxlamaq üçün.

type Row = Record<string, string | number>;

export type Ga4Data = {
  ok: boolean;
  error?: string;
  hint?: string;
  configured: boolean;
  summary?: {
    users: number;
    sessions: number;
    pageViews: number;
    bounceRate: string;
    avgDuration: string;
  };
  daily?: { date: string; users: number }[];
  countries?: { name: string; users: number }[];
  sources?: { name: string; users: number }[];
  pages?: { path: string; views: number }[];
  devices?: { name: string; users: number }[];
};

function parseCredentialsJson(raw: string) {
  const candidates = [raw.trim()];
  try { candidates.push(Buffer.from(raw.trim(), 'base64').toString('utf8').trim()); } catch {}
  for (const candidate of candidates) {
    if (!candidate.startsWith('{')) continue;
    try {
      const parsed = JSON.parse(candidate);
      if (parsed?.private_key) return parsed as { private_key: string; client_email?: string };
    } catch {}
  }
  return null;
}

function normalizePrivateKey(raw: string) {
  let value = raw.trim();
  if (value.startsWith('"') && value.endsWith('"')) {
    try { value = JSON.parse(value); } catch {}
  }

  const embeddedJson = parseCredentialsJson(value);
  if (embeddedJson) value = embeddedJson.private_key;
  value = value.replace(/\\n/g, '\n').replace(/\r/g, '').trim();

  if (!value.includes('-----BEGIN')) {
    const decoded = Buffer.from(value, 'base64').toString('utf8').trim();
    const decodedJson = parseCredentialsJson(decoded);
    value = decodedJson?.private_key || decoded;
    value = value.replace(/\\n/g, '\n').replace(/\r/g, '').trim();
  }

  const match = value.match(/-----BEGIN ([A-Z ]*PRIVATE KEY)-----([\s\S]*?)-----END \1-----/);
  if (!match) throw new Error('GA4_PRIVATE_KEY_INVALID');
  const body = match[2].replace(/\s/g, '');
  if (body.length < 100 || !/^[A-Za-z0-9+/=]+$/.test(body)) throw new Error('GA4_PRIVATE_KEY_INVALID');

  const normalized = `-----BEGIN ${match[1]}-----\n${body.match(/.{1,64}/g)?.join('\n')}\n-----END ${match[1]}-----\n`;
  try { createPrivateKey(normalized); } catch { throw new Error('GA4_PRIVATE_KEY_INVALID'); }
  return normalized;
}

function ga4Error(ex: any): Pick<Ga4Data, 'error' | 'hint'> {
  const message = String(ex?.message || '');
  if (message === 'GA4_PRIVATE_KEY_INVALID' || /DECODER routines|unsupported|PEM|private key/i.test(message)) {
    return { error: 'Service account private key formatı oxunmadı.', hint: 'Hostinger-də GA4_PRIVATE_KEY sahəsinə JSON faylındakı private_key dəyərini tam daxil edin. Kod həm real sətir keçidini, həm \\n, həm də Base64 formatını qəbul edir.' };
  }
  if (/PERMISSION_DENIED|permission|does not have access|7 UNKNOWN/i.test(message)) {
    return { error: 'Service account bu GA4 property-yə giriş icazəsinə malik deyil.', hint: 'GA4 → Admin → Property access management bölməsində service account emailini Viewer rolu ilə əlavə edin.' };
  }
  if (/NOT_FOUND|not found|5 UNKNOWN/i.test(message)) {
    return { error: 'GA4 property tapılmadı.', hint: 'GA4_PROPERTY_ID üçün G-XXXX Measurement ID deyil, Admin → Property details bölməsindəki yalnız rəqəmlərdən ibarət Property ID yazılmalıdır.' };
  }
  if (/UNAUTHENTICATED|invalid_grant|invalid JWT|16 UNKNOWN/i.test(message)) {
    return { error: 'Google service account məlumatları təsdiqlənmədi.', hint: 'GA4_CLIENT_EMAIL və private key eyni endirilmiş service-account JSON faylından götürülməlidir.' };
  }
  return { error: 'GA4 Data API ilə bağlantı qurulmadı.', hint: 'Google Analytics Data API-nin aktiv olduğunu, Property ID-ni və service account icazəsini yoxlayın.' };
}

export async function getGa4Data(days = 28): Promise<Ga4Data> {
  await requireAdmin();
  days = Math.min(Math.max(Math.trunc(days), 1), 365);
  const propertyId = process.env.GA4_PROPERTY_ID?.replace(/^properties\//, '').trim();
  let clientEmail = process.env.GA4_CLIENT_EMAIL?.trim();
  let privateKeyRaw = process.env.GA4_PRIVATE_KEY;
  const bundledCredentials = process.env.GA4_SERVICE_ACCOUNT_JSON ? parseCredentialsJson(process.env.GA4_SERVICE_ACCOUNT_JSON) : null;
  if (bundledCredentials) {
    clientEmail ||= bundledCredentials.client_email?.trim();
    privateKeyRaw ||= bundledCredentials.private_key;
  }

  if (!propertyId || !clientEmail || !privateKeyRaw) {
    return { ok: false, configured: false, error: 'GA4 hələ tam qurulmayıb', hint: 'GA4_PROPERTY_ID, GA4_CLIENT_EMAIL və GA4_PRIVATE_KEY dəyişənlərinin üçünün də mövcud olduğunu yoxlayın.' };
  }

  try {
    if (!/^\d+$/.test(propertyId)) {
      return { ok: false, configured: true, error: 'GA4_PROPERTY_ID düzgün deyil.', hint: 'G-XXXX Measurement ID əvəzinə GA4 Admin bölməsindəki yalnız rəqəmlərdən ibarət Property ID-ni yazın.' };
    }
    if (!/^[^@\s]+@[^@\s]+\.iam\.gserviceaccount\.com$/.test(clientEmail)) {
      return { ok: false, configured: true, error: 'GA4_CLIENT_EMAIL düzgün service account ünvanı deyil.', hint: 'Email ünvanını Google Cloud-dan endirilmiş service-account JSON faylındakı client_email sahəsindən götürün.' };
    }
    const privateKey = normalizePrivateKey(privateKeyRaw);
    const { BetaAnalyticsDataClient } = await import('@google-analytics/data');
    const client = new BetaAnalyticsDataClient({
      credentials: { client_email: clientEmail, private_key: privateKey },
    });

    const dateRanges = [{ startDate: `${days}daysAgo`, endDate: 'today' }];
    const prop = `properties/${propertyId}`;

    // Paralel sorğular
    const [summary, daily, countries, sources, pages, devices] = await Promise.all([
      client.runReport({ property: prop, dateRanges,
        metrics: [{ name: 'totalUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }, { name: 'bounceRate' }, { name: 'averageSessionDuration' }] }),
      client.runReport({ property: prop, dateRanges,
        dimensions: [{ name: 'date' }], metrics: [{ name: 'totalUsers' }], orderBys: [{ dimension: { dimensionName: 'date' } }] }),
      client.runReport({ property: prop, dateRanges,
        dimensions: [{ name: 'country' }], metrics: [{ name: 'totalUsers' }], orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }], limit: 8 }),
      client.runReport({ property: prop, dateRanges,
        dimensions: [{ name: 'sessionDefaultChannelGroup' }], metrics: [{ name: 'totalUsers' }], orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }], limit: 8 }),
      client.runReport({ property: prop, dateRanges,
        dimensions: [{ name: 'pagePath' }], metrics: [{ name: 'screenPageViews' }], orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 8 }),
      client.runReport({ property: prop, dateRanges,
        dimensions: [{ name: 'deviceCategory' }], metrics: [{ name: 'totalUsers' }] }),
    ]);

    const num = (r: any, i = 0) => Number(r?.metricValues?.[i]?.value || 0);
    const s = summary[0].rows?.[0];
    const dur = num(s, 4);
    const mins = Math.floor(dur / 60), secs = Math.round(dur % 60);

    return {
      ok: true,
      configured: true,
      summary: {
        users: num(s, 0),
        sessions: num(s, 1),
        pageViews: num(s, 2),
        bounceRate: (num(s, 3) * 100).toFixed(1) + '%',
        avgDuration: `${mins}d ${secs}s`,
      },
      daily: (daily[0].rows || []).map(r => ({
        date: String(r.dimensionValues?.[0]?.value || '').replace(/(\d{4})(\d{2})(\d{2})/, '$3.$2'),
        users: Number(r.metricValues?.[0]?.value || 0),
      })),
      countries: (countries[0].rows || []).map(r => ({
        name: String(r.dimensionValues?.[0]?.value || ''),
        users: Number(r.metricValues?.[0]?.value || 0),
      })),
      sources: (sources[0].rows || []).map(r => ({
        name: String(r.dimensionValues?.[0]?.value || 'Birbaşa'),
        users: Number(r.metricValues?.[0]?.value || 0),
      })),
      pages: (pages[0].rows || []).map(r => ({
        path: String(r.dimensionValues?.[0]?.value || ''),
        views: Number(r.metricValues?.[0]?.value || 0),
      })),
      devices: (devices[0].rows || []).map(r => ({
        name: String(r.dimensionValues?.[0]?.value || ''),
        users: Number(r.metricValues?.[0]?.value || 0),
      })),
    };
  } catch (ex: any) {
    return { ok: false, configured: true, ...ga4Error(ex) };
  }
}
