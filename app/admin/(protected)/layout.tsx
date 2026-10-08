import { redirect } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import AdminShell from '@/components/admin/shell';
import { getStaff } from '@/lib/auth/guard';

// Admin səhifələri daxil olmuş istifadəçidən asılıdır — statik build-ə düşməməlidir.
export const dynamic = 'force-dynamic';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const staff = await getStaff();
  if (!staff) redirect('/admin/login?e=role');
  return (
    <NextIntlClientProvider messages={{}}>
      <AdminShell email={staff.email} role={staff.role}>{children}</AdminShell>
    </NextIntlClientProvider>
  );
}
