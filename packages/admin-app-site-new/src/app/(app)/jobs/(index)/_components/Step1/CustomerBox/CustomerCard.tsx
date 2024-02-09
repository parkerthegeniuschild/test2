import { useParams } from 'next/navigation';

import {
  useCustomerAtom,
  useShouldBlurSection,
} from '@/app/(app)/jobs/(index)/_atoms';
import { Avatar, Icon, Text, TextButton } from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

export function CustomerCard() {
  const shouldBlurSection = useShouldBlurSection();

  const customerAtom = useCustomerAtom();

  const isOnJobDetailsScreen = !!useParams().id;

  return (
    <Flex bgColor="rgba(1, 2, 3, 0.04)" p={3} rounded="lg" gap={2.3}>
      <Avatar icon={Icon.Building} />

      <Flex flexDir="column" justify="center" className={css({ flex: 1 })}>
        <Text fontWeight="semibold" color="gray.700">
          {customerAtom.data.company?.name}

          {!!customerAtom.data.company?.usdot && (
            <Text as="span" fontWeight="medium" color="gray.400" ml={1.75}>
              USDOT #{customerAtom.data.company.usdot}
            </Text>
          )}
        </Text>

        <Text
          fontWeight="medium"
          color="gray.400"
          mt={2.1}
          css={{ _empty: { display: 'none' } }}
        >
          {[
            customerAtom.data.company?.address1,
            customerAtom.data.company?.address2,
            customerAtom.data.company?.city,
            customerAtom.data.company?.state,
            customerAtom.data.company?.zipcode,
            customerAtom.data.company?.country,
          ]
            .filter(Boolean)
            .join(', ')}
        </Text>
      </Flex>

      <TextButton
        type="button"
        alignSelf="flex-start"
        colorScheme="gray"
        autoFocus={isOnJobDetailsScreen}
        tabIndex={shouldBlurSection ? -1 : undefined}
        onClick={customerAtom.goToAutocompleteState}
      >
        Change
      </TextButton>
    </Flex>
  );
}
