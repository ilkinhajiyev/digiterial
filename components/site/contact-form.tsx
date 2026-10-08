'use client';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { submitContact } from '@/lib/actions/contact';

export default function ContactForm({ services, defaultService = '' }: { services: string[]; defaultService?: string }) {
  const t = useTranslations('pages.contact');
  const [state, setState] = useState<'idle' | 'sending' | 'ok'>('idle');
  const [err, setErr] = useState<{ field?: 'name' | 'email'; msg: string } | null>(null);
  const started = useRef(0);
  const errRef = useRef<HTMLDivElement>(null);
  useEffect(() => { started.current = Date.now(); }, []);
  useEffect(() => { if (err) errRef.current?.focus(); }, [err]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === 'sending') return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    // Brauzer tərəfində sürətli yoxlama
    if (String(fd.get('name') || '').trim().length < 2) return setErr({ field: 'name', msg: t('errName') });
    if (!/^\S+@\S+\.\S+$/.test(String(fd.get('email') || ''))) return setErr({ field: 'email', msg: t('errEmail') });
    fd.set('_t', String(started.current));
    setErr(null); setState('sending');
    try {
      const r = await submitContact(fd);
      if (r.ok) { setState('ok'); form.reset(); return; }
      const map = { name: t('errName'), email: t('errEmail'), rate: t('errRate'), server: t('errServer') } as const;
      setErr({ field: r.code === 'name' || r.code === 'email' ? r.code : undefined, msg: map[r.code] });
      setState('idle');
    } catch {
      setErr({ msg: t('errServer') }); setState('idle');
    }
  }

  if (state === 'ok') {
    return (
      <div className="card flex min-h-[420px] flex-col items-start justify-center p-8 md:p-12" role="status" aria-live="polite">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-brand"><CheckCircle2 size={26} /></span>
        <h2 className="t-h2 mt-8 max-w-[16ch]">{t('ok')}</h2>
        <button type="button" onClick={() => { setState('idle'); started.current = Date.now(); }} className="btn-ghost mt-8">{t('again')}</button>
      </div>
    );
  }

  const sending = state === 'sending';
  const req = <span className="font-mono text-[.68rem] font-normal uppercase tracking-wider text-mut">{t('required')}</span>;
  const budgets = ['bud1', 'bud2', 'bud3', 'bud4', 'bud5'] as const;

  return (
    <form onSubmit={onSubmit} noValidate className="card p-6 sm:p-8 md:p-10" aria-busy={sending}>
      {err && (
        <div ref={errRef} tabIndex={-1} role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-[#E5484D]/30 bg-[#E5484D]/[.07] px-4 py-3.5 text-sm text-[#A1262A] outline-none">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />{err.msg}
        </div>
      )}
      {/* Honeypot — insanlara görünmür */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="field-label">{t('name')} {req}</label>
          <input id="cf-name" name="name" autoComplete="name" required minLength={2} maxLength={120} disabled={sending} className="field" placeholder={t('phName')} aria-invalid={err?.field === 'name' || undefined} />
        </div>
        <div>
          <label htmlFor="cf-email" className="field-label">{t('email')} {req}</label>
          <input id="cf-email" name="email" type="email" inputMode="email" autoComplete="email" required maxLength={200} disabled={sending} className="field" placeholder={t('phEmail')} aria-invalid={err?.field === 'email' || undefined} />
        </div>
        <div>
          <label htmlFor="cf-phone" className="field-label">{t('phone')}</label>
          <input id="cf-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={40} disabled={sending} className="field" placeholder={t('phPhone')} />
        </div>
        <div>
          <label htmlFor="cf-company" className="field-label">{t('company')}</label>
          <input id="cf-company" name="company" autoComplete="organization" maxLength={200} disabled={sending} className="field" placeholder={t('phCompany')} />
        </div>
      </div>

      <fieldset className="mt-6" disabled={sending}>
        <legend className="field-label">{t('service')}</legend>
        <div className="flex flex-wrap gap-2">
          {[...services, t('other')].map((s) => (
            <label key={s} className="cursor-pointer">
              <input type="radio" name="service" value={s} defaultChecked={s === defaultService} className="peer sr-only" />
              <span className="inline-flex rounded-full border border-[color:var(--line-strong)] px-4 py-2 text-sm transition hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-bone peer-focus-visible:ring-4 peer-focus-visible:ring-brand/30">{s}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <label htmlFor="cf-budget" className="field-label">{t('budget')}</label>
        <select id="cf-budget" name="budget" disabled={sending} className="field appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%23111%22 stroke-width=%221.6%22><path d=%22M4 6l4 4 4-4%22/></svg>')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10" defaultValue="">
          <option value="">{t('choose')}</option>
          {budgets.map((b) => <option key={b} value={t(b)}>{t(b)}</option>)}
        </select>
      </div>

      <div className="mt-6">
        <label htmlFor="cf-message" className="field-label">{t('message')}</label>
        <textarea id="cf-message" name="message" rows={5} maxLength={4000} disabled={sending} className="field resize-y" placeholder={t('phMessage')} />
      </div>

      <div className="mt-8 flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[46ch] text-xs leading-relaxed text-mut">{t('consent')}</p>
        <button type="submit" disabled={sending} className="btn-brand shrink-0">
          {sending ? <><Loader2 size={18} className="animate-spin" />{t('sending')}</> : <>{t('send')} <ArrowUpRight size={18} className="arr" /></>}
        </button>
      </div>
    </form>
  );
}
