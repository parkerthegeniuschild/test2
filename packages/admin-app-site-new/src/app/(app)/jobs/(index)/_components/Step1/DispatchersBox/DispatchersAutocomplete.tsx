import { HelpTooltip } from '@/app/(app)/_components';
import { useStateWithDebounce } from '@/app/(app)/_hooks';
import {
  MAX_DISPATCHERS_ALLOWED,
  useCustomerAtom,
  useDispatcherAtom,
  useShouldBlurSection,
  useStep1Atom,
} from '@/app/(app)/jobs/(index)/_atoms';
import { Common } from '@/app/(app)/jobs/(index)/_components/styles';
import { useGetDispatchers } from '@/app/(app)/jobs/(index)/create/_api';
import { Avatar, Combobox, ErrorMessage, Icon, Text } from '@/components';
import { css } from '@/styled-system/css';
import { Box, Flex } from '@/styled-system/jsx';

import { DispatchersLabel } from './DispatchersLabel';

export function DispatchersAutocomplete() {
  const shouldBlurSection = useShouldBlurSection();

  const step1Atom = useStep1Atom();
  const customerAtom = useCustomerAtom();
  const dispatcherAtom = useDispatcherAtom();

  const [
    dispatcherName,
    setDispatcherName,
    debouncedDispatcherName,
    setDebouncedDispatcherName,
  ] = useStateWithDebounce('');

  const getDispatchers = useGetDispatchers({
    companyId: customerAtom.data.company?.id,
    name: debouncedDispatcherName,
  });

  const shouldShowError =
    step1Atom.data.shouldValidateFields &&
    (dispatcherAtom.data.dispatchers?.length ?? 0) === 0;

  return (
    <Flex direction="column" gap={2}>
      <Flex align="center" gap={1.5}>
        <DispatchersLabel htmlFor="dispatchers-autocomplete" />

        <HelpTooltip
          description="Any individuals coordinating this repair"
          tabIndex={-1}
        />
      </Flex>

      <Combobox
        key={String(shouldBlurSection)}
        id="dispatchers-autocomplete"
        size="lg"
        placeholder="Search by person"
        fixedSlot={
          <Combobox.Item
            value=""
            active={false}
            onClick={() => dispatcherAtom.goToFormState(dispatcherName.trim())}
          >
            <Icon.Plus className={css({ color: 'gray.700' })} />
            {dispatcherName.trim().length > 0
              ? `Add “${dispatcherName.trim()}” as dispatcher`
              : 'Add new dispatcher'}
          </Combobox.Item>
        }
        tabIndex={shouldBlurSection ? -1 : undefined}
        disabled={
          (dispatcherAtom.data.dispatchers?.length ?? 0) >=
          MAX_DISPATCHERS_ALLOWED
        }
        error={shouldShowError}
        value={dispatcherName}
        onChange={value => {
          if (!value) {
            setDebouncedDispatcherName('');
          }

          setDispatcherName(value);
        }}
      >
        {getDispatchers.data?.map(dispatcher => (
          <Combobox.Item
            key={dispatcher.id}
            value=""
            active={false}
            onClick={() => dispatcherAtom.addDispatcher(dispatcher)}
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
                userRole="dispatcher"
                name={dispatcher.name}
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
                {dispatcher.name}
              </span>
              <Text
                as="span"
                css={{
                  fontSize: 'xs',
                  fontWeight: 'normal',
                  _empty: { display: 'none' },
                }}
              >
                {dispatcher.formattedPhone}
                {!!dispatcher.formattedSecondaryPhone && (
                  <>
                    <Common.Dot />
                    {dispatcher.formattedSecondaryPhone}
                  </>
                )}
              </Text>
            </Text>
          </Combobox.Item>
        ))}

        {getDispatchers.data?.length === 0 && (
          <Text textAlign="center" lineHeight="md" py={2.3}>
            No matches
          </Text>
        )}
      </Combobox>

      {shouldShowError && <ErrorMessage>Please select dispatcher</ErrorMessage>}
    </Flex>
  );
}
