import Link from 'next/link';
import { redirect } from 'next/navigation';
import { logout } from '@/lib/catalog/actions';
import { currentUser } from '@/lib/catalog/session';

const LINKS = [
  ['/admin', 'Panel'],
  ['/admin/products', 'Məhsullar'],
  ['/admin/categories', 'Kateqoriyalar'],
  ['/admin/banners', 'Bannerlər'],
  ['/admin/content', 'Mətnlər'],
  ['/admin/contact', 'Əlaqə'],
  ['/admin/users', 'İstifadəçilər'],
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect('/admin/login');
  return (
    <div className="min-h-screen">
      <header className="border-b border-[#E4E7EB] bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <p className="font-semibold text-[#0A286E]">SOCHİ admin</p>
          <nav className="flex flex-wrap gap-3 text-sm">
            {LINKS.map(([href, label]) => (
              <Link key={href} href={href} className="underline">
                {label}
              </Link>
            ))}
          </nav>
          <p className="ml-auto text-sm text-[#4B5563]">{user.username} · {user.role}</p>
          <form action={logout}>
            <button className="h-10 rounded-full border border-[#D5DAE1] px-3 text-sm">Çıxış</button>
          </form>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </div>
  );
}
