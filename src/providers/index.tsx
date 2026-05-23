'use client';

import type { PropsWithChildren } from 'react';

import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
      <QueryProvider>
        {children}
        <Toaster
          richColors
          closeButton
          position="bottom-center"
          offset={16}
          mobileOffset={16}
          toastOptions={{
            classNames: {
              toast: 'md:ml-auto',
            },
          }}
        />
      </QueryProvider>
    </ThemeProvider>
  );
}
