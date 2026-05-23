import type { ReactNode } from 'react';

import Link from 'next/link';

import { ThemeToggle } from '@/components/shared/theme-toggle';

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-6 sm:px-6">
      <header className="flex items-center justify-between">
        <Link href="/" className="font-editorial text-2xl font-semibold tracking-[-0.04em]">
          Lello
        </Link>
        <ThemeToggle />
      </header>

      <div className="flex flex-1 flex-col justify-center py-10">
        <div className="space-y-3">
          <h1 className="font-editorial text-4xl leading-none font-semibold tracking-[-0.04em]">
            {title}
          </h1>
          <p className="text-muted-foreground text-sm leading-7">{description}</p>
        </div>

        <div className="mt-8 space-y-6">{children}</div>
        <div className="mt-8 text-sm">{footer}</div>
      </div>
    </main>
  );
}
