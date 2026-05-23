import { AppShell, LoadingState, PageContainer } from '@/components/shared';

export default function Loading() {
  return (
    <AppShell
      header={
        <span className="font-editorial text-2xl font-semibold tracking-[-0.04em]">Lello</span>
      }
    >
      <PageContainer className="mx-auto w-full max-w-6xl">
        <LoadingState
          title="Abrindo biblioteca"
          description="Carregando livros e notas."
          lines={4}
        />
      </PageContainer>
    </AppShell>
  );
}
