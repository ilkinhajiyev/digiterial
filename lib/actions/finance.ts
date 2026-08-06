'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createAdminServiceClient, requireAdmin } from '@/lib/security/admin';

const common = {
  net_amount: z.coerce.number().min(0),
  tax_amount: z.coerce.number().min(0),
  total_amount: z.coerce.number().min(0),
  paid_amount: z.coerce.number().min(0),
  payment_method: z.enum(['bank', 'kart', 'nağd']),
  status: z.enum(['gözlənilir', 'qismən ödənilib', 'ödənilib', 'gecikib']),
  responsible_name: z.string().min(2).max(120),
};

const incomeSchema = z.object({
  id: z.string().uuid().optional(), client_name: z.string().min(2).max(160), project_name: z.string().min(2).max(160),
  service_type: z.string().min(2).max(120), contract_no: z.string().max(80).default(''), invoice_no: z.string().min(2).max(80),
  ...common, payment_date: z.string().nullable().optional(), due_date: z.string().min(10).max(10), note: z.string().max(2000).nullable().optional(),
  document_url: z.string().url().nullable().optional().or(z.literal('')), recurring: z.boolean().default(false), recurrence_day: z.coerce.number().min(1).max(28).nullable().optional(), agency_revenue: z.boolean().default(true),
});

const expenseSchema = z.object({
  id: z.string().uuid().optional(), supplier_name: z.string().min(2).max(160), category: z.string().min(2).max(120),
  project_name: z.string().max(160).nullable().optional(), client_name: z.string().max(160).nullable().optional(), ...common,
  expense_date: z.string().min(10).max(10), due_date: z.string().nullable().optional(), note: z.string().max(2000).nullable().optional(),
  document_url: z.string().url().nullable().optional().or(z.literal('')), recurring: z.boolean().default(false), planned: z.boolean().default(false), is_client_ad_budget: z.boolean().default(false),
});

async function audit(entity: string, action: string, newData: Record<string, unknown>) {
  const { user } = await requireAdmin();
  const svc = await createAdminServiceClient();
  await svc.from('finance_audit_log').insert({ actor_id: user.id, user_name: user.email ?? 'Admin', entity, action, entity_id: String(newData.id ?? ''), new_data: newData });
}

export async function saveFinanceIncome(input: unknown) {
  try {
    const data = incomeSchema.parse(input);
    const svc = await createAdminServiceClient();
    const { total_amount: _calculatedTotal, ...payload } = data;
    const { data: saved, error } = await svc.from('finance_income').upsert(payload).select().single();
    if (error) throw error;
    await audit('Gəlir', data.id ? 'Yenilədi' : 'Yaratdı', saved);
    revalidatePath('/admin/finance');
    return { ok: true, data: saved };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Gəlir saxlanmadı' };
  }
}

export async function saveFinanceExpense(input: unknown) {
  try {
    const data = expenseSchema.parse(input);
    const svc = await createAdminServiceClient();
    const { total_amount: _calculatedTotal, ...payload } = data;
    const { data: saved, error } = await svc.from('finance_expenses').upsert(payload).select().single();
    if (error) throw error;
    await audit('Xərc', data.id ? 'Yenilədi' : 'Yaratdı', saved);
    revalidatePath('/admin/finance');
    return { ok: true, data: saved };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Xərc saxlanmadı' };
  }
}
