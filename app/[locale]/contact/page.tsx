import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMeta } from '@/lib/catalog/meta';
import { readCatalog } from '@/lib/catalog/store';
import { pick, isLocale } from '@/lib/catalog/types';
import { adviceMessage, whatsappLink } from '@/lib/catalog/whatsapp';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const title = locale === 'en' ? 'Contact' : locale === 'ru' ? 'Контакты' : 'Əlaqə';
  return pageMeta(locale, '/contact', title, 'SOCHİ MMC əlaqə: telefon, e-poçt, WhatsApp.');
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  const foot = await getTranslations('footer');
  const settings = readCatalog().settings;
  const advice = whatsappLink(settings.whatsappE164, adviceMessage(locale));
  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-semibold">{t('title')}</h1>
      <p className="mt-3 text-sm leading-6">{t('lead')}</p>
      <dl className="mt-6 space-y-4 rounded-2xl border border-[#E4E7EB] bg-white p-5 text-sm">
        <div>
          <dt className="font-medium">{t('city')}</dt>
          <dd>{pick(settings.city, locale)}</dd>
          <dd className="text-[#6B7280]">{settings.addressLine || foot('addressUnknown')}</dd>
        </div>
        <div>
          <dt className="font-medium">{t('phone')}</dt>
          <dd><a className="underline" href={`tel:+${settings.phoneE164}`}>{settings.phoneDisplay}</a></dd>
        </div>
        <div>
          <dt className="font-medium">{t('email')}</dt>
          <dd><a className="underline" href={`mailto:${settings.email}`}>{settings.email}</a></dd>
        </div>
        <div>
          <dt className="font-medium">{t('whatsapp')}</dt>
          <dd>{settings.whatsappDisplay}</dd>
          {!settings.whatsappConfirmed && <dd className="text-xs text-[#6B7280]">{foot('waUnconfirmed')}</dd>}
          {advice ? (
            <dd className="mt-2">
              <a href={advice} className="inline-flex h-11 items-center rounded-full bg-[#1FA855] px-4 font-semibold text-white">{t('whatsapp')}</a>
            </dd>
          ) : (
            <dd className="text-[#6B7280]">{foot('waInvalid')}</dd>
          )}
        </div>
      </dl>
    </div>
  );
}
