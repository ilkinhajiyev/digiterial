import { createClient } from '@/lib/supabase/server';
import SettingsForm from '@/components/admin/settings-form';
import { getSettings } from '@/lib/data/settings';

export default async function Page() {
  // Auth yoxla
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();

  // Mövcud settings-i oxu
  const current = await getSettings();

  return (
    <>
      <h1 className="font-display text-2xl font-bold mb-1">Tənzimləmələr</h1>
      <p className="text-white/40 text-sm mb-6">Sayt məlumatları, əlaqə və sosial media</p>
      <SettingsForm current={current} />
    </>
  );
}
