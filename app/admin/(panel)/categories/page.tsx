import { saveCategory } from '@/lib/catalog/actions';
import { Trio } from '@/components/admin/fields';
import { readCatalog } from '@/lib/catalog/store';

export default function CategoriesPage() {
  const catalog = readCatalog();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Kateqoriyalar</h1>
      {catalog.categories.map((category) => (
        <form key={category.id} action={saveCategory} className="grid gap-3 rounded-2xl border border-[#E4E7EB] bg-white p-4">
          <input type="hidden" name="id" value={category.id} />
          <Trio name="name" value={category.name} label={category.id} />
          <Trio name="summary" value={category.summary} label="Xülasə" area />
          {category.subs.map((sub) => (
            <Trio key={sub.id} name={`sub_${sub.id}`} value={sub.name} label={sub.id} />
          ))}
          <button className="h-11 rounded-full bg-[#0A286E] text-sm font-semibold text-white">Yadda saxla</button>
        </form>
      ))}
    </div>
  );
}
