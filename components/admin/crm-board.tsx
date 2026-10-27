'use client';
import CrudTable, { type Col, type Field } from './crud-table';
import Kanban from './kanban';
import { upsertLead, destroyLead, moveLead, upsertTask, destroyTask, moveTask } from '@/lib/actions/admin';

const LEAD_COLS: Col[] = [
  { key: 'name', label: 'Ad' }, { key: 'company', label: 'Şirkət' }, { key: 'service', label: 'Xidmət' },
  { key: 'value', label: 'Dəyər', fmt: 'money' }, { key: 'stage', label: 'Mərhələ', fmt: 'badge' },
  { key: 'source', label: 'Mənbə' }, { key: 'created_at', label: 'Daxil olub', fmt: 'ago' },
];
const LEAD_FIELDS: Field[] = [
  { name: 'name', label: 'Ad Soyad', required: true, span2: true },
  { name: 'company', label: 'Şirkət' }, { name: 'service', label: 'Xidmət' },
  { name: 'email', label: 'Email', type: 'email' }, { name: 'phone', label: 'Telefon', type: 'tel' },
  { name: 'value', label: 'Dəyər (₼)', type: 'number' },
  { name: 'stage', label: 'Mərhələ', type: 'select', options: ['new', 'contacted', 'proposal', 'negotiation', 'won', 'lost'] },
  { name: 'source', label: 'Mənbə', type: 'select', options: ['organic', 'paid', 'social', 'referral', 'direct'] },
  { name: 'message', label: 'Qeyd / mesaj', type: 'textarea' },
];

export function LeadsBoard({ rows }: { rows: any[] }) {
  const open = rows.filter((r) => !['won', 'lost'].includes(r.stage));
  const pipe = open.reduce((a, r) => a + Number(r.value || 0), 0);
  const won = rows.filter((r) => r.stage === 'won').length;
  const closed = won + rows.filter((r) => r.stage === 'lost').length;
  return (
    <CrudTable title="Pipeline" subtitle={`${open.length} açıq lead · ${new Intl.NumberFormat('az-AZ').format(pipe)} ₼ pipeline · qazanma ${closed ? Math.round((won / closed) * 100) : 0}%`}
      rows={rows} cols={LEAD_COLS} fields={LEAD_FIELDS} upsert={upsertLead} destroy={destroyLead}
      board={(edit) => <Kanban kind="lead" items={rows} field="stage" move={moveLead} onOpen={edit}
        columns={['new', 'contacted', 'proposal', 'negotiation', 'won', 'lost'].map((k) => ({ key: k, tone: k }))} />} />
  );
}

const TASK_COLS: Col[] = [
  { key: 'title', label: 'Tapşırıq' }, { key: 'area', label: 'Sahə' },
  { key: 'status', label: 'Status', fmt: 'badge' }, { key: 'due_date', label: 'Son tarix', fmt: 'date' },
];
const TASK_FIELDS: Field[] = [
  { name: 'title', label: 'Başlıq', required: true, span2: true },
  { name: 'area', label: 'Sahə', placeholder: 'Dizayn, Dev, SEO…' },
  { name: 'status', label: 'Status', type: 'select', options: ['backlog', 'in_progress', 'review', 'done'] },
  { name: 'due_date', label: 'Son tarix', type: 'date' },
];

export function TasksBoard({ rows }: { rows: any[] }) {
  const overdue = rows.filter((r) => r.status !== 'done' && r.due_date && new Date(r.due_date) < new Date()).length;
  return (
    <CrudTable title="Tapşırıqlar" subtitle={`${rows.filter((r) => r.status !== 'done').length} açıq${overdue ? ` · ${overdue} gecikən` : ''}`}
      rows={rows} cols={TASK_COLS} fields={TASK_FIELDS} upsert={upsertTask} destroy={destroyTask}
      board={(edit) => <Kanban kind="task" items={rows} field="status" move={moveTask} onOpen={edit}
        columns={['backlog', 'in_progress', 'review', 'done'].map((k) => ({ key: k, tone: k }))} />} />
  );
}
