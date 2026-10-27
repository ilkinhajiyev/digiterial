import { Link } from '@/i18n/navigation';
import { services, HOME_ORDER } from '@/lib/content/services';
import { posts, formatDate } from '@/lib/content/blog';
import { SHOTS, type PItem } from '@/lib/data/portfolio';
import { Laptop, Phone } from '../devices';
import type { SiteSettings } from '@/lib/data/settings';
import { Arrow, Icon } from '../icons';
import { SecHead, Steps, H2 } from '../ui';
import ContactForm from '../contact-form';
import { useServerT, useLocalize } from '@/lib/i18n/server';
import { useLocale } from 'next-intl';

export const PROCESS: [string, string][] = [
  ['Tanışlıq və təhlil', 'Biznesinizi, saytınızı, reklamlarınızı və rəqiblərinizi təhlil edib əsas böyümə imkanlarını tapırıq.'],
  ['Strategiya və plan', 'Hədəflər, KPI-lar, büdcə və mərhələli iş planı. Yazılı və aydın.'],
  ['Dizayn və icra', 'Sayt, kampaniya və kontent qısa sprintlərlə hazırlanır, hər mərhələni siz təsdiqləyirsiniz.'],
  ['Ölçmə və böyümə', 'Yayımdan sonra data əsasında test edir, optimallaşdırır və nəticəni artırırıq.'],
];

export function ServicesSection() {
  const t = useServerT();
  const L = useLocalize();
  const list = L(HOME_ORDER.map((s) => services.find((x) => x.slug === s)!).filter(Boolean));
  return (
    <section id="xidmetler">
      <div className="wrap">
        <SecHead label={t('Xidmətlər')} title={t('Böyümək üçün lazım olan hər şey.')} lead={t('Hazır paket yox. Auditoriyanızı, rəqiblərinizi və satış yolunuzu təhlil edir, büdcəni ən çox nəticə verən kanallara yönəldirik.')} />
        <ul className="svc">
          {list.map((s) => (
            <li key={s.slug}>
              <Link href={`/xidmetler/${s.slug}`}>
                <h3>{s.title}{s.isNew && <em className="new">{t('Yeni')}</em>}</h3>
                <p>{s.homeDesc}</p>
                <div className="chips">{s.chips.map((c) => <span key={c}>{c}</span>)}</div>
                <span className="arrow"><Arrow /></span>
                <span className="svc-ic" hidden><Icon name={s.icon} /></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function WorkSection({ items: raw }: { items: PItem[] }) {
  const t = useServerT();
  const L = useLocalize();
  const items = L(raw);
  const main = items[0];
  const shot = main ? SHOTS[main.slug || ''] : undefined;
  return (
    <section id="isler" className="rwork">
      <div className="wrap">
        <SecHead label={t('Seçilmiş iş')} title={t('Sözlə yox, nəticə ilə.')} lead={t('Hər layihədə məqsədi, həlli və nəticəni açıq göstəririk. Görüntülər real saytlardandır.')} />
        {main && (
          <Link className="rcase" href={`/isler/${main.slug || main.id}`}>
            <div className="rcase-media">
              {shot ? (
                <>
                  <Laptop src={shot.desktop} alt={t('{name} saytı', { name: main.client || main.title })} scroll={shot.full} />
                  {shot.mobile && <Phone src={shot.mobile} alt={t('{name} mobil versiyası', { name: main.client || main.title })} />}
                </>
              ) : main.image_url ? <img src={main.image_url} alt={main.title} loading="lazy" className="rcase-img" /> : null}
            </div>
            <div className="rcase-meta">
              <div className="tags">{(main.tags || '').split(',').filter(Boolean).map((tg) => <span key={tg}>{t(tg.trim())}</span>)}</div>
              <h3>{main.title}</h3>
              {main.description && <p>{main.description}</p>}
              <span className="rcase-more">{t('Layihəyə bax')} <Arrow /></span>
            </div>
          </Link>
        )}
        {items.length > 1 && (
          <div className="rgrid">
            {items.slice(1, 5).map((it) => {
              const sh = SHOTS[it.slug || ''];
              return (
                <Link key={it.id} className="rmini" href={`/isler/${it.slug || it.id}`}>
                  <span className="rmini-img">{(sh?.desktop || it.image_url) && <img src={sh?.desktop || it.image_url} alt={t('{name} saytı', { name: it.client || it.title })} loading="lazy" />}</span>
                  <span className="label">{t((it.tags || 'Veb sayt').split(',')[0].trim())}</span>
                  <h3>{it.client || it.title}</h3>
                  <p>{it.description}</p>
                </Link>
              );
            })}
          </div>
        )}
        <div className="rnext">
          <p>{t('Növbəti uğur hekayəsi')} <em>{t('sizin')}</em> {t('olsun.')}</p>
          <span style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><Link className="btn btn-ghost" href="/isler">{t('Bütün işlər')} <Arrow /></Link><Link className="btn btn-accent" href="/elaqe">{t('Hədəfinizi bölüşün')} <Arrow /></Link></span>
        </div>
      </div>
    </section>
  );
}

export function ProcessSection() {
  const t = useServerT();
  return (
    <section id="proses">
      <div className="wrap">
        <SecHead label={t('İş prosesi')} title={t('Tanışlıqdan nəticəyə 4 addımda.')} lead={t('Hər mərhələnin sonunda nə əldə etdiyinizi bilirsiniz. Gizli xərc və qeyri-müəyyən müddət yoxdur.')} />
        <Steps steps={PROCESS} />
      </div>
    </section>
  );
}

export function StackSection() {
  const t = useServerT();
  return (
    <section>
      <div className="wrap split">
        <div>
          <div className="label">{t('Texnologiyalar və kanallar')}</div>
          <H2 className="mid" style={{ marginTop: 18 }}>{t('Doğru alət, doğru iş üçün.')}</H2>
          <p className="lead" style={{ marginTop: 18 }}>{t('Texnologiyanı trendə görə yox, nəticəyə görə seçirik.')}</p>
          <div className="stack">{['Next.js', 'WordPress', 'WooCommerce', 'Figma', 'Google Ads', 'Meta Ads', 'GA4 və GTM', 'Search Console'].map((x) => <span key={x}>{t(x)}</span>)}</div>
        </div>
        <div>
          <div className="label">{t('Prinsiplərimiz')}</div>
          <H2 className="mid" style={{ marginTop: 18 }}>{t('Şəffaflıq əməkdaşlığın əsasıdır.')}</H2>
          <div className="principles">
            <div><h3>{t('Açıq qiymət')}</h3><p>{t('Təklifdə hər mərhələ və xərc ayrıca göstərilir. Sürpriz hesab olmur.')}</p></div>
            <div><h3>{t('Real hesabat')}</h3><p>{t('Bəyənmə sayı yox: müraciət, satış və xərc göstəriciləri.')}</p></div>
            <div><h3>{t('Uzunmüddətli dəstək')}</h3><p>{t('Yayımdan sonra da yanınızdayıq: texniki dəstək, yeniləmə və böyümə.')}</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PostCard({ p: raw }: { p: (typeof posts)[number] }) {
  const locale = useLocale();
  const L = useLocalize();
  const p = L(raw);
  return (
    <Link className="post" href={`/bloq/${p.slug}`}>
      <div className="tag"><b>{p.category}</b><span className="label">{formatDate(p.date, locale)}</span></div>
      <h3>{p.title}</h3>
      <p>{p.description}</p>
    </Link>
  );
}

export function BlogSection() {
  const t = useServerT();
  return (
    <section id="bloq">
      <div className="wrap">
        <SecHead label={t('Bloq')} title={t('Rəqəmsal marketinq, praktik dildə.')} lead={t('SEO, reklam və veb dizayn haqqında tətbiq edə biləcəyiniz addımlar.')} />
        <div className="posts">{posts.slice(0, 3).map((p) => <PostCard key={p.slug} p={p} />)}</div>
      </div>
    </section>
  );
}

export function ContactSection({ st, preset }: { st: SiteSettings; preset?: string }) {
  const t = useServerT();
  return (
    <section className="contact" id="elaqe">
      <div className="wrap contact-grid">
        <div>
          <div className="label">{t('Əlaqə')}</div>
          <H2 style={{ marginTop: 18 }}>{t('Növbəti layihəniz nədir?')}</H2>
          <p className="lead" style={{ marginTop: 24 }}>{t('Formu doldurun, 24 saat ərzində sizinlə əlaqə saxlayaq.')}</p>
          <ol className="next">
            <li>{t('24 saat ərzində sizə zəng edir və ya yazırıq.')}</li>
            <li>{t('30 dəqiqəlik görüşdə hədəfləri və imkanları müzakirə edirik.')}</li>
            <li>{t('2–3 iş günü ərzində yazılı plan və şəffaf qiymət təklifi göndəririk.')}</li>
          </ol>
          <div className="cinfo">
            <div><span className="label">{t('Email')}</span><strong><a href={`mailto:${st.email}`}>{st.email}</a></strong></div>
            <div><span className="label">{t('Telefon')}</span><strong><a href={`tel:${st.phone.replace(/\s/g, '')}`}>{st.phone}</a></strong></div>
            {st.whatsapp && <div><span className="label">WhatsApp</span><strong><a href={`https://wa.me/${st.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">{t('WhatsApp-da yazın')}</a></strong></div>}
            <div><span className="label">{t('İş saatları')}</span><strong>{t('B.e – Cümə · 10:00–18:00')}</strong></div>
          </div>
        </div>
        <ContactForm preset={preset} />
      </div>
    </section>
  );
}
