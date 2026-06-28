import { createClient } from '@/lib/supabase/server';
import PortfolioTable from '@/components/admin/portfolio-table';
export default async function PortfolioPage() {
  const sb = await createClient();
  const { data } = await sb.from('portfolio_items').select('*').order('position', { ascending: true }).order('created_at', { ascending: false });
  return <PortfolioTable rows={(data as any) || []} />;
}
