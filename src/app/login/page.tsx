import { redirect } from 'next/navigation';

import { AuthFooterLink, AuthForm, AuthShell } from '@/components/auth';
import { env } from '@/env';
import { getServerUser } from '@/lib/supabase/auth';

export default async function LoginPage() {
  if (env.isSupabaseEnabled) {
    const user = await getServerUser();

    if (user) {
      redirect('/');
    }
  }

  return (
    <AuthShell
      title="Entrar"
      description="Volte para sua biblioteca pessoal e continue de onde parou."
      footer={<AuthFooterLink mode="login" />}
    >
      <AuthForm mode="login" />
    </AuthShell>
  );
}
