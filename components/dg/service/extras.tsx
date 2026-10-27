// Hər xidmətə xas əlavə bölmələr (server komponentləri)
import { Check } from '../icons';
import { SecHead, H2, Cards } from '../ui';
import { useServerT } from '@/lib/i18n/server';

const X = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>;

function WebTypes() {
  const t = useServerT();
  const types: [string, string, string, string, number][] = [
    ['Reklam üçün', 'Landing səhifə', 'Bir məhsul və ya kampaniya üçün yüksək konversiyalı tək səhifə.', '2–3 həftə', 25],
    ['Şirkət üçün', 'Korporativ sayt', 'Çoxdilli, sürətli və asan idarə olunan şirkət saytı.', '4–8 həftə', 66],
    ['Satış üçün', 'E-ticarət', 'Məhsul kataloqu, səbət və onlayn ödəniş ilə mağaza.', '6–12 həftə', 100],
  ];
  return (
    <section><div className="wrap">
      <SecHead label={t('Sayt növləri')} title={t('Hədəfə uyğun sayt.')} lead={t('Müddətlər orta göstəricidir. Dəqiq plan ilk görüşdən sonra yazılı təqdim olunur.')} />
      <div className="types">{types.map(([l, h, p, d, w]) => (
        <div className="type rv" key={h}><span className="label">{t(l)}</span><h3>{t(h)}</h3><p>{t(p)}</p>
          <div className="tl"><div className="track"><span className="fill" style={{ left: 0, width: `${w}%` }} /></div><small><span>{t(d)}</span><span>{t('12 həftə')}</span></small></div></div>
      ))}</div>
    </div></section>
  );
}

function SeoLayers() {
  const t = useServerT();
  const l: [string, string, string, string[]][] = [
    ['01 · Texniki', 'Google saytı görsün', 'İndeksləmə, sürət, struktur və schema.', ['Texniki audit', 'Core Web Vitals', 'Sitemap və robots']],
    ['02 · Kontent', 'Google saytı başa düşsün', 'Axtarış niyyətinə əsaslanan semantik xəritə və mətnlər.', ['Açar söz araşdırması', 'On-page optimizasiya', 'Kontent planı']],
    ['03 · Nüfuz', 'Google sayta etibar etsin', 'Keyfiyyətli linklər və lokal görünmə.', ['Link building strategiyası', 'Google Business Profile', 'Xəritədə görünmə']],
  ];
  return (
    <section><div className="wrap">
      <SecHead label={t('SEO-nun 3 qatı')} title={t('Sağlam təməl, güclü məzmun, nüfuz.')} lead={t('İlk texniki irəliləyiş adətən 4–8 həftədə, davamlı üzvi trafik artımı isə 3–6 ay ərzində görünür.')} />
      <div className="layers">{l.map(([lb, h, p, ul], i) => (
        <div className="layer-c rv" key={h}><span className="label" style={i === 2 ? { color: 'inherit', opacity: 0.7 } : undefined}>{t(lb)}</span><h3>{t(h)}</h3><p>{t(p)}</p><ul>{ul.map((x) => <li key={x}>{t(x)}</li>)}</ul></div>
      ))}</div>
    </div></section>
  );
}

function AdsFunnel() {
  const t = useServerT();
  return (
    <section><div className="wrap">
      <SecHead label={t('Kampaniya strukturu')} title={t('Tanışlıqdan alışa qədər.')} lead={t('Hər mərhələyə ayrıca auditoriya, kreativ və büdcə. Pul ən çox nəticə verən mərhələyə axır.')} />
      <div className="funnel">
        <div className="fn rv"><div><h3>{t('Tanıtım')}</h3><span className="label">{t('Reels · Story · Video')}</span></div><p>{t('Sizi hələ tanımayan, amma maraqlanan auditoriyaya brendi göstəririk.')}</p></div>
        <div className="fn rv"><div><h3>{t('Maraq')}</h3><span className="label">{t('Axtarış · Karusel')}</span></div><p>{t('Məhsulu axtaran və müqayisə edən insanlara Google və Meta-da doğru təklif.')}</p></div>
        <div className="fn rv"><div><h3>{t('Satış və remarketinq')}</h3><span className="label">{t('Performance Max · Retargetinq')}</span></div><p>{t('Saytı ziyarət edib almayanlara xatırlatma və son təklif.')}</p></div>
      </div>
      <div className="gloss">
        <div className="rv"><b>ROAS</b><p>{t('Reklama xərclənən hər manatın nə qədər gəlir gətirdiyi.')}</p></div>
        <div className="rv"><b>CPA</b><p>{t('Bir müraciətin və ya satışın reklam xərci.')}</p></div>
        <div className="rv"><b>CTR</b><p>{t('Reklamı görənlərin neçə faizinin kliklədiyi. Kreativin gücünü göstərir.')}</p></div>
      </div>
    </div></section>
  );
}

function BrandBook() {
  const t = useServerT();
  const sq = (s: React.CSSProperties) => <span style={{ borderRadius: 6, ...s }} />;
  return (
    <section><div className="wrap">
      <SecHead label={t('Brend kitabı')} title={t('Bir dəfə qurulur, hər yerdə işləyir.')} lead={t('Nəticə: saytda, sosial mediada və çapda eyni dərəcədə güclü görünən vahid, müasir kimlik.')} />
      <div className="bk">
        <div className="rv"><div className="demo"><span style={{ font: '900 26px var(--f-display)', fontStretch: '125%', letterSpacing: '-.04em' }}>Aa</span>{sq({ width: 26, height: 26, borderRadius: 8, background: 'var(--accent)' })}</div><h3>{t('Loqo sistemi')}</h3><p>{t('Əsas loqo, işarə və müxtəlif ölçülər üçün variantlar.')}</p></div>
        <div className="rv"><div className="demo">{sq({ width: 28, height: 52, background: 'var(--ink)' })}{sq({ width: 28, height: 52, background: 'var(--accent)' })}{sq({ width: 28, height: 52, background: 'var(--surface-2)', border: '1px solid var(--line)' })}</div><h3>{t('Rəng palitrası')}</h3><p>{t('Əsas və köməkçi rənglər, ekran və çap kodları ilə.')}</p></div>
        <div className="rv"><div className="demo"><span style={{ font: 'italic 600 30px var(--f-serif)' }}>Ag</span><span style={{ font: '500 15px var(--f-body)', color: 'var(--muted)' }}>Ag Ag</span></div><h3>{t('Tipoqrafiya')}</h3><p>{t('Başlıq və mətn şriftləri, ölçü şkalası.')}</p></div>
        <div className="rv"><div className="demo">{sq({ width: 40, height: 52, border: '1.5px solid var(--line)' })}{sq({ width: 52, height: 52, border: '1.5px solid var(--line)' })}{sq({ width: 30, height: 52, background: 'var(--accent-soft)' })}</div><h3>{t('Şablonlar')}</h3><p>{t('Post, story, reklam və sənəd şablonları.')}</p></div>
      </div>
    </div></section>
  );
}

function SmmRubrics() {
  const t = useServerT();
  const r: [string, string, string][] = [['40%', 'Faydalı kontent', 'Məsləhət, bələdçi və cavablar. Saxlanılır və paylaşılır.'], ['25%', 'Məhsul və xidmət', 'Təqdimat, istifadə və nəticə. Satışa birbaşa təsir edir.'], ['20%', 'Etibar', 'Rəylər, keyslər və pərdəarxası. Şübhəni azaldır.'], ['15%', 'Trend və əyləncə', 'Reels trendləri ilə yeni auditoriyaya çatmaq.']];
  return (
    <section><div className="wrap">
      <SecHead label={t('Rubrikalar')} title={t('Hər postun bir işi var.')} lead={t('Kontent planı təsadüfi postlardan yox, rubrikalardan qurulur. Nisbətləri biznesinizə görə dəyişirik; aşağıdakı bölgü nümunədir.')} />
      <div className="rub">{r.map(([p, h, d]) => <div className="rv" key={h}><span className="pct">{p}</span><h3>{t(h)}</h3><p>{t(d)}</p></div>)}</div>
    </div></section>
  );
}

function AiUses() {
  const t = useServerT();
  const u: [string, string, string][] = [
    ['Müraciətlər', 'Formadan gələn email-lər əl ilə cədvələ köçürülür, bəziləri itir.', 'Hər müraciət avtomatik CRM-ə düşür və menecerə təyin olunur.'],
    ['Suallar', 'Gecə yazılan WhatsApp mesajları səhərə qədər cavabsız qalır.', 'AI chatbot tez-tez verilən suallara dərhal cavab verir, mürəkkəb halları insana ötürür.'],
    ['Xatırlatmalar', 'Təkliflərə geri dönüş yaddan çıxır.', 'Trigger əsaslı email və mesajlar vaxtında avtomatik gedir.'],
  ];
  return (
    <section><div className="wrap">
      <SecHead label={t('Harada işləyir')} title={t('Rutin işi sistem görür.')} lead={t('Komandanız strateji işə fokuslanır, təkrarlanan tapşırıqları isə sistem yerinə yetirir.')} />
      <div className="uses">{u.map(([h, a, b]) => <div className="use rv" key={h}><h3>{t(h)}</h3><div className="bf"><div><span>{t('Əvvəl')}</span>{t(a)}</div><div><span>{t('Sonra')}</span>{t(b)}</div></div></div>)}</div>
    </div></section>
  );
}

function CorpExtras() {
  const t = useServerT();
  const bad = ['Brend görünmür, saxta hesabla qarışdırmaq asandır.', 'İşçi gedəndə yazışmalar və müştəri kontaktları onunla gedir.', 'Toplu məktublar tez-tez spama düşür.', 'Hesablara mərkəzdən nəzarət yoxdur.'];
  const good = ['Hər məktubda brendiniz görünür.', 'Hesablar şirkətə aiddir: işçi dəyişəndə poçt qutusu qalır.', 'SPF, DKIM və DMARC məktubların çatdırılmasını qoruyur.', 'Ümumi qutular: info@, satis@, destek@.'];
  const plat: [string, string, string, string[]][] = [
    ['Ən populyar seçim', 'Google Workspace', 'Gmail interfeysi, Google Drive, Meet və Təqvim bir hesabda.', ['Gmail-ə öyrəşmiş komandalar üçün', 'Brauzerdə və telefonda rahat iş', 'Sənədlərlə birgə iş']],
    ['Office istifadəçiləri üçün', 'Microsoft 365', 'Outlook, Teams, OneDrive və Word, Excel proqramları ilə tam inteqrasiya.', ['Outlook və Excel ilə işləyən komandalar üçün', 'Teams ilə daxili ünsiyyət', 'Korporativ təhlükəsizlik siyasətləri']],
    ['Kiçik komandalar üçün', 'Hostinq poçtu', 'Sayt hostinqinizə daxil olan poçt xidməti. Bir neçə ünvan üçün sadə və qənaətcil həll.', ['1–5 istifadəçi üçün', 'Webmail və telefon tətbiqləri', 'Sonradan böyük platformaya keçid mümkündür']],
  ];
  return (
    <>
      <section><div className="wrap">
        <SecHead label={t('Niyə korporativ email')} title={t('Ünvanınız ilk təəssüratdır.')} lead={t('Müştəri məktubu açmamışdan əvvəl ünvana baxır. Pulsuz poçt qutusu kiçik və etibarsız görünür, öz domeniniz isə ciddi şirkət kimi.')} />
        <div className="compare">
          <div className="bad"><span className="label">{t('Pulsuz poçt')}</span><div className="addr">sirket.baki@gmail.com</div><ul>{bad.map((b) => <li key={b}><X /><span>{t(b)}</span></li>)}</ul></div>
          <div className="good"><span className="label" style={{ color: 'inherit', opacity: 0.7 }}>{t('Korporativ email')}</span><div className="addr">info@sirketiniz.az</div><ul>{good.map((b) => <li key={b}><Check /><span>{t(b)}</span></li>)}</ul></div>
        </div>
      </div></section>
      <section><div className="wrap">
        <SecHead label={t('Platformalar')} title={t('Ehtiyacınıza uyğun həll.')} lead={t('Platformanı komandanızın ölçüsünə, istifadə etdiyiniz proqramlara və büdcənizə görə birlikdə seçirik.')} />
        <div className="plat">{plat.map(([tg, h, p, ul]) => <div className="rv" key={h}><span className="tag">{t(tg)}</span><h3>{t(h)}</h3><p>{t(p)}</p><ul>{ul.map((x) => <li key={x}>{t(x)}</li>)}</ul></div>)}</div>
      </div></section>
    </>
  );
}

function EmailExtras() {
  const t = useServerT();
  const rows: [string, string, string][] = [['Səbətinizdə 2 məhsul qaldı', 'Sifarişi bu gün tamamlayın, çatdırılma pulsuzdur.', '10:24'], ['Xoş gəldiniz! İlk sifarişə hədiyyəniz içəridə', 'Brendimizlə tanış olun və ilk alışınızda…', 'Dünən'], ['Sizin üçün seçdiklərimiz', 'Son baxdığınız məhsullara oxşar yeniliklər.', 'Bazar'], ['Sizi darıxdıq, qayıdın', 'Növbəti sifarişinizə xüsusi təklif hazırladıq.', '12 okt']];
  return (
    <>
      <section><div className="wrap">
        <SecHead label={t('Nə göndəririk')} title={t('Doğru məktub, doğru anda.')} lead={t('Hər məktubun bir məqsədi var: ilk alış, təkrar alış və ya itən müştərini geri qaytarmaq.')} />
        <Cards items={[
          { icon: 'home', h: 'Xoş gəldin zənciri', p: 'Yeni abunəçiyə brendi tanıdan və ilk alışa yönləndirən 3–5 məktub.' },
          { icon: 'cart', h: 'Tərk edilmiş səbət', p: 'Səbətdə məhsul qoyub çıxan müştəriyə vaxtında xatırlatma.' },
          { icon: 'news', h: 'Bülleten və kampaniyalar', p: 'Yeniliklər, endirimlər və faydalı kontent. Seqmentə görə fərqli məzmun.' },
          { icon: 'gift', h: 'Sadiqlik və doğum günü', p: 'Daimi müştərilərə xüsusi təkliflər, ad günü təbriki və bonuslar.' },
          { icon: 'refresh', h: 'Geri qaytarma', p: 'Uzun müddət alış etməyən müştəriləri yenidən aktivləşdirən zəncir.' },
          { icon: 'check', h: 'Tranzaksiya məktubları', p: 'Sifariş təsdiqi, çatdırılma statusu və faktura. Brendinizə uyğun dizaynla.' },
        ]} />
      </div></section>
      <section><div className="wrap duo">
        <div><div className="label">{t('Mövzu sətri işi')}</div><H2 className="mid" style={{ marginTop: 18 }}>{t('Açılmayan məktub satmır.')}</H2>
          <p className="lead" style={{ marginTop: 18 }}>{t('Mövzu sətrini, göndərmə vaxtını və dizaynı A/B testlərlə yoxlayır, ən yaxşı işləyən variantı bazanın qalanına göndəririk.')}</p></div>
        <div className="inbox rv" aria-label={t('Nümunə mövzu sətirləri')}>{rows.map(([b, s, tm]) => <div className="mail-row" key={b}><span className="av">B</span><div><b>{t(b)}</b><span>{t(s)}</span></div><em>{t(tm)}</em></div>)}</div>
      </div></section>
      <section><div className="wrap">
        <SecHead label={t('Ölçmə')} title={t('Hər kampaniya rəqəmlə.')} lead={t('Aylıq hesabatda dörd əsas göstəricini və onların satışa təsirini görürsünüz.')} />
        <div className="metrics">
          {[['Açılma faizi', 'Mövzu sətrinin və göndərən adının nə qədər işlədiyini göstərir.'], ['Klik faizi', 'Məzmunun və düymələrin oxucunu sayta apara bildiyini göstərir.'], ['Konversiya', 'Məktubdan gələn sifariş və müraciətlər. GA4 ilə izlənir.'], ['Abunəlikdən çıxma', 'Göndərmə tezliyinin və məzmunun bazaya uyğunluğunu göstərir.']].map(([h, p], i) => (
            <div className="rv" key={h}><span className="label">0{i + 1}</span><strong>{t(h)}</strong><p>{t(p)}</p></div>
          ))}
        </div>
      </div></section>
    </>
  );
}

export const EXTRAS: Record<string, () => React.ReactNode> = {
  'veb-saytlar': WebTypes,
  seo: SeoLayers,
  reklam: AdsFunnel,
  brendinq: BrandBook,
  smm: SmmRubrics,
  'ai-avtomatlasdirma': AiUses,
  'korporativ-email': CorpExtras,
  'email-marketinq': EmailExtras,
};
