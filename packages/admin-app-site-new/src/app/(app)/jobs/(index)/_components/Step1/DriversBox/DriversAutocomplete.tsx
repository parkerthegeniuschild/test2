import { startTransition, useState } from 'react';

import { format } from '@/app/_utils';
import {
  MAX_DRIVERS_ALLOWED,
  useDispatcherAtom,
  useDriverAtom,
  useShouldBlurSection,
  useStep1Atom,
} from '@/app/(app)/jobs/(index)/_atoms';
import { Common } from '@/app/(app)/jobs/(index)/_components/styles';
import {
  Avatar,
  Button,
  Combobox,
  ErrorMessage,
  Icon,
  Modal,
  Text,
} from '@/components';
import { css } from '@/styled-system/css';
import { Box, Flex } from '@/styled-system/jsx';

import { DriversLabel } from './DriversLabel';

export function DriversAutocomplete() {
  const shouldBlurSection = useShouldBlurSection();

  const step1Atom = useStep1Atom();
  const driverAtom = useDriverAtom();
  const dispatcherAtom = useDispatcherAtom();

  const [isRemoveDriversModalOpen, setIsRemoveDriversModalOpen] =
    useState(false);

  const [driverName, setDriverName] = useState('');
  const [driverNameSearchValue, setDriverNameSearchValue] = useState('');

  const shouldShowError =
    step1Atom.data.shouldValidateFields &&
    (driverAtom.data.drivers?.length ?? 0) === 0;

  const matches = dispatcherAtom.data.dispatchers
    ?.filter(
      dispatcher =>
        !driverAtom.data.drivers?.some(driver => driver.id === dispatcher.id)
    )
    .filter(dispatcher =>
      `${dispatcher.firstname} ${dispatcher.lastname ?? ''}`
        .toLowerCase()
        .includes(driverNameSearchValue.toLowerCase())
    );

  function handleGoToNoDrivers() {
    if ((driverAtom.data.drivers?.length ?? 0) > 0) {
      setIsRemoveDriversModalOpen(true);
      return;
    }

    driverAtom.goToNoDriversState();
  }

  return (
    <Flex direction="column" gap={2}>
      <DriversLabel htmlFor="drivers-autocomplete" />

      <Combobox
        key={String(shouldBlurSection)}
        id="drivers-autocomplete"
        size="lg"
        placeholder="Search by person"
        error={shouldShowError}
        value={driverName}
        onChange={v => {
          setDriverName(v);
          startTransition(() => setDriverNameSearchValue(v));
        }}
        fixedSlot={
          <>
            <Combobox.Item
              value=""
              active={false}
              onClick={() => driverAtom.goToFormState(driverName.trim())}
            >
              <Icon.Plus className={css({ color: 'gray.700' })} />
              {driverName.trim().length > 0
                ? `Add “${driverName.trim()}” as driver`
                : 'Add new driver'}
            </Combobox.Item>
            <Combobox.Item
              css={{ color: 'danger' }}
              value=""
              active={false}
              onClick={handleGoToNoDrivers}
            >
              <Icon.UserX />
              No drivers on-site
            </Combobox.Item>
          </>
        }
        tabIndex={shouldBlurSection ? -1 : undefined}
        disabled={(driverAtom.data.drivers?.length ?? 0) >= MAX_DRIVERS_ALLOWED}
      >
        {(matches?.length ?? 0) > 0 &&
          matches?.map(dispatcher => (
            <Combobox.Item
              key={dispatcher.id}
              value=""
              active={false}
              onClick={() => driverAtom.addDriver(dispatcher)}
            >
              <Box
                css={{
                  width: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Avatar
                  size="sm"
                  userRole="driver"
                  name={`${dispatcher.firstname.trim()} ${
                    dispatcher.lastname?.trim() ?? ''
                  }`.trim()}
                  css={{ flexShrink: 0 }}
                />
              </Box>
              <Text
                css={{
                  color: 'gray.900',
                  fontWeight: 'semibold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <span className={css({ whiteSpace: 'nowrap' })}>
                  {dispatcher.firstname} {dispatcher.lastname}
                </span>
                <Text
                  as="span"
                  css={{
                    fontSize: 'xs',
                    fontWeight: 'normal',
                    _empty: { display: 'none' },
                  }}
                >
                  {!!dispatcher.phone && format.phoneNumber(dispatcher.phone)}
                  {!!dispatcher.secondary_phone && (
                    <>
                      <Common.Dot />
                      {format.phoneNumber(dispatcher.secondary_phone)}
                    </>
                  )}
                </Text>
              </Text>
            </Combobox.Item>
          ))}

        {(dispatcherAtom.data.dispatchers?.length ?? 0) > 0 &&
          matches?.length === 0 && (
            <Text textAlign="center" lineHeight="md" py={2.3}>
              No matches
            </Text>
          )}
      </Combobox>

      {shouldShowError && <ErrorMessage>Please select driver</ErrorMessage>}

      <Modal
        open={isRemoveDriversModalOpen}
        onClose={() => setIsRemoveDriversModalOpen(false)}
      >
        <Modal.Heading>Remove drivers?</Modal.Heading>
        <Modal.Description>
          You currently have drivers assigned to this job. Are you sure you want
          to remove all drivers from this job?
        </Modal.Description>

        <Flex justify="flex-end" align="center" gap={2} mt={3}>
          <Modal.Dismiss>Cancel</Modal.Dismiss>
          <Button size="sm" danger onClick={driverAtom.goToNoDriversState}>
            Remove drivers
          </Button>
        </Flex>
      </Modal>
    </Flex>
  );
}
