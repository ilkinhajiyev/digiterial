'use client';
import { useRef, useState } from 'react';
import { submitContact } from '@/lib/actions/contact';
import { services } from '@/lib/content/services';
import { Arrow } from './icons';
import { useT } from '@/lib/i18n/client';

const BUDGETS = ['1 000 ₼-dək', '1 000 – 3 000 ₼', '3 000 – 10 000 ₼', '10 000 ₼-dan çox', 'Hələ bilmirəm'];

export default function ContactForm({ preset }: { preset?: string }) {
  const t = useT();
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');
  const [msg, setMsg] = useState('');
  const form = useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === 'sending') return;
    const f = e.currentTarget;
    const name = f.elements.namedItem('name') as HTMLInputElement;
    const email = f.elements.namedItem('email') as HTMLInputElement;
    if (name.value.trim().length < 2) { setState('err'); setMsg(t('Adınızı yazın (ən azı 2 hərf).')); name.focus(); return; }
    if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) { setState('err'); setMsg(t('Düzgün email ünvanı yazın, məsələn ad@sirket.az.')); email.focus(); return; }
    setState('sending'); setMsg('');
    const r = await submitContact(new FormData(f)).catch(() => ({ ok: false as const, error: t('Bağlantı xətası. Yenidən cəhd edin.') }));
    if (r.ok) { setState('ok'); setMsg(t('Müraciətiniz göndərildi. 24 saat ərzində sizinlə əlaqə saxlayacağıq.')); f.reset(); }
    else { setState('err'); setMsg(t(r.error)); }
  }

  return (
    <form className="card" ref={form} onSubmit={onSubmit} noValidate aria-busy={state === 'sending'}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
      <div className="fields">
        <div className="f"><label htmlFor="cf-name">{t('Ad və soyad *')}</label><input id="cf-name" name="name" autoComplete="name" placeholder={t('Məsələn, Aysel Məmmədova')} required minLength={2} maxLength={120} /></div>
        <div className="f"><label htmlFor="cf-email">{t('Email *')}</label><input id="cf-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="email@sirket.az" required maxLength={200} /></div>
        <div className="f"><label htmlFor="cf-phone">{t('Telefon')}</label><input id="cf-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+994 __ ___ __ __" maxLength={40} /></div>
        <div className="f"><label htmlFor="cf-budget">{t('Təxmini büdcə')}</label>
          <select id="cf-budget" name="budget" defaultValue=""><option value="">{t('Seçin…')}</option>{BUDGETS.map((b) => <option key={b} value={b}>{t(b)}</option>)}</select></div>
      </div>
      <fieldset className="f"><legend>{t('Hansı xidmət maraqlıdır?')}</legend>
        <div className="pick">
          {services.map((s) => (
            <span key={s.slug} style={{ display: 'contents' }}>
              <input type="checkbox" id={`sv-${s.slug}`} name="services" value={s.title} defaultChecked={preset === s.slug} />
              <label htmlFor={`sv-${s.slug}`}>{t(s.title)}</label>
            </span>
          ))}
        </div>
      </fieldset>
      <div className="f"><label htmlFor="cf-msg">{t('Layihə haqqında')}</label><textarea id="cf-msg" name="message" maxLength={5000} placeholder={t('Nə etmək istəyirsiniz və hansı nəticəni gözləyirsiniz?')} /></div>
      <div className="form-foot">
        <small>{t('Göndərməklə məlumatlarınızın yalnız sizinlə əlaqə saxlamaq üçün istifadə olunmasına razılıq verirsiniz.')}</small>
        <button className="btn btn-primary" type="submit" disabled={state === 'sending'}>{state === 'sending' ? t('Göndərilir…') : t('Müraciəti göndər')} <Arrow /></button>
      </div>
      {msg && <div className={`form-msg${state === 'ok' ? ' ok' : ''}`} role={state === 'err' ? 'alert' : 'status'}>{msg}</div>}
    </form>
  );
}
