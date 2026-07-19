'use server';

// Yandex Metrica Reporting API-dən statistika çəkir.
// Lazımi env dəyişəni (Hostinger-də):
//   YANDEX_OAUTH_TOKEN — Yandex OAuth token (metrika:read icazəli)
// Sayğac ID isə admin panelin Tənzimləmələr → Analitika bölməsində saxlanan
// "Yandex Metrica (sayğac ID)" dəyərindən (settings.analytics.yandexMetrica) götürülür.

import { getSettings, defaultSettings } from '@/lib/data/settings';

export type YandexData = {
  ok: boolean;
  error?: string;
  configured: boolean;
  summary?: {
    visits: number;
    users: number;
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

const API = 'https://api-metrika.yandex.net/stat/v1/data';

function fmt(d: Date) {
  return d.toISOString().slice(0, 10);
}

async function query(token: string, counterId: string, params: Record<string, string>) {
  const qs = new URLSearchParams({ ids: counterId, ...params });
  const res = await fetch(`${API}?${qs.toString()}`, {
    headers: { Authorization: `OAuth ${token}` },
    cache: 'no-store',
  });
  const json: any = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = json?.message || json?.errors?.[0]?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json;
}

export async function getYandexData(days = 28): Promise<YandexData> {
  const token = process.env.YANDEX_OAUTH_TOKEN;
  const settings = await getSettings().catch(() => defaultSettings);
  const counterId = settings.analytics?.yandexMetrica;

  if (!token || !counterId) {
    return { ok: false, configured: false, error: 'Yandex Metrica hələ qurulmayıb' };
  }

  const date2 = new Date();
  const date1 = new Date(date2.getTime() - days * 24 * 60 * 60 * 1000);
  const dateParams = { date1: fmt(date1), date2: fmt(date2) };

  try {
    // Hər bölmə ayrıca sorğu ilə çəkilir — biri uğursuz olsa belə (məs. yanlış
    // dimension adı), digərləri işləməyə davam etsin deyə Promise.allSettled istifadə olunur.
    const [summaryR, dailyR, countriesR, sourcesR, pagesR, devicesR] = await Promise.allSettled([
      query(token, counterId, { ...dateParams, metrics: 'ym:s:visits,ym:s:pageviews,ym:s:users,ym:s:bounceRate,ym:s:avgVisitDurationSeconds' }),
      query(token, counterId, { ...dateParams, metrics: 'ym:s:users', dimensions: 'ym:s:date', sort: 'ym:s:date' }),
      query(token, counterId, { ...dateParams, metrics: 'ym:s:users', dimensions: 'ym:s:regionCountry', sort: '-ym:s:users', limit: '8' }),
      query(token, counterId, { ...dateParams, metrics: 'ym:s:users', dimensions: 'ym:s:lastTrafficSource', sort: '-ym:s:users', limit: '8' }),
      query(token, counterId, { ...dateParams, metrics: 'ym:pv:pageviews', dimensions: 'ym:pv:URLPathFull', sort: '-ym:pv:pageviews', limit: '8' }),
      query(token, counterId, { ...dateParams, metrics: 'ym:s:users', dimensions: 'ym:s:deviceCategory', sort: '-ym:s:users' }),
    ]);

    // Əgər elə summary sorğusu belə uğursuzdursa, bunu əsl xəta kimi qaytar
    if (summaryR.status === 'rejected') {
      throw summaryR.reason;
    }

    const totals = summaryR.value?.data?.[0]?.metrics || [];
    const visits = Number(totals[0] || 0);
    const users = Number(totals[2] || 0);
    const pageViews = Number(totals[1] || 0);
    const bounceRate = Number(totals[3] || 0);
    const avgSec = Number(totals[4] || 0);
    const mins = Math.floor(avgSec / 60), secs = Math.round(avgSec % 60);

    const rows = (r: PromiseSettledResult<any>) => (r.status === 'fulfilled' ? (r.value?.data || []) : []);

    return {
      ok: true,
      configured: true,
      summary: {
        visits,
        users,
        pageViews,
        bounceRate: bounceRate.toFixed(1) + '%',
        avgDuration: `${mins}d ${secs}s`,
      },
      daily: rows(dailyR).map((r: any) => ({
        date: String(r.dimensions?.[0]?.name || '').slice(5).replace('-', '.'),
        users: Number(r.metrics?.[0] || 0),
      })),
      countries: rows(countriesR).map((r: any) => ({
        name: String(r.dimensions?.[0]?.name || ''),
        users: Number(r.metrics?.[0] || 0),
      })),
      sources: rows(sourcesR).map((r: any) => ({
        name: String(r.dimensions?.[0]?.name || 'Birbaşa'),
        users: Number(r.metrics?.[0] || 0),
      })),
      pages: rows(pagesR).map((r: any) => ({
        path: String(r.dimensions?.[0]?.name || ''),
        views: Number(r.metrics?.[0] || 0),
      })),
      devices: rows(devicesR).map((r: any) => ({
        name: String(r.dimensions?.[0]?.name || ''),
        users: Number(r.metrics?.[0] || 0),
      })),
    };
  } catch (ex: any) {
    let msg = ex?.message || 'Yandex Metrica sorğu xətası';
    if (/no permission|forbidden|403/i.test(msg)) {
      msg += ' — OAuth tokenin bu sayğac üçün "metrika:read" icazəsi olduğunu yoxlayın.';
    }
    return { ok: false, configured: true, error: msg };
  }
}
