import { redirect } from 'next/navigation';

import { AuthFooterLink, AuthForm, AuthShell } from '@/components/auth';
import { env } from '@/env';
import { getServerUser } from '@/lib/supabase/auth';

export default async function SignupPage() {
  if (env.isSupabaseEnabled) {
    const user = await getServerUser();

    if (user) {
      redirect('/');
    }
  }

  return (
    <AuthShell
      title="Criar conta"
      description="Guarde seus livros, notas e áudios em um espaço só seu."
      footer={<AuthFooterLink mode="signup" />}
    >
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
