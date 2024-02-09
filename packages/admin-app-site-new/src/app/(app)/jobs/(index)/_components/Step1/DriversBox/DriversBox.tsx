import {
  useDriverAtom,
  useShouldBlurSection,
} from '@/app/(app)/jobs/(index)/_atoms';
import { blurredStyles } from '@/app/(app)/jobs/(index)/_components/styles';
import { Box, Flex } from '@/styled-system/jsx';

import { DriversAutocomplete } from './DriversAutocomplete';
import { DriversCard } from './DriversCard';
import { DriversCreation } from './DriversCreation';
import { NoDriversOnSiteCard } from './NoDriversOnSiteCard';

export function DriversBox() {
  const shouldBlurSection = useShouldBlurSection();

  const driverAtom = useDriverAtom();

  return (
    <Flex direction="column" gap={2}>
      <Box css={shouldBlurSection ? blurredStyles.raw() : {}}>
        {driverAtom.data.state === 'noDrivers' ? (
          <NoDriversOnSiteCard />
        ) : (
          <DriversAutocomplete />
        )}
      </Box>

      {driverAtom.data.state === 'form' && <DriversCreation />}

      {driverAtom.data.drivers?.map(driver => (
        <DriversCard key={driver.id} driver={driver} />
      ))}
    </Flex>
  );
}
