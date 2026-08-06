import FinanceSystem from '@/components/admin/finance-system';
import { demoFinanceData } from '@/lib/finance/demo';
import type { FinanceData } from '@/lib/finance/types';
import { createAdminServiceClient } from '@/lib/security/admin';

export const dynamic = 'force-dynamic';

export default async function FinancePage() {
  let data: FinanceData = demoFinanceData;
  let demoMode = true;

  try {
    const svc = await createAdminServiceClient();
    const [incomes, expenses, budgets, accounts, audit, tax] = await Promise.all([
      svc.from('finance_income').select('*').order('created_at', { ascending: false }),
      svc.from('finance_expenses').select('*').order('created_at', { ascending: false }),
      svc.from('finance_budgets').select('*').order('period', { ascending: false }),
      svc.from('finance_accounts').select('id,name,type,balance').order('name'),
      svc.from('finance_audit_log').select('id,user_name,action,entity,old_data,new_data,created_at').order('created_at', { ascending: false }).limit(100),
      svc.from('finance_tax_settings').select('vat_rate').eq('active', true).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    ]);
    const failed = [incomes, expenses, budgets, accounts, audit].some((result) => result.error);
    if (!failed) {
      data = {
        incomes: (incomes.data ?? []) as FinanceData['incomes'], expenses: (expenses.data ?? []) as FinanceData['expenses'],
        budgets: (budgets.data ?? []) as FinanceData['budgets'], accounts: (accounts.data ?? []) as FinanceData['accounts'],
        audit: (audit.data ?? []) as FinanceData['audit'], taxRate: Number(tax.data?.vat_rate ?? 18),
      };
      demoMode = false;
    }
  } catch {
    // Miqrasiya tətbiq olunana qədər real nümunəli demo rejimi göstərilir.
  }

  return <FinanceSystem initialData={data} demoMode={demoMode} />;
}
