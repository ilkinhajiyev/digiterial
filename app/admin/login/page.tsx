import { login } from '@/lib/catalog/actions';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold text-[#0A286E]">SOCHİ admin</h1>
      <p className="mt-2 text-sm text-[#4B5563]">Giriş serverdə yoxlanılır. Lokal mühitdə istifadəçi: admin.</p>
      {error && <p className="mt-3 text-sm text-red-700">İstifadəçi adı və ya şifrə yanlışdır.</p>}
      <form action={login} className="mt-6 grid gap-3 rounded-2xl border border-[#E4E7EB] bg-white p-4">
        <label className="text-sm">
          İstifadəçi
          <input name="username" autoComplete="username" required className="mt-1 h-11 w-full rounded-lg border border-[#D5DAE1] px-3" />
        </label>
        <label className="text-sm">
          Şifrə
          <input name="password" type="password" autoComplete="current-password" required className="mt-1 h-11 w-full rounded-lg border border-[#D5DAE1] px-3" />
        </label>
        <button className="h-11 rounded-full bg-[#0A286E] font-semibold text-white">Daxil ol</button>
      </form>
    </main>
  );
}
