import type { FinanceData } from './types';

export const azn = (value: number) => new Intl.NumberFormat('az-AZ', { style: 'currency', currency: 'AZN', maximumFractionDigits: 0 }).format(value);
export const percent = (value: number) => `${Number.isFinite(value) ? value.toFixed(1) : '0.0'}%`;

export function financeSummary(data: FinanceData) {
  const revenue = data.incomes.filter((x) => x.agency_revenue).reduce((s, x) => s + x.net_amount, 0);
  const expense = data.expenses.filter((x) => !x.is_client_ad_budget).reduce((s, x) => s + x.net_amount, 0);
  const receivables = data.incomes.reduce((s, x) => s + Math.max(0, x.total_amount - x.paid_amount), 0);
  const payables = data.expenses.filter((x) => !x.is_client_ad_budget).reduce((s, x) => s + Math.max(0, x.total_amount - x.paid_amount), 0);
  const balance = data.accounts.reduce((s, x) => s + x.balance, 0);
  const limit = data.budgets.find((x) => x.scope_type === 'ümumi' && x.scenario === 'real')?.expense_limit ?? 0;
  const budgetUsage = limit ? (expense / limit) * 100 : 0;
  return { revenue, expense, profit: revenue - expense, receivables, payables, balance, budgetUsage, limit };
}

export function projectRows(data: FinanceData) {
  const projects = Array.from(new Set([...data.incomes.map((x) => x.project_name), ...data.expenses.map((x) => x.project_name).filter(Boolean)])) as string[];
  return projects.map((project) => {
    const revenue = data.incomes.filter((x) => x.project_name === project && x.agency_revenue).reduce((s, x) => s + x.net_amount, 0);
    const related = data.expenses.filter((x) => x.project_name === project);
    const adBudget = related.filter((x) => x.is_client_ad_budget).reduce((s, x) => s + x.net_amount, 0);
    const staff = related.filter((x) => /əməkhaqqı|frilans/i.test(x.category)).reduce((s, x) => s + x.net_amount, 0);
    const direct = related.filter((x) => !x.is_client_ad_budget && !/əməkhaqqı|frilans/i.test(x.category)).reduce((s, x) => s + x.net_amount, 0);
    const profit = revenue - staff - direct;
    const margin = revenue ? (profit / revenue) * 100 : 0;
    const plan = data.budgets.find((x) => x.scope_type === 'layihə' && x.scope_name === project)?.revenue_plan ?? revenue;
    return { project, revenue, direct, staff, adBudget, commission: revenue, profit, margin, plan };
  });
}

export const monthlyChart = [
  { month: 'Mar', income: 33500, expense: 22100, profit: 11400 },
  { month: 'Apr', income: 38200, expense: 24800, profit: 13400 },
  { month: 'May', income: 41600, expense: 27100, profit: 14500 },
  { month: 'İyn', income: 39700, expense: 26300, profit: 13400 },
  { month: 'İyl', income: 46200, expense: 29400, profit: 16800 },
  { month: 'Avq', income: 49200, expense: 24580, profit: 24620 },
];
