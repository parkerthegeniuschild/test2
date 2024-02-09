import Image from 'next/image';

import { VStack } from '@/styled-system/jsx';

export default function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <main>
      <VStack
        css={{
          h: '100vh',
          maxW: '22.5rem',
          mx: 'auto',
          gap: 16,
          justifyContent: 'center',
          alignItems: 'start',
        }}
      >
        <Image
          src="/assets/truckup_logo.svg"
          alt="Truckup"
          width={108}
          height={16}
          priority
        />

        {children}
      </VStack>
    </main>
  );
}
