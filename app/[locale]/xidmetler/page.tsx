import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMeta } from '@/lib/catalog/meta';
import { readCatalog } from '@/lib/catalog/store';
import { pick, isLocale } from '@/lib/catalog/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const title = locale === 'en' ? 'Services' : locale === 'ru' ? 'Услуги' : 'Xidmətlər';
  return pageMeta(locale, '/xidmetler', title, 'SOCHİ MMC quraşdırma partnyorluğu və texniki məsləhət.');
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  setRequestLocale(locale);
  const t = await getTranslations('services');
  const groups = readCatalog().pages.services;
  return (
    <div>
      <h1 className="text-3xl font-semibold">{t('title')}</h1>
      <div className="mt-8 space-y-10">
        {groups.map((group) => (
          <section key={group.id} id={group.id}>
            <h2 className="text-2xl font-semibold text-[#0A286E]">{pick(group.title, locale)}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6">{pick(group.description, locale)}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {group.items.map((item) => (
                <article key={item.id} className="rounded-2xl border border-[#E4E7EB] bg-white p-4">
                  <h3 className="font-semibold">{pick(item.title, locale)}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#374151]">{pick(item.description, locale)}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
