import { createUser } from '@/lib/catalog/actions';
import { currentUser } from '@/lib/catalog/session';
import { readCatalog } from '@/lib/catalog/store';

export default async function UsersPage() {
  const actor = await currentUser();
  const users = readCatalog().users.filter((user) => !user.devOnly);
  if (actor?.role !== 'admin') return <p>İstifadəçiləri yalnız admin idarə edir.</p>;
  return (
    <div>
      <h1 className="text-2xl font-semibold">İstifadəçilər</h1>
      <ul className="mt-4 text-sm">
        {users.map((user) => (
          <li key={user.id}>{user.username} · {user.role}</li>
        ))}
        {users.length === 0 && <li>Diskdə istifadəçi yoxdur. Lokal admin yalnız development rejimində yaddaşa əlavə olunur və repoya yazılmır.</li>}
      </ul>
      <form action={createUser} className="mt-6 grid max-w-md gap-2">
        <input name="username" required placeholder="istifadəçi" className="h-11 rounded-lg border px-2" />
        <input name="password" type="password" required minLength={8} placeholder="şifrə (ən az 8)" className="h-11 rounded-lg border px-2" />
        <select name="role" className="h-11 rounded-lg border px-2">
          <option value="editor">editor</option>
          <option value="admin">admin</option>
        </select>
        <button className="h-11 rounded-full bg-[#0A286E] font-semibold text-white">Yarat</button>
      </form>
    </div>
  );
}
