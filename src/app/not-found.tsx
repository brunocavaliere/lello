import Link from 'next/link';

import { Compass } from 'lucide-react';

import { EmptyState } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { DEFAULT_ERROR_MESSAGES } from '@/lib/errors';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10 sm:px-6">
      <EmptyState
        title={DEFAULT_ERROR_MESSAGES.notFoundTitle}
        description="Esta pagina nao faz parte do seu espaco de leitura ou foi movida para outro lugar."
        icon={<Compass className="size-5" />}
        className="w-full"
        action={
          <Button asChild className="rounded-full">
            <Link href="/">Voltar para Lello</Link>
          </Button>
        }
      />
    </main>
  );
}
