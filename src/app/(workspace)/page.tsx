import { Suspense } from 'react';

import { LibraryView } from '@/components/books';
import { LoadingState, PageContainer } from '@/components/shared';

function LibraryFallback() {
  return (
    <PageContainer className="mx-auto w-full max-w-6xl">
      <LoadingState title="Abrindo biblioteca" description="Carregando livros e notas." lines={4} />
    </PageContainer>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<LibraryFallback />}>
      <LibraryView />
    </Suspense>
  );
}
