import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import AdminShell from '@/components/admin/shell';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect('/admin/login');
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      <AdminShell>{children}</AdminShell>
    </NextIntlClientProvider>
  );
}
