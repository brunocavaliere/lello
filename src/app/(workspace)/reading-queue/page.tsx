import { Suspense } from 'react';

import { LibraryView } from '@/components/books';
import { LoadingState, PageContainer } from '@/components/shared';

export default function ReadingQueuePage() {
  return (
    <Suspense
      fallback={
        <PageContainer className="mx-auto w-full max-w-6xl">
          <LoadingState
            title="Abrindo fila de leitura"
            description="Carregando seus próximos livros."
            lines={4}
          />
        </PageContainer>
      }
    >
      <LibraryView scope="want_to_read" />
    </Suspense>
  );
}
