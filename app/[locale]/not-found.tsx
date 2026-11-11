import { Link } from '@/i18n/navigation';

export default function NotFound() {
  return (
    <div className="py-16">
      <h1 className="text-3xl font-semibold">Səhifə tapılmadı</h1>
      <p className="mt-3 text-sm text-[#4B5563]">Ünvan köhnəlibsə, kataloqdan davam edin.</p>
      <Link href="/kataloq" className="mt-6 inline-flex h-12 items-center rounded-full bg-[#0A286E] px-5 font-semibold text-white">
        Kataloqa bax
      </Link>
    </div>
  );
}
