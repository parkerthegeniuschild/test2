import { S, Step1 } from '@/app/(app)/jobs/(index)/_components';
import { Heading } from '@/components';

import { ProvidersBox } from './ProvidersBox';

export function Content() {
  return (
    <S.Content.Container
      css={{
        gap: 6,
        py: 5,
        px: 'var(--content-padding-x)',
      }}
    >
      <Heading as="h2" variant="subheading" fontSize="md" mb={-1}>
        Add customer info
      </Heading>

      <Step1.CustomerBox />

      <Step1.DispatchersBox />

      <Step1.DriversBox />

      <ProvidersBox />

      <Step1.CustomerReference />
    </S.Content.Container>
  );
}
