import type { PropsWithChildren } from 'react';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';

import { LogoutButton } from '@/components/auth';
import { AppHeader, AppShell } from '@/components/shared';
import { env } from '@/env';
import { requireServerUser } from '@/lib/supabase/auth';

function HeaderFallback() {
  return <span className="font-editorial text-2xl font-semibold tracking-[-0.04em]">Lello</span>;
}

export default async function WorkspaceLayout({ children }: PropsWithChildren) {
  if (env.isSupabaseEnabled) {
    const user = await requireServerUser();

    if (!user) {
      redirect('/login');
    }
  }

  return (
    <AppShell
      header={
        <Suspense fallback={<HeaderFallback />}>
          <AppHeader actions={<LogoutButton />} />
        </Suspense>
      }
    >
      {children}
    </AppShell>
  );
}
