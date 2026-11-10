import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { adviceMessage, whatsappLink } from '@/lib/catalog/whatsapp';
import type { Locale, Settings } from '@/lib/catalog/types';

export function Footer({ settings, locale }: { settings: Settings; locale: Locale }) {
  const t = useTranslations('footer');
  const advice = whatsappLink(settings.whatsappE164, adviceMessage(locale));
  return (
    <footer className="mt-16 border-t border-[#E4E7EB] bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="font-semibold text-[#0A286E]">SOCHİ MMC</p>
          <p className="mt-2 text-sm text-[#4B5563]">{t('blurb')}</p>
        </div>
        <div className="text-sm">
          <p className="font-medium text-[#1C1F24]">{t('contact')}</p>
          <p className="mt-2">{settings.city[locale]}</p>
          {settings.addressLine ? <p>{settings.addressLine}</p> : <p className="text-[#6B7280]">{t('addressUnknown')}</p>}
          <p className="mt-2">
            <a className="underline" href={`tel:+${settings.phoneE164}`}>{settings.phoneDisplay}</a>
          </p>
          <p>
            <a className="underline" href={`mailto:${settings.email}`}>{settings.email}</a>
          </p>
          <p className="mt-2">{settings.whatsappDisplay}</p>
          {!settings.whatsappConfirmed && <p className="mt-1 text-xs text-[#6B7280]">{t('waUnconfirmed')}</p>}
        </div>
        <div className="flex flex-col items-start gap-3 text-sm">
          <Link href="/kataloq">{t('catalog')}</Link>
          <Link href="/xidmetler">{t('services')}</Link>
          <Link href="/sifaris">{t('order')}</Link>
          {advice ? (
            <a href={advice} className="inline-flex h-11 items-center rounded-full bg-[#1FA855] px-4 font-medium text-white">
              {t('advice')}
            </a>
          ) : (
            <p className="text-[#6B7280]">{t('waInvalid')}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
