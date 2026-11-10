import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMeta } from '@/lib/catalog/meta';
import { readCatalog } from '@/lib/catalog/store';
import { pick, isLocale } from '@/lib/catalog/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const about = readCatalog().pages.about;
  const loc = isLocale(locale) ? locale : 'az';
  return pageMeta(loc, '/about', pick(about.title, loc), pick(about.lead, loc).slice(0, 180));
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const about = readCatalog().pages.about;
  return (
    <article className="max-w-3xl">
      <p className="text-sm font-medium text-[#0A286E]">{t('title')}</p>
      <h1 className="mt-2 text-3xl font-semibold">{pick(about.title, locale)}</h1>
      <p className="mt-4 text-base leading-7">{pick(about.lead, locale)}</p>
      <p className="mt-4 text-base leading-7">{pick(about.why, locale)}</p>
      <p className="mt-6 text-sm text-[#4B5563]">
        {locale === 'en'
          ? 'SOCHİ MMC publishes itself as a seller of TECHNONICOL insulation systems in Baku. Prices, stock, and certificates still need confirmation in this catalog.'
          : locale === 'ru'
            ? 'SOCHİ MMC публикует себя как продавца изоляционных систем ТЕХНОНИКОЛЬ в Баку. Цены, остатки и сертификаты в этом каталоге ещё нужно подтвердить.'
            : 'SOCHİ MMC özünü Bakıda ТЕХНОНИКОЛЬ izolyasiya sistemlərinin satıcısı kimi təqdim edir. Qiymət, stok və sertifikatlar bu kataloqda hələ təsdiq tələb edir.'}
      </p>
    </article>
  );
}
