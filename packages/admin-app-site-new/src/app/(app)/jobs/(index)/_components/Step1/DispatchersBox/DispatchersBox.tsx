import {
  useDispatcherAtom,
  useShouldBlurSection,
} from '@/app/(app)/jobs/(index)/_atoms';
import { blurredStyles } from '@/app/(app)/jobs/(index)/_components/styles';
import { Box, Flex } from '@/styled-system/jsx';

import { DispatchersAutocomplete } from './DispatchersAutocomplete';
import { DispatchersCard } from './DispatchersCard';
import { DispatchersCreation } from './DispatchersCreation';

export function DispatchersBox() {
  const shouldBlurSection = useShouldBlurSection();

  const dispatcherAtom = useDispatcherAtom();

  return (
    <Flex direction="column" gap={2}>
      <Box css={shouldBlurSection ? blurredStyles.raw() : {}}>
        <DispatchersAutocomplete />
      </Box>

      {dispatcherAtom.data.state === 'form' && <DispatchersCreation />}

      {dispatcherAtom.data.dispatchers?.map(dispatcher => (
        <DispatchersCard key={dispatcher.id} dispatcher={dispatcher} />
      ))}
    </Flex>
  );
}
