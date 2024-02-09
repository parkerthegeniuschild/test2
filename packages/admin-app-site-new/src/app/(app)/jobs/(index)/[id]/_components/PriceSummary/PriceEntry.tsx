import { S } from '@/app/(app)/jobs/(index)/_components';
import { ButtonGroup, Icon, IconButton, Text } from '@/components';
import { css } from '@/styled-system/css';
import { Flex, styled } from '@/styled-system/jsx';

const Container = styled(S.Common.ActionButtonsContainer, {
  base: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 4,
    outlineOffset: '10px',
  },
});

interface PriceEntryProps {
  type: string;
  date: string;
  description: string;
  value: string;
  onEditRequest?: () => void;
  onDeleteRequest?: () => void;
}

export function PriceEntry({
  date,
  description,
  type,
  value,
  onEditRequest,
  onDeleteRequest,
}: PriceEntryProps) {
  return (
    <Container disabled={type.toLowerCase() === 'credit card'}>
      <Flex direction="column" gap={1.5}>
        <Flex gap={1.5} align="baseline" pos="relative" maxW="max">
          <Text as="strong" fontWeight="medium" color="gray.700">
            {type}
          </Text>

          {type.toLowerCase() === 'discount' && (
            <Icon.Scissors
              className={css({ alignSelf: 'center', color: 'primary' })}
            />
          )}

          <Text size="sm">{date}</Text>

          <ButtonGroup
            className="actions-container"
            pos="absolute"
            top={-2}
            right={-1.5}
            transform="translateX(100%)"
          >
            <IconButton title="Edit payment" onClick={onEditRequest}>
              <Icon.Edit />
            </IconButton>
            <IconButton title="Delete payment" onClick={onDeleteRequest}>
              <Icon.Trash className={css({ color: 'danger' })} />
            </IconButton>
          </ButtonGroup>
        </Flex>

        <Text lineHeight="md" fontWeight="medium">
          {description}
        </Text>
      </Flex>

      <Text minW={5} fontWeight="medium" color="primary" textAlign="right">
        {value}
      </Text>
    </Container>
  );
}
