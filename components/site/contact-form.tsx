'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { submitContact } from '@/lib/actions/contact';

export default function ContactForm() {
  const t = useTranslations('pages.contact');
  const [loading, setLoading] = useState(false);
  const [ok,      setOk]      = useState(false);
  const [err,     setErr]     = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErr('');
    try {
      const fd = new FormData(e.currentTarget);
      const r = await submitContact(fd);
      if (r.ok) {
        setOk(true);
        (e.target as HTMLFormElement).reset();
      } else {
        setErr(r.error || 'Xəta baş verdi.');
      }
    } catch {
      setErr('Göndərilmədi. Yenidən cəhd edin.');
    } finally {
      setLoading(false);
    }
  }

  const inp = 'w-full bg-[#0f0f0f] border border-white/15 rounded-xl px-4 py-3.5 text-white outline-none focus:border-brand disabled:opacity-50';
  const lbl = 'font-mono text-xs uppercase tracking-wide text-mut-d block mb-2';

  return (
    <form onSubmit={onSubmit}>
      {ok && (
        <div className="bg-brand/10 border border-brand rounded-xl px-4 py-3.5 text-brand text-sm mb-5">
          ✓ {t('ok')}
        </div>
      )}
      {err && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3.5 mb-5">
          {err}
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-3.5 mb-4">
        <div>
          <label className={lbl}>{t('name')}</label>
          <input name="name" required disabled={loading} className={inp} />
        </div>
        <div>
          <label className={lbl}>{t('email')}</label>
          <input name="email" type="email" required disabled={loading} className={inp} />
        </div>
      </div>
      <div className="mb-4">
        <label className={lbl}>{t('company')}</label>
        <input name="company" disabled={loading} className={inp} />
      </div>
      <div className="mb-4">
        <label className={lbl}>{t('service')}</label>
        <select name="service" disabled={loading} className={inp}>
          <option value="">Seçin…</option>
          <option value="Veb sayt">Veb sayt</option>
          <option value="SEO">SEO</option>
          <option value="Google & Meta Ads">Google & Meta Ads</option>
          <option value="Brendinq">Brendinq & Dizayn</option>
          <option value="SMM">SMM</option>
          <option value="AI">AI & Avtomatlaşdırma</option>
          <option value="Digər">Digər</option>
        </select>
      </div>
      <div className="mb-4">
        <label className={lbl}>{t('message')}</label>
        <textarea name="message" rows={4} disabled={loading} className={inp} />
      </div>
      <button type="submit" disabled={loading}
        className="hbtn hbtn-y disabled:opacity-60 flex items-center gap-2">
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity=".3" strokeWidth="2"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {t('sending')}
          </>
        ) : `${t('send')} ↗`}
      </button>
    </form>
  );
}
