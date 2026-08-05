import { redirect } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import AdminShell from '@/components/admin/shell';
import { requireAdmin } from '@/lib/security/admin';

// Admin pages depend on the signed-in user and Supabase runtime credentials.
// They must never be evaluated while producing the public static build.
export const dynamic = 'force-dynamic';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch {
    redirect('/admin/login');
  }

  return (
    <NextIntlClientProvider messages={{}}>
      <AdminShell>{children}</AdminShell>
    </NextIntlClientProvider>
  );
}
