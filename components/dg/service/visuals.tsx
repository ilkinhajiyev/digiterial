'use client';
// Xidmət səhifələrinin hero vizualları (hamısı "nümunə" kimi işarələnib)
import { useEffect, useRef, useState } from 'react';
import { Check, Icon, type IconName } from '../icons';
import { useT } from '@/lib/i18n/client';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Tabs<T extends string | number>({ items, value, onChange, label }: { items: { v: T; l: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div className="mini-tabs" role="group" aria-label={label}>
      {items.map((it) => <button key={String(it.v)} aria-pressed={value === it.v} onClick={() => onChange(it.v)}>{it.l}</button>)}
    </div>
  );
}

/* ---------- Veb sayt: cihaz maketi + PageSpeed dairələri ---------- */
export function WebVisual() {
  const t = useT();
  const [mob, setMob] = useState(false);
  const [auto, setAuto] = useState(true);
  const [score, setScore] = useState(0);
  useEffect(() => {
    if (!auto || reduced()) return;
    const iv = setInterval(() => setMob((m) => !m), 3200);
    return () => clearInterval(iv);
  }, [auto]);
  useEffect(() => {
    if (reduced()) { setScore(90); return; }
    let raf = 0, t0 = 0;
    const tm = setTimeout(() => {
      const st = (t: number) => { t0 = t0 || t; const k = Math.min((t - t0) / 1600, 1); setScore(Math.round(90 * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(st); };
      raf = requestAnimationFrame(st);
    }, 400);
    return () => { clearTimeout(tm); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="panel" aria-label={t('Sayt maketi və PageSpeed hədəfi')}>
      <div className="dev-top"><span className="label">{t('Mobil-əvvəl dizayn')}</span>
        <Tabs label={t('Cihaz')} value={mob ? 1 : 0} onChange={(v) => { setAuto(false); setMob(v === 1); }} items={[{ v: 0, l: t('Desktop') }, { v: 1, l: t('Mobil') }]} /></div>
      <div className="stage"><div className={`dev${mob ? ' mob' : ''}`}><div className="bar"><i /><i /><i /></div><div className="pg"><div className="h" /><div className="h2" /><div className="b" /><div className="gr"><i /><i /><i /></div></div></div></div>
      <div className="rings">
        {['Performans', 'Əlçatanlıq', 'Best practices', 'SEO'].map((n) => (
          <div className="ring" key={n}>
            <svg viewBox="0 0 64 64"><circle className="bg" cx="32" cy="32" r="28" /><circle className="fg" cx="32" cy="32" r="28" style={{ strokeDashoffset: 176 * (1 - score / 100) }} /></svg>
            <b>{score}{score === 90 ? '+' : ''}</b><span>{t(n)}</span>
          </div>
        ))}
      </div>
      <p className="note" style={{ marginTop: 12 }}>{t('Hər layihədə PageSpeed hədəfimiz: 90+.')}</p>
    </div>
  );
}

/* ---------- SEO: axtarış nəticələrində yuxarı qalxma ---------- */
const OTHERS = ['rəqib-1.az', 'kataloq.az', 'rəqib-2.com', 'forum.az', 'rəqib-3.az', 'xəbər.az', 'elan.az'];
export function SeoVisual() {
  const t = useT();
  const [kw, setKw] = useState(() => t('mebel mağazası bakı'));
  const [query, setQuery] = useState(kw);
  const [pos, setPos] = useState(8);
  const [run, setRun] = useState(0);
  const rowH = useRef(0);
  const first = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setPos(8);
    if (reduced()) { setPos(1); return; }
    const tms = [6, 4, 3, 1].map((p, i) => setTimeout(() => setPos(p), 900 + i * 1100));
    return () => tms.forEach(clearTimeout);
  }, [run]);
  useEffect(() => { if (first.current) rowH.current = first.current.offsetHeight; });
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const k = cap(query.trim() || t('açar söz'));
  // Sıra: "me" pos-1 indeksində, digərləri ardıcıl
  const order = [...OTHERS]; order.splice(pos - 1, 0, 'ME');
  const rows = [...OTHERS.map((d) => ({ d, me: false })), { d: 'sirketiniz.az', me: true }];
  return (
    <div className="panel serp" aria-label={t('Google axtarış nəticələrinin nümunəsi')}>
      <div className="pin"><span className="label">{t('Google axtarışı · nümunə')}</span><div className="pos"><span>{pos}</span><small>{t('mövqe')}</small></div></div>
      <form className="sbox" onSubmit={(e) => { e.preventDefault(); setQuery(kw); setRun((r) => r + 1); }}>
        <Icon name="search" strokeWidth={2.2} />
        <input value={kw} onChange={(e) => setKw(e.target.value)} aria-label={t('Açar söz')} maxLength={60} />
        <button type="submit">{t('Yenidən')}</button>
      </form>
      <div className="res">
        {rows.map((r, i) => {
          const target = order.indexOf(r.me ? 'ME' : r.d);
          return (
            <div key={r.d} ref={i === 0 ? first : undefined} className={`r${r.me ? ' me' : ''}`} style={{ transform: `translateY(${(target - i) * (rowH.current || 62)}px)` }}>
              <em>{target + 1}</em><div><small>{r.d}</small><b>{k} | {r.me ? t('Sirketiniz') : r.d}</b><i /></div>
            </div>
          );
        })}
      </div>
      <p className="note">{t('Nümunədir: real mövqe rəqabətdən, kontentdən və saytın texniki vəziyyətindən asılıdır.')}</p>
    </div>
  );
}

/* ---------- Reklam: format önizləməsi ---------- */
export function AdsVisual() {
  const t = useT();
  const [tab, setTab] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hl, setHl] = useState(() => t('Yay endirimi: bütün kolleksiya -30%'));
  useEffect(() => {
    if (!auto || reduced()) return;
    const iv = setInterval(() => setTab((x) => (x + 1) % 3), 3000);
    return () => clearInterval(iv);
  }, [auto]);
  const h = hl.trim() || t('Reklam başlığınız');
  return (
    <div className="panel adb" aria-label={t('Reklam formatlarının önizləməsi')}>
      <div className="pin"><span className="label">{t('Reklam önizləmə · nümunə')}</span>
        <Tabs label={t('Format')} value={tab} onChange={(v) => { setAuto(false); setTab(v); }} items={[{ v: 0, l: t('Google axtarış') }, { v: 1, l: t('Instagram story') }, { v: 2, l: t('Facebook feed') }]} /></div>
      <div className="adp">
        <div className="pv pv-search" hidden={tab !== 0}><small><b>{t('Sponsorlu')}</b> · brendiniz.az</small><h4>{h}</h4><p>{t('Bakı daxili pulsuz çatdırılma. Sifarişi onlayn verin, sabah təhvil alın.')}</p><div className="sl"><span>{t('Kataloq')}</span><span>{t('Əlaqə')}</span><span>{t('Çatdırılma')}</span></div></div>
        <div className="pv pv-story" hidden={tab !== 1}><div className="bars"><i /><i /><i /></div><div className="who"><i /><span>brendiniz<em> · {t('Sponsorlu')}</em></span></div><strong>{h}</strong><span className="cta">{t('İndi al')}</span></div>
        <div className="pv pv-feed" hidden={tab !== 2}><div className="hd"><i /><span>brendiniz<em>{t('Sponsorlu')}</em></span></div><div className="img"><strong>{h}</strong></div><div className="ft"><span>brendiniz.az</span><span>{t('Ətraflı →')}</span></div></div>
      </div>
      <div className="fld"><label htmlFor="hlIn">{t('Reklam başlığını yazın')}</label><input id="hlIn" value={hl} maxLength={60} onChange={(e) => { setAuto(false); setHl(e.target.value); }} /></div>
      <div className="kpis">{['ROAS', 'CPA', 'CTR', 'A/B test', 'GA4 · Pixel'].map((k) => <span key={k}>{k}</span>)}</div>
    </div>
  );
}

/* ---------- Brendinq: brend generatoru ---------- */
const PALETTES = [
  { c: ['#0E0F12', '#ECEEF1', '#F1B43A'], l: 'Qrafit və zəfəran' },
  { c: ['#1B1F3B', '#F4F1FF', '#7C6CFF'], l: 'Gecə və lavanda' },
  { c: ['#5B1A1A', '#F7EEE6', '#E8604C'], l: 'Bordo və mərcan' },
  { c: ['#0E0F12', '#FFFFFF', '#A2FFCB'], l: 'Qrafit və nanə' },
];
export function BrandVisual() {
  const t = useT();
  const [name, setName] = useState('Lumen');
  const [font, setFont] = useState<'f-wide' | 'f-geo' | 'f-cls'>('f-wide');
  const [pal, setPal] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto || reduced()) return;
    const iv = setInterval(() => setPal((p) => (p + 1) % PALETTES.length), 2600);
    return () => clearInterval(iv);
  }, [auto]);
  const n = name.trim() || t('Brend');
  const [b1, b2, b3] = PALETTES[pal].c;
  return (
    <div className="panel bb" aria-label={t('Brend generatoru nümunəsi')}>
      <div className="pin"><span className="label">{t('Brend generatoru · nümunə')}</span></div>
      <div className={`mock ${font}`} style={{ ['--b1' as string]: b1, ['--b2' as string]: b2, ['--b3' as string]: b3 } as React.CSSProperties}>
        <div className="bcard"><div className="mark-l"><span className="glyph">{n[0].toUpperCase()}</span><span className="wm">{n}</span></div><div><small>{t('Direktor')}</small><div style={{ fontSize: 13, marginTop: 4 }}>salam@{n.toLowerCase().replace(/[^a-z0-9əğıöşüç]/g, '') || 'brend'}.az</div></div></div>
        <div className="appi">{n[0].toUpperCase()}</div>
        <div className="bpost"><i /><b className="wm" style={{ fontSize: 14 }}>{n}</b></div>
      </div>
      <div className="ctrl">
        <div className="fld"><label htmlFor="bn">{t('Brend adı')}</label><input id="bn" value={name} maxLength={16} onChange={(e) => setName(e.target.value)} /></div>
        <div><span className="lbl">{t('Şrift xarakteri')}</span><Tabs label={t('Şrift')} value={font} onChange={setFont} items={[{ v: 'f-wide', l: t('Cəsur') }, { v: 'f-geo', l: t('Müasir') }, { v: 'f-cls', l: t('Klassik') }]} /></div>
      </div>
      <div><span className="label" style={{ display: 'block', marginBottom: 8 }}>{t('Palitra')}</span>
        <div className="sw" role="group" aria-label={t('Palitra')}>
          {PALETTES.map((p, i) => (
            <button key={p.l} aria-pressed={pal === i} aria-label={t(p.l)} onClick={() => { setAuto(false); setPal(i); }}>{p.c.map((c) => <span key={c} style={{ background: c }} />)}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- SMM: telefon + həftəlik plan ---------- */
const SCENES = [['Reels', 'Yeni kolleksiya 15 saniyədə', 'Səs açıq izləyin'], ['Karusel', 'Alarkən 5 səhv', 'Sürüşdürün →'], ['Story', 'Pərdəarxası: bir gün bizimlə', 'Sual verin']];
const DAYS: [string, string, string, number][] = [['B.e', 'Məhsulun 15 saniyədə təqdimatı', 'Reels', 0], ['Ç.a', '5 səhv: alarkən nəyə baxmalı', 'Karusel', 1], ['Çər', 'Komandamızla bir gün', 'Story', 2], ['C.a', 'Müştəri rəyi və nəticə', 'Reels', 0], ['Cümə', 'Həftəsonu təklifi', 'Story', 2]];
export function SmmVisual() {
  const t = useT();
  const [d, setD] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto || reduced()) return;
    const iv = setInterval(() => setD((x) => (x + 1) % DAYS.length), 3000);
    return () => clearInterval(iv);
  }, [auto]);
  const k = DAYS[d][3];
  return (
    <div className="panel" aria-label={t('Telefon maketi və kontent təqvimi')}>
      <div className="pin" style={{ marginBottom: 16 }}><span className="label">{t('Həftəlik kontent planı · nümunə')}</span></div>
      <div className="smm">
        <div className="phone" aria-hidden="true">
          {SCENES.map(([tg, h, p], i) => (
            <div key={i + '-' + (i === k ? d : 'x')} className={`scene sc${i}`} hidden={i !== k}>
              <div className="bars"><i><b /></i><i><b /></i><i><b /></i></div>
              <span className="tag">{t(tg)}</span><strong>{t(h)}</strong><p>{t(p)}</p>
              <div className="side"><i /><i /><i /></div>
            </div>
          ))}
        </div>
        <div className="cal" role="group" aria-label={t('Həftənin günləri')}>
          {DAYS.map(([day, txt, f], i) => (
            <button key={i} className="day" aria-pressed={d === i} onClick={() => { setAuto(false); setD(i); }}><em>{t(day)}</em><b>{t(txt)}</b><span>{t(f)}</span></button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- AI: chatbot demosu + CRM ---------- */
const CONV: ['u' | 'b', string][] = [['u', 'Salam, sayt sifariş etmək istəyirəm. Qiymət nə qədərdir?'], ['b', 'Salam! Kömək edim. Hansı sayt lazımdır: landing, korporativ, yoxsa onlayn mağaza?'], ['u', 'Onlayn mağaza'], ['b', 'Aydındır. Təxmini büdcəniz və əlaqə nömrəniz?'], ['u', '3–5 min manat, +994 50 000 00 00'], ['b', 'Təşəkkürlər! Menecerimiz 24 saat ərzində sizinlə əlaqə saxlayacaq.']];
export function AiVisual() {
  const tr = useT();
  type Msg = { c: 'u' | 'b' | 'typing'; t: string; id: number };
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [done, setDone] = useState(false);
  const [run, setRun] = useState(0);
  useEffect(() => {
    setMsgs([]); setDone(false);
    if (reduced()) { setMsgs(CONV.map(([c, t], i) => ({ c, t, id: i }))); setDone(true); return; }
    const tms: ReturnType<typeof setTimeout>[] = [];
    let t = 300, id = 0;
    CONV.forEach(([c, text]) => {
      if (c === 'b') {
        const tid = ++id;
        tms.push(setTimeout(() => setMsgs((m): Msg[] => [...m, { c: 'typing' as const, t: '', id: tid }].slice(-5)), t));
        tms.push(setTimeout(() => setMsgs((m): Msg[] => [...m.filter((x) => x.id !== tid), { c: 'b' as const, t: text, id: ++id + 1000 }].slice(-5)), t + 900));
        t += 1700;
      } else {
        const mid = ++id;
        tms.push(setTimeout(() => setMsgs((m): Msg[] => [...m, { c: 'u' as const, t: text, id: mid }].slice(-5)), t));
        t += 1100;
      }
    });
    tms.push(setTimeout(() => setDone(true), t + 200));
    tms.push(setTimeout(() => setRun((r) => r + 1), t + 5000));
    return () => tms.forEach(clearTimeout);
  }, [run]);
  return (
    <div className="panel chatw" aria-label={tr('Chatbot və CRM demosu')}>
      <div className="pin"><span className="label">{tr('Chatbot demosu · nümunə')}</span><button className="btn btn-ghost" style={{ padding: '9px 14px', fontSize: 13 }} onClick={() => setRun((r) => r + 1)}>{tr('Yenidən göstər')}</button></div>
      <div className="chat"><div className="chat-hd"><i>B</i><div><b>{tr('Brendiniz · köməkçi')}</b><span>{tr('● onlayn, 24/7')}</span></div></div>
        <div className="msgs" aria-live="polite">
          {msgs.map((m) => m.c === 'typing'
            ? <div key={m.id} className="m b typing"><i /><i /><i /></div>
            : <div key={m.id} className={`m ${m.c}`}>{tr(m.t)}</div>)}
        </div>
      </div>
      <div className={`crm${done ? ' on' : ''}`}>
        <span className="ic"><Icon name="users" strokeWidth={2} /></span>
        <div><b>{done ? tr('Yeni lead · Onlayn mağaza') : tr('CRM gözləyir…')}</b><small>{done ? tr('Büdcə: 3–5 min ₼ · Satış menecerinə təyin edildi') : tr('Müraciət hələ toplanmayıb')}</small></div>
        <em>{done ? tr('CRM-də') : tr('Gözləyir')}</em>
      </div>
    </div>
  );
}

/* ---------- Korporativ email: domen + DNS simulyatoru ---------- */
export function CorpVisual() {
  const t = useT();
  const [p, setP] = useState<'g' | 'm'>('g');
  const [raw, setRaw] = useState('sirketiniz.az');
  const [ok, setOk] = useState(-1); // neçə qeyd yoxlanılıb (-1: başlamayıb)
  const [running, setRunning] = useState(-1);
  const tms = useRef<ReturnType<typeof setTimeout>[]>([]);
  const dom = (() => { const d = raw.trim().toLowerCase().replace(/^@/, '').replace(/[^a-z0-9.-]/g, ''); return d.indexOf('.') > 0 ? d : (d || 'sirketiniz') + '.az'; })();
  const dash = dom.replace(/\./g, '-');
  const rows: [string, React.ReactNode][] = p === 'g' ? [
    ['MX', <>@ → <i>smtp.google.com</i> {t('(prioritet 1)')}</>],
    ['SPF', <>TXT @ → <i>v=spf1 include:_spf.google.com ~all</i></>],
    ['DKIM', <>TXT google._domainkey → <i>v=DKIM1; k=rsa; p=MIIBIjAN…</i></>],
    ['DMARC', <>TXT _dmarc → <i>v=DMARC1; p=quarantine; rua=mailto:dmarc@{dom}</i></>],
  ] : [
    ['MX', <>@ → <i>{dash}.mail.protection.outlook.com</i> {t('(prioritet 0)')}</>],
    ['SPF', <>TXT @ → <i>v=spf1 include:spf.protection.outlook.com -all</i></>],
    ['DKIM', <>CNAME selector1._domainkey → <i>selector1-{dash}._domainkey.…onmicrosoft.com</i></>],
    ['DMARC', <>TXT _dmarc → <i>v=DMARC1; p=quarantine; rua=mailto:dmarc@{dom}</i></>],
  ];
  const reset = () => { tms.current.forEach(clearTimeout); tms.current = []; setOk(-1); setRunning(-1); };
  const check = () => {
    reset();
    if (reduced()) { setOk(4); return; }
    setOk(0);
    [0, 1, 2, 3].forEach((i) => {
      tms.current.push(setTimeout(() => setRunning(i), i * 650));
      tms.current.push(setTimeout(() => { setRunning(-1); setOk(i + 1); }, i * 650 + 600));
    });
  };
  useEffect(() => { const tm = setTimeout(check, 1200); return () => { clearTimeout(tm); tms.current.forEach(clearTimeout); }; }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="panel dom" aria-label={t('Korporativ email qurulmasının nümunəsi')}>
      <div className="dom-top"><span className="label">{t('Qurulma simulyatoru')}</span>
        <div className="seg" role="group" aria-label={t('Platforma')}>
          <button aria-pressed={p === 'g'} onClick={() => { setP('g'); reset(); }}>Google Workspace</button>
          <button aria-pressed={p === 'm'} onClick={() => { setP('m'); reset(); }}>Microsoft 365</button>
        </div></div>
      <div><label htmlFor="domIn">{t('Şirkətinizin domeni')}</label>
        <div className="dom-in"><span>@</span><input id="domIn" value={raw} onChange={(e) => { setRaw(e.target.value); reset(); }} autoComplete="off" spellCheck={false} maxLength={60} /></div></div>
      <div className="addrs">{['info', 'satis', 'ad.soyad', 'destek'].map((a, i) => <span key={a + dom} style={{ animationDelay: `${i * 60}ms` }}>{a}@{dom}</span>)}</div>
      <div className="dns">
        {rows.map(([k, v], i) => (
          <div key={k} className={`dns-row${i < ok ? ' ok' : ''}${running === i ? ' run' : ''}`}><b>{k}</b><code>{v}</code><span className="st"><Check w={3} /></span></div>
        ))}
      </div>
      <div className="dom-foot">
        <span className={`verdict${ok === 4 ? ' ok' : ''}`}>{ok === 4 ? t('Hazırdır: məktublar inbox-a çatacaq.') : t('DNS qeydləri hələ yoxlanılmayıb.')}</span>
        <button className="btn btn-primary" style={{ padding: '12px 18px', fontSize: 14 }} onClick={check}>{t('Qurulmanı göstər')}</button>
      </div>
      <small style={{ color: 'var(--muted)', fontSize: 12.5 }}>{t('Nümunədir: real qeydlər platformanın admin panelindən götürülür.')}</small>
    </div>
  );
}

/* ---------- Email marketinq: avtomatik zəncir ---------- */
type Node = [IconName, string, string, [string, string]?, [string, string]?];
const FLOWS: { l: string; n: Node[] }[] = [
  { l: 'Tərk edilmiş səbət', n: [['trig', 'Trigger', 'Müştəri səbətdə məhsul qoyub çıxdı'], ['clock', 'Gözləmə', '1 saat'], ['envelope', 'Email 1', '“Səbətinizdə məhsul qaldı”'], ['cond', 'Şərt', 'Sifariş tamamlandı?', ['Bəli', 'Təşəkkür və tövsiyələr'], ['Xeyr', '24 saat sonra: pulsuz çatdırılma təklifi']]] },
  { l: 'Xoş gəldin', n: [['trig', 'Trigger', 'Saytda abunə oldu'], ['envelope', 'Email 1 · dərhal', '“Xoş gəldiniz! Hədiyyəniz içəridə”'], ['clock', 'Gözləmə', '2 gün'], ['envelope', 'Email 2', 'Brendin hekayəsi və ən çox satılanlar'], ['cond', 'Şərt', 'İlk alışı etdi?', ['Bəli', 'Sadiqlik proqramına dəvət'], ['Xeyr', 'Xatırlatma: hədiyyə kodunun vaxtı bitir']]] },
  { l: 'Geri qaytarma', n: [['trig', 'Trigger', '90 gündür alış yoxdur'], ['envelope', 'Email 1', '“Sizi darıxdıq”'], ['clock', 'Gözləmə', '5 gün'], ['cond', 'Şərt', 'Kliklədi?', ['Bəli', 'Fərdi məhsul seçimi'], ['Xeyr', 'Son təklif, sonra bazadan təmizləmə']]] },
];
export function EmailVisual() {
  const t = useT();
  const [f, setF] = useState(0);
  const [i, setI] = useState(0);
  const [top, setTop] = useState(14);
  const chain = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setI(0);
    if (reduced()) return;
    const iv = setInterval(() => setI((x) => (x + 1) % FLOWS[f].n.length), 1400);
    return () => clearInterval(iv);
  }, [f]);
  useEffect(() => {
    const el = chain.current?.querySelectorAll<HTMLElement>('.node')[i];
    if (el) setTop(el.offsetTop + el.offsetHeight / 2 - 6);
  }, [i, f]);
  return (
    <div className="panel flow" aria-label={t('Avtomatik email zəncirinin nümunəsi')}>
      <div className="pin"><span className="label">{t('Avtomatik zəncir · nümunə')}</span></div>
      <Tabs label={t('Zəncir növü')} value={f} onChange={setF} items={FLOWS.map((x, k) => ({ v: k, l: t(x.l) }))} />
      <div className="chain" ref={chain}>
        <span className="pulse" aria-hidden="true" style={{ top }} />
        {FLOWS[f].n.map(([ic, s, b, y, n], k) => (
          <div key={f + '-' + k} className={`node${k === i ? ' on' : ''}`}>
            <span className="ic"><Icon name={ic} /></span><small>{t(s)}</small><b>{t(b)}</b>
            {y && n && <div className="branches"><span><b>{t(y[0])}</b>{t(y[1])}</span><span><b>{t(n[0])}</b>{t(n[1])}</span></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
