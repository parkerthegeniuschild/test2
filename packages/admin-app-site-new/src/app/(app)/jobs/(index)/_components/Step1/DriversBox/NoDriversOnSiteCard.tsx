import {
  useDriverAtom,
  useShouldBlurSection,
} from '@/app/(app)/jobs/(index)/_atoms';
import { Icon, Text, TextButton } from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

import { DriverCardContainer } from './DriverCardContainer';
import { DriversLabel } from './DriversLabel';

export function NoDriversOnSiteCard() {
  const shouldBlurSection = useShouldBlurSection();

  const driverAtom = useDriverAtom();

  return (
    <Flex direction="column" gap={2}>
      <DriversLabel as="p" />

      <DriverCardContainer alignItems="center" focusable={false}>
        <Flex w="1.625rem" h={3.5} justify="center" align="center">
          <Icon.UserX className={css({ color: 'danger' })} />
        </Flex>

        <Text fontWeight="semibold" color="gray.700" flex={1}>
          No drivers on-site
        </Text>

        <TextButton
          type="button"
          colorScheme="gray"
          tabIndex={shouldBlurSection ? -1 : undefined}
          onClick={driverAtom.goToAutocompleteState}
        >
          Change
        </TextButton>
      </DriverCardContainer>
    </Flex>
  );
}
