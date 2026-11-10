import Link from 'next/link';
import { readCatalog } from '@/lib/catalog/store';

export default function AdminHome() {
  const catalog = readCatalog();
  const published = catalog.products.filter((product) => product.status === 'published').length;
  return (
    <div>
      <h1 className="text-2xl font-semibold">Kataloq</h1>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        <li className="rounded-2xl border border-[#E4E7EB] bg-white p-4">Məhsul: {catalog.products.length}</li>
        <li className="rounded-2xl border border-[#E4E7EB] bg-white p-4">Dərc olunub: {published}</li>
        <li className="rounded-2xl border border-[#E4E7EB] bg-white p-4">
          WhatsApp: {catalog.settings.whatsappDisplay}
          {!catalog.settings.whatsappConfirmed && <span className="mt-1 block text-xs text-amber-800">Dərcdən əvvəl təsdiqlənməlidir</span>}
        </li>
      </ul>
      <p className="mt-4 text-sm">
        <Link className="underline" href="/admin/products">Məhsulları redaktə et</Link>
      </p>
    </div>
  );
}
