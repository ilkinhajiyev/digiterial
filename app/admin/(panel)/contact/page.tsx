import { saveSettings } from '@/lib/catalog/actions';
import { Trio } from '@/components/admin/fields';
import { currentUser } from '@/lib/catalog/session';
import { readCatalog } from '@/lib/catalog/store';

export default async function ContactAdminPage() {
  const user = await currentUser();
  const settings = readCatalog().settings;
  if (user?.role !== 'admin') return <p>Əlaqə məlumatını yalnız admin dəyişə bilər.</p>;
  return (
    <form action={saveSettings} className="grid max-w-xl gap-3">
      <h1 className="text-2xl font-semibold">Əlaqə</h1>
      <p className="text-sm text-amber-800">WhatsApp nömrəsi dərcdən əvvəl təsdiqlənməlidir. Təsdiq qutusu bunu qeyd edir, nömrəni avtomatik doğrulamır.</p>
      <label className="text-sm">WhatsApp E.164 (rəqəm)<input name="whatsappE164" defaultValue={settings.whatsappE164} className="mt-1 h-11 w-full rounded-lg border px-2" /></label>
      <label className="text-sm">WhatsApp görünüş<input name="whatsappDisplay" defaultValue={settings.whatsappDisplay} className="mt-1 h-11 w-full rounded-lg border px-2" /></label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="whatsappConfirmed" defaultChecked={settings.whatsappConfirmed} /> Nömrə təsdiqlənib</label>
      <label className="text-sm">Telefon<input name="phoneDisplay" defaultValue={settings.phoneDisplay} className="mt-1 h-11 w-full rounded-lg border px-2" /></label>
      <label className="text-sm">Telefon rəqəm<input name="phoneE164" defaultValue={settings.phoneE164} className="mt-1 h-11 w-full rounded-lg border px-2" /></label>
      <label className="text-sm">E-poçt<input name="email" defaultValue={settings.email} className="mt-1 h-11 w-full rounded-lg border px-2" /></label>
      <Trio name="city" value={settings.city} label="Şəhər" />
      <label className="text-sm">Küçə (boş = naməlum)<input name="addressLine" defaultValue={settings.addressLine || ''} className="mt-1 h-11 w-full rounded-lg border px-2" /></label>
      <button className="h-11 rounded-full bg-[#0A286E] font-semibold text-white">Yadda saxla</button>
    </form>
  );
}
