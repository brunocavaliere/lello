import type { PropsWithChildren } from 'react';
import { Suspense } from 'react';

import { AddBookSheet } from '@/components/books';
import { AppHeader, AppShell } from '@/components/shared';
import { isSupabaseConfigured } from '@/lib/supabase/config';

function HeaderFallback() {
  return <span className="font-editorial text-2xl font-semibold tracking-[-0.04em]">Lello</span>;
}

export default function WorkspaceLayout({ children }: PropsWithChildren) {
  const isConfigured = isSupabaseConfigured();

  return (
    <AppShell
      header={
        <Suspense fallback={<HeaderFallback />}>
          <AppHeader actions={isConfigured ? <AddBookSheet /> : undefined} />
        </Suspense>
      }
    >
      {children}
    </AppShell>
  );
}
