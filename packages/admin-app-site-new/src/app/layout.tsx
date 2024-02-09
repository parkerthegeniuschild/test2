import type { Metadata } from 'next';

import { serverEnv } from '@/env';
import { FiraCode, Inter } from '@/styles/font';

import { TestBanner, TopLoader } from './_components';
import { Providers } from './providers';

import '@/styles/global.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Truckup',
    default: 'Truckup',
  },
  icons: [
    {
      rel: 'icon',
      url:
        serverEnv.NEXT_PUBLIC_STAGE_NAME === 'prod'
          ? '/favicon.ico'
          : '/favicon_test.ico',
      sizes: 'any',
    },
    {
      rel: 'icon',
      url:
        serverEnv.NEXT_PUBLIC_STAGE_NAME === 'prod'
          ? '/favicon.svg'
          : '/favicon_test.svg',
      type: 'image/svg+xml',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${Inter.variable} ${FiraCode.variable}`}>
      <body>
        <TestBanner />

        <TopLoader showSpinner={false} height={2} shadow={false} />

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
