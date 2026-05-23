import type { Metadata } from 'next';

import { env } from '@/env';
import { AppProviders } from '@/providers';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Lello',
    template: '%s | Lello',
  },
  description: 'Um espaco calmo para lembrar melhor o que voce le.',
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
