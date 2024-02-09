import * as Ariakit from '@ariakit/react';

import { S } from '@/app/(app)/jobs/(index)/_components';
import { useIsJobUnlocked } from '@/app/(app)/jobs/(index)/[id]/_components/UnlockedOnly';
import { Icon, Text, TextButton } from '@/components';
import { Flex, styled } from '@/styled-system/jsx';

const Container = styled(Ariakit.Focusable, {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    pos: 'relative',

    '& .earning-entry-value, & .earning-entry-button-group': {
      transitionProperty: 'opacity, visibility',
      transitionDuration: 'fast',
      transitionTimingFunction: 'easeInOut',
    },

    '& .earning-entry-button-group': {
      opacity: 0,
      visibility: 'hidden',
      pointerEvents: 'none',
    },

    '&:is(:hover, :focus-within, [data-focus-visible])': {
      '& .earning-entry-button-group': {
        opacity: 1,
        visibility: 'visible',
        pointerEvents: 'auto',
      },

      '& .earning-entry-value': {
        opacity: 0,
        visibility: 'hidden',
        pointerEvents: 'none',
      },
    },
  },
});

interface EarningEntryProps {
  description: string;
  quantity: number;
  value: string;
  totalValue: string;
  allowDelete?: boolean;
  blur?: boolean;
  onEditRequest?: () => void;
  onDeleteRequest?: () => void;
}

export function EarningEntry({
  description,
  quantity,
  value,
  totalValue,
  allowDelete = true,
  blur,
  onEditRequest,
  onDeleteRequest,
}: EarningEntryProps) {
  const isJobUnlocked = useIsJobUnlocked();

  return (
    <Container
      disabled={!isJobUnlocked}
      css={blur ? S.blurredStyles.raw() : {}}
      {...{ inert: blur ? '' : undefined }}
    >
      <Text flex={1} fontWeight="medium" color="gray.700">
        {description}
      </Text>
      <Text size="sm">
        {quantity} @ {value}
      </Text>
      <Text
        minW="5rem"
        textAlign="right"
        fontWeight="medium"
        color="gray.700"
        className="earning-entry-value"
      >
        {totalValue}
      </Text>

      <Flex
        align="center"
        gap={3}
        right={0}
        pos="absolute"
        className="earning-entry-button-group"
      >
        <TextButton
          colorScheme="lightGray"
          size="md"
          title="Edit earning"
          onClick={onEditRequest}
        >
          <Icon.Edit />
        </TextButton>
        {allowDelete && (
          <TextButton
            colorScheme="danger"
            size="md"
            title="Delete earning"
            onClick={onDeleteRequest}
          >
            <Icon.Trash />
          </TextButton>
        )}
      </Flex>
    </Container>
  );
}
