'use client';

import type { ReactNode } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Search } from 'lucide-react';

import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type AppHeaderProps = {
  actions?: ReactNode;
  className?: string;
  searchPlaceholder?: string;
};

export function AppHeader({
  actions,
  className,
  searchPlaceholder = 'Buscar livros',
}: AppHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      <Link href="/" className="shrink-0">
        <span className="font-editorial text-2xl font-semibold tracking-[-0.04em]">Lello</span>
      </Link>

      <form
        className="relative hidden max-w-xl flex-1 md:block"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const query = String(formData.get('q') ?? '').trim();
          const params = new URLSearchParams();

          if (query) {
            params.set('q', query);
          }

          router.push(params.toString() ? `/?${params.toString()}` : '/');
        }}
      >
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          key={searchParams.toString()}
          name="q"
          defaultValue={searchParams.get('q') ?? ''}
          placeholder={searchPlaceholder}
          aria-label="Buscar livros"
          className="bg-muted/50 border-border/70 h-11 rounded-lg pr-4 pl-10 shadow-none"
        />
      </form>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        {actions}
      </div>
    </div>
  );
}
