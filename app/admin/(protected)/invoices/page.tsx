import { createClient } from '@/lib/supabase/server';
import GenericTable from '@/components/admin/generic-table';
export default async function Page() {
  const sb = await createClient();
  const { data } = await sb.from('invoices').select('*').order('created_at', { ascending: false });
  return <GenericTable table="invoices" title="Maliyyə / Fakturalar" rows={data || []} revalidate="/admin/invoices"
    columns={[{ key: 'number', label: '#' }, { key: 'amount', label: 'Məbləğ', format: 'money' }, { key: 'status', label: 'Status', format: 'badge' }, { key: 'issue_date', label: 'Tarix' }, { key: 'due_date', label: 'Son ödəniş' }]}
    fields={[{ name: 'number', label: 'Faktura №', required: true }, { name: 'amount', label: 'Məbləğ (₼)', type: 'number', required: true }, { name: 'status', label: 'Status', type: 'select', options: ['draft', 'sent', 'paid', 'overdue', 'void'] }, { name: 'issue_date', label: 'Tarix', type: 'date' }, { name: 'due_date', label: 'Son ödəniş', type: 'date' }]} />;
}
