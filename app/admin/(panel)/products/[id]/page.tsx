import { notFound } from 'next/navigation';
import { addProductImage, addProductPdf, addVariant, deleteProduct, deleteVariant, removeProductImage, removeProductPdf, saveProduct } from '@/lib/catalog/actions';
import { Trio } from '@/components/admin/fields';
import { readCatalog } from '@/lib/catalog/store';
import { currentUser } from '@/lib/catalog/session';

const AREAS = [
  ['dam', 'Dam'],
  ['fasad', 'Fasad'],
  ['temel', 'Təməl'],
  ['doseme', 'Döşəmə'],
  ['daxili', 'Daxili'],
] as const;

export default async function EditProduct({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const catalog = readCatalog();
  const product = catalog.products.find((item) => item.id === id);
  if (!product) notFound();
  const user = await currentUser();
  return (
    <div>
      <h1 className="text-2xl font-semibold">{product.name.az}</h1>
      {query.saved && <p className="mt-2 text-sm text-green-800">Yadda saxlanıldı. İctimai kataloq yalnız dərc olunmuş məhsulu göstərir.</p>}
      {query.error && <p className="mt-2 text-sm text-red-700">{query.error}</p>}
      <form action={saveProduct} className="mt-4 grid gap-4">
        <input type="hidden" name="id" value={product.id} />
        <div className="grid gap-3 rounded-2xl border border-[#E4E7EB] bg-white p-4 md:grid-cols-2">
          <Trio name="name" value={product.name} label="Ad" />
          <label className="text-sm">Slug<input name="slug" defaultValue={product.slug} className="mt-1 h-11 w-full rounded-lg border px-2" /></label>
          <label className="text-sm">Ailə<input name="family" defaultValue={product.family} className="mt-1 h-11 w-full rounded-lg border px-2" /></label>
          <label className="text-sm">Brend (boş = naməlum)<input name="brand" defaultValue={product.brand || ''} className="mt-1 h-11 w-full rounded-lg border px-2" /></label>
          <label className="text-sm">Status
            <select name="status" defaultValue={product.status} className="mt-1 h-11 w-full rounded-lg border px-2">
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </label>
          <label className="text-sm">Kateqoriya
            <select name="categoryId" defaultValue={product.categoryId} className="mt-1 h-11 w-full rounded-lg border px-2">
              {catalog.categories.map((category) => <option key={category.id} value={category.id}>{category.name.az}</option>)}
            </select>
          </label>
          <label className="text-sm">Alt kateqoriya
            <select name="subcategoryId" defaultValue={product.subcategoryId} className="mt-1 h-11 w-full rounded-lg border px-2">
              {catalog.categories.flatMap((category) => category.subs.map((sub) => <option key={sub.id} value={sub.id}>{category.name.az} / {sub.name.az}</option>))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={product.featured} /> Seçilmiş</label>
        </div>
        {product.variants.map((variant) => (
          <fieldset key={variant.id} className="grid gap-3 rounded-2xl border border-[#E4E7EB] bg-white p-4">
            <legend className="px-1 text-sm font-semibold">{variant.name.az}</legend>
            <Trio name={`v_${variant.id}_name`} value={variant.name} label="Variant adı" />
            <Trio name={`v_${variant.id}_description`} value={variant.description} label="Təsvir" area />
            <div className="grid gap-3 md:grid-cols-4">
              <label className="text-sm">Artikul (boş = naməlum)<input name={`v_${variant.id}_sku`} defaultValue={variant.sku || ''} className="mt-1 h-11 w-full rounded-lg border px-2" /></label>
              <label className="text-sm">Qiymət AZN (boş = naməlum)<input name={`v_${variant.id}_price`} defaultValue={variant.price?.amount ?? ''} className="mt-1 h-11 w-full rounded-lg border px-2" /></label>
              <label className="text-sm">Stok
                <select name={`v_${variant.id}_stock`} defaultValue={variant.stock?.status || 'unknown'} className="mt-1 h-11 w-full rounded-lg border px-2">
                  <option value="unknown">naməlum</option>
                  <option value="in">stokda</option>
                  <option value="out">yoxdur</option>
                </select>
              </label>
              <label className="text-sm">Say (boş ola bilər)<input name={`v_${variant.id}_qty`} defaultValue={variant.stock?.qty ?? ''} className="mt-1 h-11 w-full rounded-lg border px-2" /></label>
              <label className="text-sm">Vahid
                <select name={`v_${variant.id}_unit`} defaultValue={variant.unit || ''} className="mt-1 h-11 w-full rounded-lg border px-2">
                  <option value="">naməlum</option>
                  <option value="rulon">rulon</option>
                  <option value="litr">litr</option>
                  <option value="kq">kq</option>
                  <option value="m2">m²</option>
                </select>
              </label>
              <label className="text-sm">Qalınlıq mm<input name={`v_${variant.id}_thickness`} defaultValue={variant.thicknessMm ?? ''} className="mt-1 h-11 w-full rounded-lg border px-2" /></label>
              <label className="text-sm">Status
                <select name={`v_${variant.id}_status`} defaultValue={variant.status} className="mt-1 h-11 w-full rounded-lg border px-2">
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                  <option value="archived">archived</option>
                </select>
              </label>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              {AREAS.map(([key, label]) => (
                <label key={key} className="flex items-center gap-1">
                  <input type="checkbox" name={`v_${variant.id}_area_${key}`} defaultChecked={variant.applicationAreas.includes(key)} /> {label}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <button className="h-12 rounded-full bg-[#0A286E] font-semibold text-white">Yadda saxla</button>
      </form>
      <div className="mt-4 flex flex-wrap gap-3">
        <form action={addVariant}><input type="hidden" name="id" value={product.id} /><button className="h-11 rounded-full border px-4 text-sm">Variant əlavə et</button></form>
        {user?.role === 'admin' && product.variants.map((variant) => (
          <form key={variant.id} action={deleteVariant}>
            <input type="hidden" name="id" value={product.id} />
            <input type="hidden" name="variantId" value={variant.id} />
            <button className="h-11 rounded-full border px-4 text-sm">Sil: {variant.name.az}</button>
          </form>
        ))}
      </div>
      <section className="mt-8">
        <h2 className="font-semibold">Şəkillər və PDF</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {product.images.map((image) => (
            <li key={image.src} className="flex items-center gap-3">
              <img src={image.src} alt="" className="h-12 w-12 object-contain" />
              <span className="truncate">{image.src}</span>
              <form action={removeProductImage}>
                <input type="hidden" name="id" value={product.id} />
                <input type="hidden" name="src" value={image.src} />
                <button className="underline">Sil</button>
              </form>
            </li>
          ))}
          {product.pdfs.map((pdf) => (
            <li key={pdf.id}>
              <a className="underline" href={pdf.src}>{pdf.title.az}</a>
              <form action={removeProductPdf} className="inline">
                <input type="hidden" name="id" value={product.id} />
                <input type="hidden" name="pdfId" value={pdf.id} />
                <button className="ml-2 underline">Sil</button>
              </form>
            </li>
          ))}
        </ul>
        <form action={addProductImage} className="mt-3 flex gap-2">
          <input type="hidden" name="id" value={product.id} />
          <input type="file" name="file" accept="image/jpeg,image/png,image/webp" required />
          <button className="h-10 rounded-full border px-3 text-sm">Şəkil yüklə</button>
        </form>
        <form action={addProductPdf} className="mt-3 grid gap-2 md:grid-cols-3">
          <input type="hidden" name="id" value={product.id} />
          <input name="pdf_az" placeholder="PDF adı AZ" className="h-10 rounded-lg border px-2" />
          <input name="pdf_en" placeholder="PDF title EN" className="h-10 rounded-lg border px-2" />
          <input name="pdf_ru" placeholder="PDF RU" className="h-10 rounded-lg border px-2" />
          <input type="file" name="file" accept="application/pdf" required />
          <button className="h-10 rounded-full border px-3 text-sm">PDF yüklə</button>
        </form>
      </section>
      {user?.role === 'admin' && (
        <form action={deleteProduct} className="mt-8">
          <input type="hidden" name="id" value={product.id} />
          <button className="text-sm text-red-700 underline">Məhsulu sil</button>
        </form>
      )}
    </div>
  );
}
