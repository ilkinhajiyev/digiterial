import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMeta } from '@/lib/catalog/meta';
import { readCatalog } from '@/lib/catalog/store';
import { pick, isLocale } from '@/lib/catalog/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const title = locale === 'en' ? 'Certificates' : locale === 'ru' ? 'Сертификаты' : 'Sertifikatlar';
  return pageMeta(locale, '/sertifikatlar', title, 'SOCHİ MMC sertifikat şəkilləri.');
}

export default async function CertificatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  setRequestLocale(locale);
  const t = await getTranslations('certs');
  const items = readCatalog().pages.certificates;
  return (
    <div>
      <h1 className="text-3xl font-semibold">{t('title')}</h1>
      <p className="mt-3 max-w-2xl text-sm text-[#4B5563]">{t('note')}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-2xl border border-[#E4E7EB] bg-white">
            <div className="relative aspect-[4/3] bg-[#F4F5F7]">
              <Image src={item.image} alt={pick(item.title, locale)} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-contain" />
            </div>
            <div className="p-4">
              <h2 className="font-semibold">{pick(item.title, locale)}</h2>
              <p className="mt-2 text-sm leading-6 text-[#374151]">{pick(item.description, locale)}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
