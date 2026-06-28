'use client';
import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { submitContact } from '@/lib/actions/contact';

export default function ContactForm() {
  const t = useTranslations('pages.contact');
  const [pending, start] = useTransition();
  const [ok, setOk] = useState(false);
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget; const fd = new FormData(form);
    start(async () => { const r = await submitContact(fd); if (r.ok) { setOk(true); form.reset(); } });
  }
  const inp = 'w-full bg-[#0f0f0f] border border-white/15 rounded-xl px-4 py-3.5 text-white outline-none focus:border-brand';
  const lbl = 'font-mono text-xs uppercase tracking-wide text-mut-d block mb-2';
  return (
    <form onSubmit={onSubmit}>
      {ok && <div className="bg-brand/10 border border-brand rounded-xl px-4 py-3.5 text-brand text-sm mb-5">✓ {t('ok')}</div>}
      <div className="grid sm:grid-cols-2 gap-3.5 mb-4">
        <div><label className={lbl}>{t('name')}</label><input name="name" required className={inp} /></div>
        <div><label className={lbl}>{t('email')}</label><input name="email" type="email" required className={inp} /></div>
      </div>
      <div className="mb-4"><label className={lbl}>{t('company')}</label><input name="company" className={inp} /></div>
      <div className="mb-4"><label className={lbl}>{t('message')}</label><textarea name="message" rows={4} className={inp} /></div>
      <button disabled={pending} className="hbtn hbtn-y disabled:opacity-60">{pending ? t('sending') : t('send') + ' ↗'}</button>
    </form>
  );
}
