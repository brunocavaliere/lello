import { Suspense } from 'react';

import { LibraryView } from '@/components/books';
import { LoadingState, PageContainer } from '@/components/shared';

export default function LibraryPage() {
  return (
    <Suspense
      fallback={
        <PageContainer className="mx-auto w-full max-w-6xl">
          <LoadingState
            title="Abrindo biblioteca"
            description="Carregando seus livros."
            lines={4}
          />
        </PageContainer>
      }
    >
      <LibraryView />
    </Suspense>
  );
}
