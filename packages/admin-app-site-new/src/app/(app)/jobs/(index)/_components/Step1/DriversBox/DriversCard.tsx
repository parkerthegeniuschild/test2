import { format } from '@/app/_utils';
import {
  useDriverAtom,
  useShouldBlurSection,
} from '@/app/(app)/jobs/(index)/_atoms';
import {
  blurredStyles,
  Common,
} from '@/app/(app)/jobs/(index)/_components/styles';
import type { Driver } from '@/app/(app)/jobs/(index)/_types';
import { Avatar, ButtonGroup, Icon, IconButton, Text } from '@/components';
import { css } from '@/styled-system/css';

import { DriverCardContainer } from './DriverCardContainer';
import { DriversEdition } from './DriversEdition';

interface DriversCardProps {
  driver: Driver;
}

export function DriversCard({ driver }: DriversCardProps) {
  const shouldBlurSection = useShouldBlurSection();

  const driverAtom = useDriverAtom();

  if (driverAtom.data.currentEditingDriverId === driver.id) {
    return <DriversEdition driver={driver} />;
  }

  return (
    <DriverCardContainer
      data-driver-card={driver.id}
      focusable={!shouldBlurSection}
      css={shouldBlurSection ? blurredStyles.raw() : {}}
    >
      <Avatar
        name={`${driver.firstname} ${driver.lastname?.trim() ?? ''}`.trim()}
        initialsProps={{ className: css({ color: 'primary.600!' }) }}
      />

      <div>
        <Text fontWeight="semibold" color="gray.700">
          {driver.firstname} {driver.lastname}
          {!!driver.email && (
            <Text as="span" fontWeight="medium" color="gray.400" ml={1.5}>
              {driver.email}
            </Text>
          )}
        </Text>
        <Text
          mt={2.1}
          fontWeight="medium"
          color="gray.400"
          css={{ _empty: { display: 'none' } }}
        >
          {!!driver.phone && format.phoneNumber(driver.phone)}
          {!!driver.secondary_phone && (
            <>
              <Common.Dot />
              {format.phoneNumber(driver.secondary_phone)}
            </>
          )}
        </Text>
      </div>

      <ButtonGroup
        className="actions-container"
        pos="absolute"
        right={1.5}
        top={1.5}
      >
        <IconButton
          title="Edit driver"
          onClick={() => driverAtom.setEditingDriver(driver.id)}
        >
          <Icon.Edit />
        </IconButton>
        <IconButton
          title="Remove driver"
          onClick={() => driverAtom.removeDriver(driver.id)}
        >
          <Icon.Trash className={css({ color: 'danger' })} />
        </IconButton>
      </ButtonGroup>
    </DriverCardContainer>
  );
}
