import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { pageMeta } from '@/lib/catalog/meta';
import { readCatalog } from '@/lib/catalog/store';
import { requestOrigin } from '@/lib/catalog/origin';
import { publicProducts } from '@/lib/catalog/query';
import { pick, isLocale, type Locale } from '@/lib/catalog/types';
import { ProductCard } from '@/components/catalog/product-card';
import { JsonLd } from '@/components/catalog/jsonld';
import { adviceMessage, whatsappLink } from '@/lib/catalog/whatsapp';
import { publicSiteUrl } from '@/lib/catalog/origin';

const H1: Record<Locale, string> = {
  az: 'Dam, fasad və təməl üçün izolyasiya materialları',
  en: 'Insulation materials for roofs, facades, and foundations',
  ru: 'Изоляционные материалы для кровли, фасада и фундамента',
};

const AREAS = ['dam', 'fasad', 'temel', 'doseme', 'daxili'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : 'az';
  return pageMeta(loc, '/', H1[loc], 'SOCHİ MMC — istilik, su və səs izolyasiya materialları.');
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const areas = await getTranslations('areas');
  const services = await getTranslations('services');
  const contact = await getTranslations('contact');
  const catalog = readCatalog();
  const origin = await requestOrigin();
  const featured = publicProducts(catalog).filter((product) => product.featured);
  const advice = whatsappLink(catalog.settings.whatsappE164, adviceMessage(locale));
  return (
    <div className="space-y-14">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'SOCHİ MMC',
          url: publicSiteUrl(),
          email: catalog.settings.email,
          telephone: `+${catalog.settings.phoneE164}`,
          address: { '@type': 'PostalAddress', addressLocality: pick(catalog.settings.city, locale), addressCountry: 'AZ' },
        }}
      />
      <section className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-[#1C1F24] sm:text-5xl">{H1[locale]}</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#374151]">{t('lead')}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/kataloq" className="inline-flex h-12 items-center justify-center rounded-full bg-[#0A286E] px-6 font-semibold text-white">
              {t('ctaCatalog')}
            </Link>
            {advice ? (
              <a href={advice} className="inline-flex h-12 items-center justify-center rounded-full bg-[#1FA855] px-6 font-semibold text-white">
                {t('ctaWa')}
              </a>
            ) : (
              <p className="text-sm text-[#6B7280]">{t('waInvalid')}</p>
            )}
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#E4E7EB] bg-white">
          <Image src="/media/products/TexnonikolCarbonECO.webp" alt="Texnonikol Carbon ECO" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-contain" priority />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">{t('categories')}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {catalog.categories.map((category) => (
            <Link key={category.id} href={`/kataloq/${category.id}`} className="rounded-2xl border border-[#E4E7EB] bg-white p-4 hover:border-[#0A286E]">
              <h3 className="font-semibold text-[#0A286E]">{pick(category.name, locale)}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-[#4B5563]">{pick(category.summary, locale)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">{t('featured')}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variants={product.variants.filter((variant) => variant.status === 'published')}
              origin={origin}
              whatsappE164={catalog.settings.whatsappE164}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">{t('areas')}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {AREAS.map((area) => (
            <Link key={area} href={`/kataloq?sahe=${area}`} className="inline-flex h-12 items-center rounded-full border border-[#D5DAE1] bg-white px-5 font-medium">
              {areas(area)}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold">{t('services')}</h2>
          <Link href="/xidmetler" className="text-sm font-medium text-[#0A286E] underline">{services('more')}</Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {catalog.pages.services.map((group) => (
            <article key={group.id} className="rounded-2xl border border-[#E4E7EB] bg-white p-4">
              <h3 className="font-semibold">{pick(group.title, locale)}</h3>
              <p className="mt-2 text-sm leading-6 text-[#374151]">{pick(group.description, locale)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-[#0A286E] px-6 py-8 text-white">
        <h2 className="text-2xl font-semibold">{t('contact')}</h2>
        <p className="mt-2 max-w-xl text-sm text-white/80">{contact('lead')}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <a className="underline" href={`tel:+${catalog.settings.phoneE164}`}>{catalog.settings.phoneDisplay}</a>
          <a className="underline" href={`mailto:${catalog.settings.email}`}>{catalog.settings.email}</a>
          <Link href="/contact" className="underline">{contact('title')}</Link>
        </div>
      </section>
    </div>
  );
}
