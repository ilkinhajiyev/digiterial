'use client';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { Arrow, Check } from '../icons';
import { useT } from '@/lib/i18n/client';

const QS = [
  ['Aydındırmı?', 'Müştəri sizi niyə seçməli olduğunu ilk 5 saniyədə başa düşür.'],
  ['İnandırırmı?', 'Hər ekran bir hədəfə xidmət edir: zəng, müraciət və ya satış.'],
  ['Sürətlidirmi?', 'Core Web Vitals yaşıldır, kod mobil üçün yazılıb, struktur axtarış sistemlərinə hazırdır.'],
  ['Ölçülürmü?', 'GA4 və konversiya izləməsi qurulub, nəyin işlədiyini rəqəmlərlə görürsünüz.'],
];
const VERDICTS = ['Suallara toxunun və saytınızı qiymətləndirin.', 'Başlanğıc var, amma sayt hələ satış üçün işləmir.', 'Yarı yoldasınız. Ən zəif iki nöqtədən başlayaq.', 'Yaxşı nəticədir. Son addım ən çox satışı gətirir.', 'Əla! Növbəti hədəf böyüməni sürətləndirməkdir.'];

export default function Quiz() {
  const t = useT();
  const [on, setOn] = useState([false, false, false, false]);
  const n = on.filter(Boolean).length;
  return (
    <div className="quiz">
      <div className="q-list">
        {QS.map(([h, p], i) => (
          <button key={i} className="q" aria-pressed={on[i]} onClick={() => setOn((a) => a.map((v, j) => (j === i ? !v : v)))}>
            <span className="box"><Check w={3} /></span><strong>{t(h)}</strong><span>{t(p)}</span>
          </button>
        ))}
      </div>
      <aside className="score" aria-live="polite">
        <div className="label">{t('Saytınızın nəticəsi')}</div>
        <div className="score-num"><span>{n}</span><small>/4</small></div>
        <div className="meter">{[0, 1, 2, 3].map((i) => <i key={i} className={i < n ? 'on' : ''} />)}</div>
        <p>{t(VERDICTS[n])}</p>
        <Link className="btn btn-primary" href="/elaqe">{t('Saytımı birlikdə yoxlayaq')} <Arrow /></Link>
      </aside>
    </div>
  );
}
