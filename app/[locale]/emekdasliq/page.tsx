import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { PageHero, SecHead, CtaBand, Steps } from '@/components/dg/ui';
import { Arrow, Check } from '@/components/dg/icons';
import { alternates, localePath } from '@/lib/seo';
import { getT, OG_LOCALE } from '@/lib/i18n/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  const title = t('Əməkdaşlıq və qiymət — necə işləyirik');
  const description = t('Layihə əsaslı işlər, aylıq xidmətlər və dəstək: qiymətin necə formalaşdığı, təklifdə nələrin göstərildiyi və iş prosesi.');
  return {
    title, description, alternates: alternates('/emekdasliq', locale),
    openGraph: { title, description, url: localePath('/emekdasliq', locale), locale: OG_LOCALE[locale], type: 'website' },
  };
}

const MODELS = [
  { h: 'Layihə', for: 'Sayt, brendinq, mağaza', p: 'Həcmi və müddəti əvvəlcədən bəlli olan işlər. Mərhələlər, təhvil verilənlər və ödəniş cədvəli təklifdə yazılır.', items: ['Yazılı mərhələli plan', 'Hər mərhələdə təsdiq', 'Təhvildən sonra dəstək dövrü'] },
  { h: 'Aylıq xidmət', for: 'SEO, reklam, SMM, email', p: 'Davamlı nəticə tələb edən işlər. Aylıq iş həcmi və hesabat formatı əvvəlcədən razılaşdırılır.', items: ['Aylıq plan və hesabat', 'Reklam büdcəsi ayrıca göstərilir', 'Nəticəyə görə strategiya yenilənir'] },
  { h: 'Dəstək', for: 'Mövcud sayt və sistemlər', p: 'Texniki xidmət, kontent yeniləmələri, təhlükəsizlik və performans izləməsi üçün aylıq dəstək paketləri.', items: ['Yeniləmələr və ehtiyat nüsxə', 'Kontent dəyişiklikləri', 'Performans izləməsi'] },
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = getT(locale);
  return (
    <>
      <PageHero crumbs={[{ href: '/', label: t('Ana səhifə') }, { label: t('Əməkdaşlıq') }]} h1={<>{t('Şəffaf')} <em>{t('əməkdaşlıq.')}</em></>}
        lead={t('Qiymət layihənin həcminə, funksiyalarına və müddətinə görə hesablanır. Təklifdə bütün mərhələlər və xərclər ayrıca göstərilir, gizli ödəniş yoxdur.')}>
        <Link className="btn btn-accent" href="/elaqe">{t('Təklif istəyirəm')} <Arrow /></Link>
      </PageHero>
      <section>
        <div className="wrap">
          <SecHead label={t('Əməkdaşlıq modelləri')} title={t('İşin növünə uyğun format.')} />
          <div className="models">
            {MODELS.map((m) => (
              <div key={m.h} className="model rv">
                <span className="label">{t(m.for)}</span>
                <h3>{t(m.h)}</h3>
                <p>{t(m.p)}</p>
                <ul>{m.items.map((x) => <li key={x}><Check />{t(x)}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="wrap">
          <SecHead label={t('Qiymətə nə təsir edir')} title={t('Təklifi formalaşdıran amillər.')} lead={t('Dəqiq qiymət 30 dəqiqəlik tanışlıq görüşündən sonra, 2–3 iş günü ərzində yazılı təklifdə göndərilir.')} />
          <div className="factors">
            {[['Həcm', 'Səhifə sayı, kampaniya sayı, aylıq kontent miqdarı.'], ['Funksionallıq', 'Onlayn ödəniş, çoxdillilik, CRM və digər inteqrasiyalar.'], ['Müddət', 'Təcili təhvil əlavə resurs tələb edir.'], ['Məzmun', 'Mətn, foto və video kimdən gəlir: sizdən və ya bizdən.']].map(([h, p]) => (
              <div key={h} className="rv"><h3>{t(h)}</h3><p>{t(p)}</p></div>
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="wrap">
          <SecHead label={t('Proses')} title={t('Müraciətdən təklifə.')} />
          <Steps steps={([['Müraciət', 'Formu doldurursunuz və ya zəng edirsiniz. 24 saat ərzində cavab veririk.'], ['Tanışlıq görüşü', '30 dəqiqədə hədəfləri, auditoriyanı və imkanları müzakirə edirik.'], ['Yazılı təklif', '2–3 iş günündə mərhələli plan və şəffaf qiymət göndəririk.'], ['Başlanğıc', 'Razılaşmadan sonra iş planı və təqvimlə başlayırıq.']] as [string, string][]).map(([h, p]) => [t(h), t(p)] as [string, string])} />
        </div>
      </section>
      <CtaBand title={t('Layihəniz üçün təklif alın.')} text={t('Hədəflərinizi danışaq, yazılı plan və şəffaf qiymət göndərək.')} />
    </>
  );
}
