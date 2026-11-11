import { saveAbout, saveService } from '@/lib/catalog/actions';
import { Trio } from '@/components/admin/fields';
import { readCatalog } from '@/lib/catalog/store';

export default function ContentPage() {
  const pages = readCatalog().pages;
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Tərcümələr və mətnlər</h1>
      <form action={saveAbout} className="grid gap-3 rounded-2xl border border-[#E4E7EB] bg-white p-4">
        <Trio name="title" value={pages.about.title} label="Haqqımızda başlıq" />
        <Trio name="lead" value={pages.about.lead} label="Giriş" area />
        <Trio name="why" value={pages.about.why} label="Niyə biz" area />
        <button className="h-11 rounded-full bg-[#0A286E] text-sm font-semibold text-white">Yadda saxla</button>
      </form>
      {pages.services.map((group) => (
        <section key={group.id} className="space-y-3">
          <form action={saveService} className="grid gap-3 rounded-2xl border border-[#E4E7EB] bg-white p-4">
            <input type="hidden" name="groupId" value={group.id} />
            <Trio name="title" value={group.title} label={group.id} />
            <Trio name="description" value={group.description} label="Təsvir" area />
            <button className="h-11 rounded-full border text-sm">Qrupu yadda saxla</button>
          </form>
          {group.items.map((item) => (
            <form key={item.id} action={saveService} className="grid gap-3 rounded-2xl border border-[#E4E7EB] bg-white p-4">
              <input type="hidden" name="groupId" value={group.id} />
              <input type="hidden" name="itemId" value={item.id} />
              <Trio name="title" value={item.title} label={item.id} />
              <Trio name="description" value={item.description} label="Təsvir" area />
              <button className="h-11 rounded-full border text-sm">Yadda saxla</button>
            </form>
          ))}
        </section>
      ))}
    </div>
  );
}
