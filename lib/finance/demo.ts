import type { FinanceData } from './types';

export const demoFinanceData: FinanceData = {
  taxRate: 18,
  accounts: [
    { id: 'a1', name: 'Kapital Bank — AZN', type: 'bank', balance: 48250 },
    { id: 'a2', name: 'ABB — AZN', type: 'bank', balance: 19800 },
    { id: 'a3', name: 'Baş kassa', type: 'kassa', balance: 3450 },
  ],
  incomes: [
    { id: 'i1', client_name: 'Caspian Retail', project_name: 'Payız satış kampaniyası', service_type: 'Meta Ads', contract_no: 'M-26-041', invoice_no: 'INV-2026-081', net_amount: 8500, tax_amount: 1530, total_amount: 10030, paid_amount: 6000, due_date: '2026-08-10', payment_method: 'bank', status: 'qismən ödənilib', responsible_name: 'Aysel Məmmədova', recurring: true, recurrence_day: 5, agency_revenue: true, created_at: '2026-08-01T09:30:00Z' },
    { id: 'i2', client_name: 'Baku Clinic', project_name: 'Korporativ sayt', service_type: 'Sayt hazırlanması', contract_no: 'M-26-039', invoice_no: 'INV-2026-079', net_amount: 18000, tax_amount: 3240, total_amount: 21240, paid_amount: 21240, payment_date: '2026-08-03', due_date: '2026-08-05', payment_method: 'bank', status: 'ödənilib', responsible_name: 'Murad Əliyev', recurring: false, agency_revenue: true, created_at: '2026-08-02T11:00:00Z' },
    { id: 'i3', client_name: 'Nova Residence', project_name: 'Aylıq kommunikasiya', service_type: 'SMM', contract_no: 'M-26-012', invoice_no: 'INV-2026-075', net_amount: 4200, tax_amount: 756, total_amount: 4956, paid_amount: 0, due_date: '2026-08-05', payment_method: 'bank', status: 'gecikib', responsible_name: 'Nərgiz Quliyeva', recurring: true, recurrence_day: 1, agency_revenue: true, created_at: '2026-08-01T08:00:00Z' },
    { id: 'i4', client_name: 'GreenMart', project_name: 'Performance 360', service_type: 'Google Ads', contract_no: 'M-26-033', invoice_no: 'INV-2026-080', net_amount: 6500, tax_amount: 1170, total_amount: 7670, paid_amount: 7670, payment_date: '2026-08-04', due_date: '2026-08-07', payment_method: 'kart', status: 'ödənilib', responsible_name: 'Aysel Məmmədova', recurring: true, recurrence_day: 3, agency_revenue: true, created_at: '2026-08-03T14:20:00Z' },
    { id: 'i5', client_name: 'Silk Way Travel', project_name: 'Qış istiqamətləri', service_type: 'Video çəkiliş', contract_no: 'M-26-044', invoice_no: 'INV-2026-082', net_amount: 12000, tax_amount: 2160, total_amount: 14160, paid_amount: 7000, due_date: '2026-08-18', payment_method: 'bank', status: 'qismən ödənilib', responsible_name: 'Murad Əliyev', recurring: false, agency_revenue: true, created_at: '2026-08-04T10:00:00Z' },
  ],
  expenses: [
    { id: 'e1', supplier_name: 'Meta Platforms', category: 'Meta reklam büdcəsi', project_name: 'Payız satış kampaniyası', client_name: 'Caspian Retail', net_amount: 14000, tax_amount: 0, total_amount: 14000, paid_amount: 14000, expense_date: '2026-08-02', payment_method: 'kart', status: 'ödənilib', responsible_name: 'Elvin Həsənli', recurring: false, planned: true, is_client_ad_budget: true, created_at: '2026-08-02T12:00:00Z' },
    { id: 'e2', supplier_name: 'Google Ads', category: 'Google reklam büdcəsi', project_name: 'Performance 360', client_name: 'GreenMart', net_amount: 9000, tax_amount: 0, total_amount: 9000, paid_amount: 9000, expense_date: '2026-08-03', payment_method: 'kart', status: 'ödənilib', responsible_name: 'Elvin Həsənli', recurring: false, planned: true, is_client_ad_budget: true, created_at: '2026-08-03T09:00:00Z' },
    { id: 'e3', supplier_name: 'MotionLab Studio', category: 'Frilans ödənişləri', project_name: 'Qış istiqamətləri', client_name: 'Silk Way Travel', net_amount: 2300, tax_amount: 414, total_amount: 2714, paid_amount: 1400, expense_date: '2026-08-04', due_date: '2026-08-14', payment_method: 'bank', status: 'qismən ödənilib', responsible_name: 'Nərgiz Quliyeva', recurring: false, planned: true, is_client_ad_budget: false, created_at: '2026-08-04T16:00:00Z' },
    { id: 'e4', supplier_name: 'Digiterial komandası', category: 'Əməkhaqqı', net_amount: 16500, tax_amount: 0, total_amount: 16500, paid_amount: 0, expense_date: '2026-08-05', due_date: '2026-08-10', payment_method: 'bank', status: 'gözlənilir', responsible_name: 'Leyla Rzayeva', recurring: true, planned: true, is_client_ad_budget: false, created_at: '2026-08-05T09:00:00Z' },
    { id: 'e5', supplier_name: 'Port Baku Office', category: 'Ofis icarəsi', net_amount: 3200, tax_amount: 576, total_amount: 3776, paid_amount: 3776, expense_date: '2026-08-01', payment_method: 'bank', status: 'ödənilib', responsible_name: 'Leyla Rzayeva', recurring: true, planned: true, is_client_ad_budget: false, created_at: '2026-08-01T08:00:00Z' },
    { id: 'e6', supplier_name: 'Adobe & Figma', category: 'Proqram və abunəliklər', net_amount: 780, tax_amount: 0, total_amount: 780, paid_amount: 780, expense_date: '2026-08-06', payment_method: 'kart', status: 'ödənilib', responsible_name: 'Murad Əliyev', recurring: true, planned: true, is_client_ad_budget: false, created_at: '2026-08-06T08:00:00Z' },
    { id: 'e7', supplier_name: 'CineRent Baku', category: 'Kontent istehsalı', project_name: 'Qış istiqamətləri', client_name: 'Silk Way Travel', net_amount: 1800, tax_amount: 324, total_amount: 2124, paid_amount: 0, expense_date: '2026-08-06', due_date: '2026-08-20', payment_method: 'bank', status: 'gözlənilir', responsible_name: 'Nərgiz Quliyeva', recurring: false, planned: true, is_client_ad_budget: false, created_at: '2026-08-06T11:00:00Z' },
  ],
  budgets: [
    { id: 'b1', period: '2026-08', scope_type: 'ümumi', scope_name: 'Agentlik', category: 'Əməliyyat', revenue_plan: 55000, expense_limit: 32000, margin_target: 35, scenario: 'real' },
    { id: 'b2', period: '2026-08', scope_type: 'layihə', scope_name: 'Payız satış kampaniyası', category: 'Meta Ads', revenue_plan: 9500, expense_limit: 2500, margin_target: 45, scenario: 'real' },
    { id: 'b3', period: '2026-08', scope_type: 'layihə', scope_name: 'Qış istiqamətləri', category: 'Video', revenue_plan: 14500, expense_limit: 5200, margin_target: 40, scenario: 'real' },
  ],
  audit: [
    { id: 'l1', user_name: 'Leyla Rzayeva', action: 'Yenilədi', entity: 'Xərc · Əməkhaqqı', created_at: '2026-08-06T10:42:00Z' },
    { id: 'l2', user_name: 'Aysel Məmmədova', action: 'Qismən ödəniş əlavə etdi', entity: 'INV-2026-081', created_at: '2026-08-06T09:15:00Z' },
    { id: 'l3', user_name: 'Murad Əliyev', action: 'Yaratdı', entity: 'INV-2026-082', created_at: '2026-08-04T10:00:00Z' },
  ],
};
