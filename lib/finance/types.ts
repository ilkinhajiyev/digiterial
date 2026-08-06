export type PaymentStatus = 'gözlənilir' | 'qismən ödənilib' | 'ödənilib' | 'gecikib';
export type PaymentMethod = 'bank' | 'kart' | 'nağd';

export interface FinanceIncome {
  id: string;
  client_name: string;
  project_name: string;
  service_type: string;
  contract_no: string;
  invoice_no: string;
  net_amount: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  payment_date?: string | null;
  due_date: string;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  responsible_name: string;
  note?: string | null;
  document_url?: string | null;
  recurring: boolean;
  recurrence_day?: number | null;
  agency_revenue: boolean;
  created_at: string;
}

export interface FinanceExpense {
  id: string;
  supplier_name: string;
  category: string;
  project_name?: string | null;
  client_name?: string | null;
  net_amount: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  expense_date: string;
  due_date?: string | null;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  responsible_name: string;
  note?: string | null;
  document_url?: string | null;
  recurring: boolean;
  planned: boolean;
  is_client_ad_budget: boolean;
  created_at: string;
}

export interface FinanceBudget {
  id: string;
  period: string;
  scope_type: 'ümumi' | 'müştəri' | 'layihə' | 'xidmət';
  scope_name: string;
  category: string;
  revenue_plan: number;
  expense_limit: number;
  margin_target: number;
  scenario: 'optimist' | 'real' | 'pessimist';
}

export interface FinanceAccount {
  id: string;
  name: string;
  type: 'bank' | 'kassa';
  balance: number;
}

export interface FinanceAudit {
  id: string;
  user_name: string;
  action: string;
  entity: string;
  old_data?: Record<string, unknown> | null;
  new_data?: Record<string, unknown> | null;
  created_at: string;
}

export interface FinanceData {
  incomes: FinanceIncome[];
  expenses: FinanceExpense[];
  budgets: FinanceBudget[];
  accounts: FinanceAccount[];
  audit: FinanceAudit[];
  taxRate: number;
}
