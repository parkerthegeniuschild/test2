import { useStateWithDebounce } from '@/app/(app)/_hooks';
import {
  useCustomerAtom,
  useShouldBlurSection,
} from '@/app/(app)/jobs/(index)/_atoms';
import { useGetCompanies } from '@/app/(app)/jobs/(index)/create/_api';
import { Avatar, Combobox, Icon, Label, Text } from '@/components';
import { css } from '@/styled-system/css';
import { Box, Flex } from '@/styled-system/jsx';

interface CustomerAutocompleteProps {
  showOnFocus?: boolean;
}

export function CustomerAutocomplete({
  showOnFocus = false,
}: CustomerAutocompleteProps) {
  const shouldBlurSection = useShouldBlurSection();

  const customerAtom = useCustomerAtom();

  const [
    customerName,
    setCustomerName,
    debouncedCustomerName,
    setDebouncedCustomerName,
  ] = useStateWithDebounce('');

  const getCompanies = useGetCompanies({ name: debouncedCustomerName });

  return (
    <Flex direction="column" gap={2}>
      <Label htmlFor="customer-autocomplete" color="gray.600" maxW="max">
        Company
      </Label>

      <Combobox
        id="customer-autocomplete"
        size="lg"
        placeholder="Search by company"
        autoFocus
        autoSelect={false}
        showOnFocus={showOnFocus}
        fixedSlot={
          <Combobox.Item
            onClick={() => customerAtom.goToFormState(customerName.trim())}
          >
            <Icon.Plus className={css({ color: 'gray.700' })} />
            {customerName.trim().length > 0
              ? `Add “${customerName.trim()}” as company`
              : 'Add new company'}
          </Combobox.Item>
        }
        tabIndex={shouldBlurSection ? -1 : undefined}
        value={customerName}
        onChange={value => {
          if (!value) {
            setDebouncedCustomerName('');
          }

          setCustomerName(value);
        }}
      >
        {getCompanies.data?.map(company => (
          <Combobox.Item
            key={company.id}
            value={company.id.toString()}
            onClick={() => customerAtom.goToCardState(company)}
            css={{ gap: 1.5 }}
            endSlot={
              <Text
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  fontWeight: 'medium',
                }}
              >
                <Text as="span" css={{ fontSize: '2xs.xl' }}>
                  <Icon.Building />
                </Text>
                Company
              </Text>
            }
          >
            <Box
              css={{
                width: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Avatar size="sm" icon={Icon.Building} css={{ flexShrink: 0 }} />
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
              <span
                className={css({
                  lineHeight: 'sm',
                  whiteSpace: 'nowrap',
                })}
              >
                {company.name}
              </span>
              {!!company.usdot && (
                <Text as="span" css={{ fontSize: 'xs', fontWeight: 'normal' }}>
                  {`USDOT #${company.usdot}`}
                </Text>
              )}
            </Text>
          </Combobox.Item>
        ))}

        {getCompanies.data?.length === 0 && (
          <Text textAlign="center" lineHeight="md" py={2.3}>
            No matches
          </Text>
        )}
      </Combobox>

      {/* <Text lineHeight="1.25rem">
        <strong className={css({ fontWeight: 'semibold' })}>Ask:</strong> What
        is the name of the company or person paying for this job?
      </Text> */}
    </Flex>
  );
}
