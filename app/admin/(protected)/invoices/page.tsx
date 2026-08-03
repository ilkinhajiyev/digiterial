import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import CrudTable from '@/components/admin/crud-table';
import { upsertInvoice, destroyInvoice } from '@/lib/actions/admin';

export default async function Page() {
  await (await createClient()).auth.getUser(); // auth yoxla
  const svc = createServiceClient();
  const { data } = await svc.from('invoices').select('*').order('created_at', { ascending: false });
  return (
    <CrudTable
      title="Maliyyə / Fakturalar" rows={data ?? []}
      upsert={upsertInvoice} destroy={destroyInvoice}
      cols={[
        { key: 'number', label: '№' },
        { key: 'amount', label: 'Məbləğ', fmt: 'money' },
        { key: 'status', label: 'Status', fmt: 'badge' },
        { key: 'issue_date', label: 'Tarix' },
        { key: 'due_date', label: 'Son ödəniş' },
      ]}
      fields={[
        { name: 'number', label: 'Faktura №', required: true, placeholder: 'INV-001' },
        { name: 'amount', label: 'Məbləğ (₼)', type: 'number', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'sent', 'paid', 'overdue', 'void'] },
        { name: 'issue_date', label: 'Tarix', type: 'date' },
        { name: 'due_date', label: 'Son ödəniş', type: 'date' },
      ]}
    />
  );
}
