import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { NextIntlClientProvider } from 'next-intl';
import AdminShell from '@/components/admin/shell';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const sb = await createClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) redirect('/admin/login');
  } catch {
    redirect('/admin/login');
  }

  return (
    <NextIntlClientProvider messages={{}}>
      <AdminShell>{children}</AdminShell>
    </NextIntlClientProvider>
  );
}
