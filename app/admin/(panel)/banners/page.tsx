import { addBanner, saveBanner } from '@/lib/catalog/actions';
import { Trio } from '@/components/admin/fields';
import { readCatalog } from '@/lib/catalog/store';

export default function BannersPage() {
  const banners = readCatalog().banners;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Bannerlər</h1>
      {banners.map((banner) => (
        <form key={banner.id} action={saveBanner} className="grid gap-3 rounded-2xl border border-[#E4E7EB] bg-white p-4">
          <input type="hidden" name="id" value={banner.id} />
          <img src={banner.image} alt="" className="h-32 w-full object-contain" />
          <Trio name="title" value={banner.title} label="Başlıq" />
          <Trio name="subtitle" value={banner.subtitle} label="Mətn" area />
          <label className="text-sm">Keçid<input name="href" defaultValue={banner.href} className="mt-1 h-11 w-full rounded-lg border px-2" /></label>
          <label className="text-sm">Şəkil ünvanı<input name="image" defaultValue={banner.image} className="mt-1 h-11 w-full rounded-lg border px-2" /></label>
          <select name="status" defaultValue={banner.status} className="h-11 rounded-lg border px-2">
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
          <button className="h-11 rounded-full bg-[#0A286E] text-sm font-semibold text-white">Yadda saxla</button>
        </form>
      ))}
      <form action={addBanner} className="grid gap-2 rounded-2xl border border-dashed border-[#D5DAE1] p-4">
        <Trio name="title" value={{ az: '', en: '', ru: '' }} label="Yeni banner" />
        <input type="file" name="file" accept="image/jpeg,image/png,image/webp" />
        <button className="h-11 rounded-full border text-sm">Banner əlavə et</button>
      </form>
    </div>
  );
}
