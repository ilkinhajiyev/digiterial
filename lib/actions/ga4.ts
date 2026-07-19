'use server';

// Google Analytics 4 Data API-dən real statistika çəkir.
// Lazımi env dəyişənləri (Hostinger-də):
//   GA4_PROPERTY_ID          — GA4 property ID (rəqəm, məs. 512345678)
//   GA4_CLIENT_EMAIL         — service account email
//   GA4_PRIVATE_KEY          — service account private key (\n-lərlə)

type Row = Record<string, string | number>;

export type Ga4Data = {
  ok: boolean;
  error?: string;
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

export async function getGa4Data(days = 28): Promise<Ga4Data> {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const clientEmail = process.env.GA4_CLIENT_EMAIL;
  let privateKey = process.env.GA4_PRIVATE_KEY;

  if (!propertyId || !clientEmail || !privateKey) {
    return { ok: false, configured: false, error: 'GA4 hələ qurulmayıb' };
  }

  // Env dəyişəni bəzən əlavə boşluq/tırnaqla saxlanır — təmizlə
  privateKey = privateKey.trim();
  if (
    (privateKey.startsWith('"') && privateKey.endsWith('"')) ||
    (privateKey.startsWith("'") && privateKey.endsWith("'"))
  ) {
    privateKey = privateKey.slice(1, -1).trim();
  }
  // Windows-dan kopyalananda gələn CR simvollarını təmizlə
  privateKey = privateKey.replace(/\r/g, '');
  // Hostinger env-də \n hərfi mətn kimi gəlir (bəzən iki dəfə escape olunub) — real sətir keçidinə çevir.
  // Əvvəlcə iki qat escape olunmuş "\\\\n" (iki backslash + n) formasını, sonra tək qat "\\n" formasını çevir —
  // sıra vacibdir, əks halda tək backslash qalıb PEM-i pozur.
  privateKey = privateKey.replace(/\\\\n/g, '\n');
  privateKey = privateKey.replace(/\\n/g, '\n');
  // Açar artıq real sətir keçidləri ilə gəlibsə belə problem olmasın deyə yenidən trim et
  privateKey = privateKey.trim() + '\n';

  // PEM strukturunu yoxla — korlanmış açarı Google-a göndərməzdən əvvəl aydın xəta ver
  const looksLikePem =
    /^-----BEGIN (RSA )?PRIVATE KEY-----\n/.test(privateKey) &&
    /\n-----END (RSA )?PRIVATE KEY-----\n?$/.test(privateKey);
  if (!looksLikePem) {
    return {
      ok: false,
      configured: true,
      error:
        'GA4_PRIVATE_KEY PEM formatında deyil (BEGIN/END PRIVATE KEY sətirləri tapılmadı və ya sətir keçidləri korlanıb). ' +
        'Service account JSON faylındakı "private_key" dəyərini olduğu kimi (başında/sonunda dırnaq olmadan) yenidən yapışdırın.',
    };
  }

  try {
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
    return { ok: false, configured: true, error: ex?.message || 'GA4 sorğu xətası' };
  }
}
