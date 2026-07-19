export const dynamic = 'force-dynamic';
import { createServiceClient } from '@/lib/supabase/service';
import { getGa4Data } from '@/lib/actions/ga4';
import { getYandexData } from '@/lib/actions/yandex';
import RealAnalytics from '@/components/admin/real-analytics';

async function count(table: string) {
  try {
    const sb = createServiceClient();
    const { count } = await sb.from(table).select('*', { count: 'exact', head: true });
    return count ?? 0;
  } catch { return 0; }
}

export default async function Page() {
  const [ga4, yandex, leads, clients] = await Promise.all([
    getGa4Data(28),
    getYandexData(28),
    count('leads'),
    count('clients'),
  ]);

  return <RealAnalytics ga4={ga4} yandex={yandex} leads={leads} clients={clients} />;
}
