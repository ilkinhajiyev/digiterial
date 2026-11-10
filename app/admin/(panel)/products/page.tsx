import Link from 'next/link';
import { createProduct } from '@/lib/catalog/actions';
import { readCatalog } from '@/lib/catalog/store';

export default function ProductsPage() {
  const catalog = readCatalog();
  return (
    <div>
      <h1 className="text-2xl font-semibold">Məhsullar</h1>
      <form action={createProduct} className="mt-4 grid gap-2 rounded-2xl border border-[#E4E7EB] bg-white p-4 md:grid-cols-4">
        <input name="name_az" required placeholder="Ad (AZ)" className="h-11 rounded-lg border border-[#D5DAE1] px-2" />
        <input name="name_en" placeholder="Name (EN)" className="h-11 rounded-lg border border-[#D5DAE1] px-2" />
        <input name="name_ru" placeholder="Название (RU)" className="h-11 rounded-lg border border-[#D5DAE1] px-2" />
        <input name="slug" required placeholder="slug" className="h-11 rounded-lg border border-[#D5DAE1] px-2" />
        <input name="family" placeholder="Ailə" className="h-11 rounded-lg border border-[#D5DAE1] px-2" />
        <select name="categoryId" className="h-11 rounded-lg border border-[#D5DAE1] px-2">
          {catalog.categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name.az}</option>
          ))}
        </select>
        <button className="h-11 rounded-full bg-[#0A286E] px-4 text-sm font-semibold text-white">Qaralama yarat</button>
      </form>
      <ul className="mt-6 divide-y divide-[#E4E7EB] rounded-2xl border border-[#E4E7EB] bg-white">
        {catalog.products.map((product) => (
          <li key={product.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
            <div>
              <Link href={`/admin/products/${product.id}`} className="font-medium underline">{product.name.az}</Link>
              <p className="text-[#6B7280]">{product.status} · {product.variants.length} variant · {product.categoryId}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
